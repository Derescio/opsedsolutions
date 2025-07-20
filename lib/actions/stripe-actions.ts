'use server'

import { stripe, STRIPE_CONFIG } from '@/lib/stripe'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getBaseUrl } from '@/lib/url-helper'

// Create checkout session for subscription
export async function createCheckoutSession(priceId: string) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Create or retrieve Stripe customer
    const customer = await findOrCreateStripeCustomer(user.id, user.emailAddresses[0]?.emailAddress, {
      firstName: user.firstName,
      lastName: user.lastName,
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      success_url: STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      metadata: {
        userId: user.id,
        priceId: priceId,
      },
    })

    redirect(session.url!)
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

// Create checkout session for one-time payment
export async function createOneTimePaymentSession(amount: number, description: string) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Create or retrieve Stripe customer
    const customer = await findOrCreateStripeCustomer(user.id, user.emailAddresses[0]?.emailAddress, {
      firstName: user.firstName,
      lastName: user.lastName,
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: STRIPE_CONFIG.currency,
            product_data: {
              name: description,
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      success_url: STRIPE_CONFIG.success_url,
      cancel_url: STRIPE_CONFIG.cancel_url,
      metadata: {
        userId: user.id,
        type: 'one-time',
        description: description,
      },
    })

    redirect(session.url!)
  } catch (error) {
    console.error('Error creating one-time payment session:', error)
    throw new Error('Failed to create payment session')
  }
}

// Get or create Stripe customer
async function findOrCreateStripeCustomer(userId: string, email: string, name: { firstName: string | null, lastName: string | null }) {
  // First, try to find existing customer
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email: email,
    name: `${name.firstName || ''} ${name.lastName || ''}`.trim(),
    metadata: {
      userId: userId,
    },
  })

  return customer
}

// Get customer portal session
export async function createCustomerPortalSession() {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    // Find Stripe customer
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    })

    if (customers.data.length === 0) {
      throw new Error('No Stripe customer found')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${getBaseUrl()}/dashboard`,
    })

    redirect(session.url)
  } catch (error) {
    console.error('Error creating customer portal session:', error)
    throw new Error('Failed to create customer portal session')
  }
}

// Get subscription status
export async function getSubscriptionStatus(userId: string) {
  try {
    const user = await currentUser()
    
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized')
    }

    // Find customer
    const customers = await stripe.customers.list({
      email: user.emailAddresses[0]?.emailAddress,
      limit: 1,
    })

    if (customers.data.length === 0) {
      return { hasSubscription: false, subscription: null }
    }

    // Get active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return { hasSubscription: false, subscription: null }
    }

    const subscription = subscriptions.data[0]
    const firstItem = subscription.items.data[0]
    
    return {
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: firstItem ? new Date(firstItem.current_period_start * 1000) : null,
        currentPeriodEnd: firstItem ? new Date(firstItem.current_period_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        priceId: subscription.items.data[0]?.price.id,
      }
    }
  } catch (error) {
    console.error('Error getting subscription status:', error)
    return { hasSubscription: false, subscription: null }
  }
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })

    const firstItem = subscription.items.data[0]

    return {
      success: true,
      subscription: {
        id: subscription.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: firstItem ? new Date(firstItem.current_period_end * 1000) : null,
      }
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return { success: false, error: 'Failed to cancel subscription' }
  }
}

// Resume subscription
export async function resumeSubscription(subscriptionId: string) {
  const user = await currentUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    const firstItem = subscription.items.data[0]

    return {
      success: true,
      subscription: {
        id: subscription.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: firstItem ? new Date(firstItem.current_period_end * 1000) : null,
      }
    }
  } catch (error) {
    console.error('Error resuming subscription:', error)
    return { success: false, error: 'Failed to resume subscription' }
  }
} 