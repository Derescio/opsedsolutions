import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { PrismaClient } from '@/lib/generated/prisma'
import { SubscriptionStatus, PaymentStatus, PaymentType, InvoiceStatus } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

// TypeScript interfaces for Stripe webhook events
interface StripeEvent {
  type: string
  data: {
    object: StripeCheckoutSession | StripeSubscription | StripeInvoice | StripePaymentIntent
  }
}

interface StripeCheckoutSession {
  id: string
  customer: string
  subscription?: string
  payment_intent?: string
  metadata?: Record<string, string>
  amount_total?: number
  currency?: string
}

interface StripeSubscription {
  id: string
  customer: string
  status: string
  current_period_start: number
  current_period_end: number
  cancel_at_period_end: boolean
  canceled_at?: number | null
  ended_at?: number | null
  trial_end?: number | null
  trial_start?: number | null
  items: {
    data: Array<{
      price: {
        id: string
        unit_amount: number
        currency: string
        metadata?: Record<string, string>
      }
    }>
  }
  metadata?: Record<string, string>
}

interface StripeInvoice {
  id: string
  customer: string
  subscription?: string
  status: string
  total: number
  currency: string
  hosted_invoice_url?: string
  invoice_pdf?: string
  number?: string | null
  subtotal?: number
  tax?: number
  description?: string | null
  created: number
  due_date?: number | null
  metadata?: Record<string, string>
}

interface StripePaymentIntent {
  id: string
  amount: number
  currency: string
  customer?: string
  description?: string | null
  latest_charge?: string
  metadata?: Record<string, string>
}

interface StripeCharge {
  id: string
  receipt_url?: string | null
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event: StripeEvent

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    ) as StripeEvent
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Webhook signature verification failed:', errorMessage)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('Received event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as StripeCheckoutSession)
        break

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as StripeSubscription)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as StripeSubscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as StripeSubscription)
        break

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as StripeInvoice)
        break

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as StripeInvoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error processing webhook:', errorMessage)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Handle successful checkout session
async function handleCheckoutSessionCompleted(session: StripeCheckoutSession) {
  console.log('Checkout session completed:', session.id)
  
  try {
    const customerId = session.customer
    const subscriptionId = session.subscription
    const paymentIntentId = session.payment_intent
    
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId }
    })

    if (!user) {
      console.error('User not found for customer:', customerId)
      return
    }

    // If it's a subscription checkout, the subscription will be handled by subscription.created
    // If it's a one-time payment, create a payment record
    if (paymentIntentId && !subscriptionId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      
      // Get receipt URL from latest charge if available
      let receiptUrl = null
      if (paymentIntent.latest_charge) {
        const charge: StripeCharge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
        receiptUrl = charge.receipt_url
      }
      
      await prisma.payment.create({
        data: {
          userId: user.id,
          stripePaymentIntentId: paymentIntentId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: PaymentStatus.SUCCEEDED,
          type: PaymentType.ONE_TIME,
          description: paymentIntent.description || 'One-time payment',
          receiptUrl,
          metadata: paymentIntent.metadata || {}
        }
      })

      // Get project ID for both invoice creation and project updates
      const projectId = paymentIntent.metadata?.projectId || session.metadata?.projectId

      // Create invoice record for project payments
      if (projectId) {
        // Check if invoice already exists for this payment
        const existingInvoice = await prisma.invoice.findFirst({
          where: { 
            AND: [
              { userId: user.id },
              { description: { contains: projectId } },
              { stripeInvoiceId: paymentIntentId }
            ]
          }
        })

        if (!existingInvoice) {
          // Create invoice record
          await prisma.invoice.create({
            data: {
              userId: user.id,
              stripeInvoiceId: paymentIntentId,
              number: `PAY-${Date.now()}`,
              status: InvoiceStatus.PAID,
              subtotal: paymentIntent.amount,
              tax: 0,
              total: paymentIntent.amount,
              currency: paymentIntent.currency,
              description: `Project Payment - ${paymentIntent.description || 'Project Payment'}`,
              invoiceDate: new Date(),
              paidAt: new Date(),
              invoiceUrl: receiptUrl,
              pdfUrl: receiptUrl
            }
          })
          console.log(`Invoice created for checkout session payment ${paymentIntentId}`)
        }

        // Update project paid amount
        const project = await prisma.project.findUnique({
          where: { id: projectId },
          include: {
            payments: {
              where: { status: PaymentStatus.SUCCEEDED }
            }
          }
        })

        if (project) {
          // Calculate total paid amount from all successful payments
          const totalPaid = project.payments.reduce((sum, p) => sum + p.amount, 0)
          
          // Update project with new paid amount
          await prisma.project.update({
            where: { id: projectId },
            data: { 
              paidAmount: totalPaid,
              // If fully paid, update status to IN_PROGRESS
              ...(totalPaid >= project.totalAmount && project.status === 'QUOTE_APPROVED' && {
                status: 'IN_PROGRESS'
              })
            }
          })

          console.log(`Project ${projectId} paid amount updated to ${totalPaid} via checkout session`)
        } else {
          console.error('Project not found:', projectId)
        }
      }
    }

    console.log('Checkout session processed successfully')
  } catch (error) {
    console.error('Error processing checkout session:', error)
  }
}

// Handle subscription created
async function handleSubscriptionCreated(subscription: StripeSubscription) {
  console.log('Subscription created:', subscription.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: subscription.customer }
    })

    if (!user) {
      console.error('User not found for customer:', subscription.customer)
      return
    }

    // Create subscription record
    await prisma.subscription.create({
      data: {
        userId: user.id,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCustomerId: subscription.customer,
        status: mapStripeSubscriptionStatus(subscription.status),
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      }
    })

    console.log('Subscription created successfully')
  } catch (error) {
    console.error('Error creating subscription:', error)
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(subscription: StripeSubscription) {
  console.log('Subscription updated:', subscription.id)
  
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: mapStripeSubscriptionStatus(subscription.status),
        stripePriceId: subscription.items.data[0].price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
        endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : null,
        trialStart: subscription.trial_start ? new Date(subscription.trial_start * 1000) : null,
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
      }
    })

    console.log('Subscription updated successfully')
  } catch (error) {
    console.error('Error updating subscription:', error)
  }
}

// Handle subscription deleted/cancelled
async function handleSubscriptionDeleted(subscription: StripeSubscription) {
  console.log('Subscription deleted:', subscription.id)
  
  try {
    await prisma.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: SubscriptionStatus.CANCELLED,
        canceledAt: new Date(),
        endedAt: subscription.ended_at ? new Date(subscription.ended_at * 1000) : new Date()
      }
    })

    console.log('Subscription cancelled successfully')
  } catch (error) {
    console.error('Error cancelling subscription:', error)
  }
}

// Handle successful invoice payment
async function handleInvoicePaymentSucceeded(invoice: StripeInvoice) {
  console.log('Invoice payment succeeded:', invoice.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: invoice.customer }
    })

    if (!user) {
      console.error('User not found for customer:', invoice.customer)
      return
    }

    // Update or create invoice record
    await prisma.invoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        status: InvoiceStatus.PAID,
        paidAt: new Date(),
        pdfUrl: invoice.invoice_pdf
      },
      create: {
        userId: user.id,
        subscriptionId: invoice.subscription ? (await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: invoice.subscription }
        }))?.id : null,
        stripeInvoiceId: invoice.id,
        number: invoice.number || `INV-${Date.now()}`,
        status: InvoiceStatus.PAID,
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        total: invoice.total,
        currency: invoice.currency,
        description: invoice.description,
        invoiceDate: new Date(invoice.created * 1000),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        paidAt: new Date(),
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata || {}
      }
    })

    console.log('Invoice payment processed successfully')
  } catch (error) {
    console.error('Error processing invoice payment:', error)
  }
}

// Handle failed invoice payment
async function handleInvoicePaymentFailed(invoice: StripeInvoice) {
  console.log('Invoice payment failed:', invoice.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: invoice.customer }
    })

    if (!user) {
      console.error('User not found for customer:', invoice.customer)
      return
    }

    // Update invoice status to unpaid
    await prisma.invoice.upsert({
      where: { stripeInvoiceId: invoice.id },
      update: {
        status: InvoiceStatus.OPEN
      },
      create: {
        userId: user.id,
        subscriptionId: invoice.subscription ? (await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: invoice.subscription }
        }))?.id : null,
        stripeInvoiceId: invoice.id,
        number: invoice.number || `INV-${Date.now()}`,
        status: InvoiceStatus.OPEN,
        subtotal: invoice.subtotal || 0,
        tax: invoice.tax || 0,
        total: invoice.total,
        currency: invoice.currency,
        description: invoice.description,
        invoiceDate: new Date(invoice.created * 1000),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata || {}
      }
    })

    console.log('Invoice payment failure processed')
  } catch (error) {
    console.error('Error processing invoice payment failure:', error)
  }
}

// Handle successful payment intent
async function handlePaymentIntentSucceeded(paymentIntent: StripePaymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: paymentIntent.customer }
    })

    if (!user) {
      console.error('User not found for customer:', paymentIntent.customer)
      return
    }

    // Get receipt URL from latest charge if available
    let receiptUrl = null
    if (paymentIntent.latest_charge) {
      const charge: StripeCharge = await stripe.charges.retrieve(paymentIntent.latest_charge as string)
      receiptUrl = charge.receipt_url
    }

    // Update or create payment record
    const payment = await prisma.payment.upsert({
      where: { stripePaymentIntentId: paymentIntent.id },
      update: {
        status: PaymentStatus.SUCCEEDED,
        receiptUrl
      },
      create: {
        userId: user.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: PaymentStatus.SUCCEEDED,
        type: PaymentType.ONE_TIME,
        description: paymentIntent.description || 'Payment',
        receiptUrl,
        metadata: paymentIntent.metadata || {}
      }
    })

    // Create invoice record for project payments
    const projectId = paymentIntent.metadata?.projectId
    if (projectId && payment.status === PaymentStatus.SUCCEEDED) {
      // Check if invoice already exists for this payment
      const existingInvoice = await prisma.invoice.findFirst({
        where: { 
          AND: [
            { userId: user.id },
            { description: { contains: projectId } },
            { stripeInvoiceId: paymentIntent.id }
          ]
        }
      })

      if (!existingInvoice) {
        // Create invoice record
        await prisma.invoice.create({
          data: {
            userId: user.id,
            stripeInvoiceId: paymentIntent.id,
            number: `PAY-${Date.now()}`,
            status: InvoiceStatus.PAID,
            subtotal: paymentIntent.amount,
            tax: 0,
            total: paymentIntent.amount,
            currency: paymentIntent.currency,
            description: `Project Payment - ${paymentIntent.description || 'Project Payment'}`,
            invoiceDate: new Date(),
            paidAt: new Date(),
            invoiceUrl: receiptUrl,
            pdfUrl: receiptUrl
          }
        })
        console.log(`Invoice created for project payment ${paymentIntent.id}`)
      }
    }

    // Update project paid amount if this payment is for a project
    if (projectId) {
      // Get current project to calculate new paid amount
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          payments: {
            where: { status: PaymentStatus.SUCCEEDED }
          }
        }
      })

      if (project) {
        // Calculate total paid amount from all successful payments
        const totalPaid = project.payments.reduce((sum, p) => sum + p.amount, 0)
        
        // Update project with new paid amount
        await prisma.project.update({
          where: { id: projectId },
          data: { 
            paidAmount: totalPaid,
            // If fully paid, update status to IN_PROGRESS
            ...(totalPaid >= project.totalAmount && project.status === 'QUOTE_APPROVED' && {
              status: 'IN_PROGRESS'
            })
          }
        })

        console.log(`Project ${projectId} paid amount updated to ${totalPaid}`)
      } else {
        console.error('Project not found:', projectId)
      }
    }

    console.log('Payment intent processed successfully')
  } catch (error) {
    console.error('Error processing payment intent:', error)
  }
}

// Handle failed payment intent
async function handlePaymentIntentFailed(paymentIntent: StripePaymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: paymentIntent.customer }
    })

    if (!user) {
      console.error('User not found for customer:', paymentIntent.customer)
      return
    }

    // Update payment record to failed
    await prisma.payment.upsert({
      where: { stripePaymentIntentId: paymentIntent.id },
      update: {
        status: PaymentStatus.FAILED
      },
      create: {
        userId: user.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: PaymentStatus.FAILED,
        type: PaymentType.ONE_TIME,
        description: paymentIntent.description || 'Payment',
        metadata: paymentIntent.metadata || {}
      }
    })

    console.log('Payment intent failure processed')
  } catch (error) {
    console.error('Error processing payment intent failure:', error)
  }
}

// Handle customer created
async function handleCustomerCreated(customer: any) {
  console.log('Customer created:', customer.id)
  
  try {
    // Update user with stripe customer ID if email matches
    if (customer.email) {
      await prisma.user.updateMany({
        where: { email: customer.email },
        data: { stripeCustomerId: customer.id }
      })
    }

    console.log('Customer created successfully')
  } catch (error) {
    console.error('Error processing customer creation:', error)
  }
}

// Handle customer updated
async function handleCustomerUpdated(customer: any) {
  console.log('Customer updated:', customer.id)
  
  try {
    // Update user information if customer exists
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customer.id }
    })

    if (user && customer.email !== user.email) {
      await prisma.user.update({
        where: { id: user.id },
        data: { email: customer.email }
      })
    }

    console.log('Customer updated successfully')
  } catch (error) {
    console.error('Error processing customer update:', error)
  }
}

// Handle invoice created
async function handleInvoiceCreated(invoice: any) {
  console.log('Invoice created:', invoice.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: invoice.customer }
    })

    if (!user) {
      console.error('User not found for customer:', invoice.customer)
      return
    }

    // Create invoice record
    await prisma.invoice.create({
      data: {
        userId: user.id,
        subscriptionId: invoice.subscription ? (await prisma.subscription.findUnique({
          where: { stripeSubscriptionId: invoice.subscription }
        }))?.id : null,
        stripeInvoiceId: invoice.id,
        number: invoice.number,
        status: mapStripeInvoiceStatus(invoice.status),
        subtotal: invoice.subtotal,
        tax: invoice.tax || 0,
        total: invoice.total,
        currency: invoice.currency,
        description: invoice.description,
        invoiceDate: new Date(invoice.created * 1000),
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata || {}
      }
    })

    console.log('Invoice created successfully')
  } catch (error) {
    console.error('Error creating invoice:', error)
  }
}

// Handle invoice updated
async function handleInvoiceUpdated(invoice: any) {
  console.log('Invoice updated:', invoice.id)
  
  try {
    await prisma.invoice.update({
      where: { stripeInvoiceId: invoice.id },
      data: {
        status: mapStripeInvoiceStatus(invoice.status),
        subtotal: invoice.subtotal,
        tax: invoice.tax || 0,
        total: invoice.total,
        description: invoice.description,
        dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : null,
        paidAt: invoice.status === 'paid' ? new Date() : null,
        voidedAt: invoice.status === 'void' ? new Date() : null,
        invoiceUrl: invoice.hosted_invoice_url,
        pdfUrl: invoice.invoice_pdf,
        metadata: invoice.metadata || {}
      }
    })

    console.log('Invoice updated successfully')
  } catch (error) {
    console.error('Error updating invoice:', error)
  }
}

// Handle payment method attached
async function handlePaymentMethodAttached(paymentMethod: any) {
  console.log('Payment method attached:', paymentMethod.id)
  
  try {
    // Find user by stripe customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: paymentMethod.customer }
    })

    if (!user) {
      console.error('User not found for customer:', paymentMethod.customer)
      return
    }

    // You can store payment method details if needed
    console.log('Payment method attached successfully')
  } catch (error) {
    console.error('Error processing payment method attachment:', error)
  }
}

// Helper function to map Stripe subscription status to our enum
function mapStripeSubscriptionStatus(stripeStatus: string): SubscriptionStatus {
  switch (stripeStatus) {
    case 'active':
      return SubscriptionStatus.ACTIVE
    case 'canceled':
      return SubscriptionStatus.CANCELLED
    case 'past_due':
      return SubscriptionStatus.PAST_DUE
    case 'unpaid':
      return SubscriptionStatus.UNPAID
    case 'incomplete':
      return SubscriptionStatus.INCOMPLETE
    case 'trialing':
      return SubscriptionStatus.TRIALING
    case 'paused':
      return SubscriptionStatus.PAUSED
    default:
      return SubscriptionStatus.ACTIVE
  }
}

// Helper function to map Stripe invoice status to our enum
function mapStripeInvoiceStatus(stripeStatus: string): InvoiceStatus {
  switch (stripeStatus) {
    case 'draft':
      return InvoiceStatus.DRAFT
    case 'open':
      return InvoiceStatus.OPEN
    case 'paid':
      return InvoiceStatus.PAID
    case 'uncollectible':
      return InvoiceStatus.UNCOLLECTIBLE
    case 'void':
      return InvoiceStatus.VOID
    default:
      return InvoiceStatus.OPEN
  }
} 