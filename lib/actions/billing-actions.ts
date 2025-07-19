'use server'

import { getCurrentUser, requireAuth } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { stripe } from '@/lib/stripe'
// import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const prisma = new PrismaClient()

// Client Actions

export async function getUserSubscription() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const subscription = await prisma.subscription.findFirst({
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

    const payments = await prisma.payment.findMany({
      where: { userId: user.id },
      include: {
        subscription: true,
        invoice: true
      },
      orderBy: { createdAt: 'desc' }
    })

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

    const invoices = await prisma.invoice.findMany({
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
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

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
    const subscription = await prisma.subscription.findFirst({
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
    await prisma.subscription.update({
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
    
    const subscriptions = await prisma.subscription.findMany({
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
    
    const payments = await prisma.payment.findMany({
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
    const subscriptionStats = await prisma.subscription.groupBy({
      by: ['status'],
      _count: { id: true }
    })

    // Get payment stats
    const paymentStats = await prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { amount: true }
    })

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await prisma.payment.findMany({
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

    // Group by month
    const revenueByMonth = monthlyRevenue.reduce((acc, payment) => {
      const month = payment.createdAt.toISOString().slice(0, 7) // YYYY-MM format
      if (!acc[month]) {
        acc[month] = 0
      }
      acc[month] += payment.amount
      return acc
    }, {} as Record<string, number>)

    // Get total revenue
    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'SUCCEEDED' },
      _sum: { amount: true }
    })

    return {
      success: true,
      analytics: {
        subscriptionStats,
        paymentStats,
        revenueByMonth,
        totalRevenue: totalRevenue._sum.amount || 0
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
    
    // Get recent payments
    const recentPayments = await prisma.payment.findMany({
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

    // Get recent subscriptions
    const recentSubscriptions = await prisma.subscription.findMany({
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
        payments: recentPayments,
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
    
    const subscription = await prisma.subscription.findUnique({
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