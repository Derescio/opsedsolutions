'use server'

import { getCurrentUser, requireAuth } from '@/lib/auth'
import { db } from '@/lib/db'
import { stripe } from '@/lib/stripe'
import { getBaseUrl } from '@/lib/url-helper'
// import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// Client Actions

export async function getUserSubscription() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const subscription = await db.subscription.findFirst({
      where: { 
        userId: user.id,
        status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, subscription }
  } catch (error) {
    console.error('Error fetching user subscription:', error)
    return { success: false, error: 'Failed to fetch subscription' }
  }
}

export async function getUserPaymentHistory() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get project payments (project-related payments)
    const projectPayments = await db.projectPayment.findMany({
      where: {
        project: {
          userId: user.id
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get general payments (non-project payments like one-time subscriptions)
    const generalPayments = await db.payment.findMany({
      where: { userId: user.id },
      include: {
        subscription: true,
        invoice: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get paid invoices (subscription payments are tracked via invoices)
    const paidInvoices = await db.invoice.findMany({
      where: {
        userId: user.id,
        status: 'PAID',
        paidAt: { not: null }
      },
      include: {
        subscription: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { paidAt: 'desc' }
    })

    // Combine and format payments for display
    const payments = [
      ...projectPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        type: 'PROJECT' as const,
        description: p.description || `Payment for ${p.project.name}`,
        receiptUrl: p.receiptUrl,
        createdAt: p.createdAt
      })),
      ...generalPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        type: p.type,
        description: p.description,
        receiptUrl: p.receiptUrl,
        createdAt: p.createdAt
      })),
      // Include paid invoices as payment history (for subscription payments)
      ...paidInvoices.map(inv => ({
        id: inv.id,
        amount: inv.total,
        currency: inv.currency,
        status: 'SUCCEEDED',
        type: inv.subscriptionId ? 'SUBSCRIPTION' as const : 'INVOICE' as const,
        description: inv.description || `Invoice ${inv.number}`,
        receiptUrl: inv.pdfUrl || inv.invoiceUrl,
        createdAt: inv.paidAt || inv.invoiceDate
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return { success: false, error: 'Failed to fetch payment history' }
  }
}

export async function getUserInvoices() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const invoices = await db.invoice.findMany({
      where: { userId: user.id },
      include: {
        subscription: true,
        payments: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, invoices }
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return { success: false, error: 'Failed to fetch invoices' }
  }
}

export async function createCheckoutSession(priceId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
          clerkId: user.clerkId
        }
      })
      
      customerId = customer.id
      
      // Update user with customer ID
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Get the base URL for redirects with Vercel support
    const baseUrl = getBaseUrl()

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard?tab=billing&success=true`,
      cancel_url: `${baseUrl}/dashboard?tab=billing&canceled=true`,
      metadata: {
        userId: user.id,
        priceId: priceId
      }
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { success: false, error: 'Failed to create checkout session' }
  }
}

export async function createBillingPortalSession() {
  try {
    const user = await getCurrentUser()
    if (!user || !user.stripeCustomerId) {
      throw new Error('No customer found')
    }

    // Get the base URL for redirects with Vercel support
    const baseUrl = getBaseUrl()

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/dashboard?tab=billing`,
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    return { success: false, error: 'Failed to create billing portal session' }
  }
}

export async function cancelSubscription(subscriptionId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Verify user owns this subscription
    const subscription = await db.subscription.findFirst({
      where: {
        id: subscriptionId,
        userId: user.id
      }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    // Cancel at period end in Stripe
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    })

    // Update database
    await db.subscription.update({
      where: { id: subscriptionId },
      data: { cancelAtPeriodEnd: true }
    })

    revalidatePath('/dashboard')
    return { success: true, message: 'Subscription will be canceled at the end of the current period' }
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}

// Admin Actions

export async function getAllSubscriptions() {
  try {
    await requireAuth()
    
    const subscriptions = await db.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, subscriptions }
  } catch (error) {
    console.error('Error fetching all subscriptions:', error)
    return { success: false, error: 'Failed to fetch subscriptions' }
  }
}

export async function getAllPayments() {
  try {
    await requireAuth()
    
    // Get project payments with user info
    const projectPayments = await db.projectPayment.findMany({
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Get general payments
    const generalPayments = await db.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        },
        subscription: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Combine and format payments
    const payments = [
      ...projectPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        type: 'PROJECT' as const,
        description: p.description || `Payment for ${p.project.name}`,
        receiptUrl: p.receiptUrl,
        createdAt: p.createdAt,
        user: p.project.user
      })),
      ...generalPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        type: p.type,
        description: p.description,
        receiptUrl: p.receiptUrl,
        createdAt: p.createdAt,
        user: p.user
      }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { success: true, payments }
  } catch (error) {
    console.error('Error fetching all payments:', error)
    return { success: false, error: 'Failed to fetch payments' }
  }
}

export async function getBillingAnalytics() {
  try {
    await requireAuth()
    
    // Get subscription stats
    const subscriptionStats = await db.subscription.groupBy({
      by: ['status'],
      _count: { id: true }
    })

    // Get payment stats from project payments
    const projectPaymentStats = await db.projectPayment.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true }
    })

    // Get payment stats from general payments
    const generalPaymentStats = await db.payment.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true }
    })

    // Combine payment stats
    const paymentStats = [...projectPaymentStats, ...generalPaymentStats].reduce((acc, stat) => {
      const existing = acc.find(s => s.status === stat.status)
      if (existing) {
        existing._count.id += stat._count.id
        existing._sum.amount = (existing._sum.amount || 0) + (stat._sum.amount || 0)
      } else {
        acc.push(stat)
      }
      return acc
    }, [] as typeof projectPaymentStats)

    // Get monthly revenue from project payments (last 12 months)
    const projectMonthlyRevenue = await db.projectPayment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      select: {
        amount: true,
        createdAt: true
      }
    })

    // Get monthly revenue from general payments (last 12 months)
    const generalMonthlyRevenue = await db.payment.findMany({
      where: {
        status: 'SUCCEEDED',
        createdAt: {
          gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        }
      },
      select: {
        amount: true,
        createdAt: true
      }
    })

    // Combine and group by month
    const allMonthlyRevenue = [...projectMonthlyRevenue, ...generalMonthlyRevenue]
    const revenueByMonth = allMonthlyRevenue.reduce((acc, payment) => {
      const month = payment.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += payment.amount
      return acc
    }, {} as Record<string, number>)

    // Get total revenue from both sources
    const projectTotalRevenue = await db.projectPayment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amount: true }
    })

    const generalTotalRevenue = await db.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amount: true }
    })

    const totalRevenue = (projectTotalRevenue._sum.amount || 0) + (generalTotalRevenue._sum.amount || 0)

    return {
      success: true,
      analytics: {
        subscriptionStats,
        paymentStats,
        revenueByMonth,
        totalRevenue
      }
    }
  } catch (error) {
    console.error('Error fetching billing analytics:', error)
    return { success: false, error: 'Failed to fetch billing analytics' }
  }
}

export async function getRecentActivity() {
  try {
    await requireAuth()
    
    // Get recent project payments
    const recentProjectPayments = await db.projectPayment.findMany({
      include: {
        project: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Get recent general payments
    const recentGeneralPayments = await db.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    // Combine and format payments
    const allPayments = [
      ...recentProjectPayments.map(p => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        createdAt: p.createdAt,
        user: p.project.user
      })),
      ...recentGeneralPayments
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10)

    // Get recent subscriptions
    const recentSubscriptions = await db.subscription.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    return {
      success: true,
      activity: {
        payments: allPayments,
        subscriptions: recentSubscriptions
      }
    }
  } catch (error) {
    console.error('Error fetching recent activity:', error)
    return { success: false, error: 'Failed to fetch recent activity' }
  }
}

export async function updateSubscriptionStatus(subscriptionId: string, action: 'cancel' | 'reactivate') {
  try {
    await requireAuth()
    
    const subscription = await db.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    if (action === 'cancel') {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    } else {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: false
      })
    }

    revalidatePath('/dashboard')
    return { success: true, message: `Subscription ${action === 'cancel' ? 'canceled' : 'reactivated'} successfully` }
  } catch (error) {
    console.error('Error updating subscription:', error)
    return { success: false, error: 'Failed to update subscription' }
  }
} 