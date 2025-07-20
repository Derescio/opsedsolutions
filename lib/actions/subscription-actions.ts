'use server'

import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'
import { stripe } from '@/lib/stripe'
import { HOSTING_PLANS, type HostingPlan } from '@/lib/constants/hosting-plans'
import { getPaymentSuccessUrl, getPaymentCancelUrl } from '@/lib/url-helper'

const prisma = new PrismaClient()

// Create hosting subscription after project completion
export async function createHostingSubscription(projectId: string, hostingPlanId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get the project to verify it's completed
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    if (project.status !== 'COMPLETED') {
      throw new Error('Project must be completed before starting hosting subscription')
    }

    // Get hosting plan
    const hostingPlan = HOSTING_PLANS.find(plan => plan.id === hostingPlanId)
    if (!hostingPlan) {
      throw new Error('Invalid hosting plan')
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

    // Create Stripe price for hosting plan
    const stripePrice = await stripe.prices.create({
      currency: 'usd',
      unit_amount: hostingPlan.price,
      recurring: {
        interval: hostingPlan.interval
      },
      product_data: {
        name: hostingPlan.name,
        metadata: {
          hostingPlanId: hostingPlan.id
        }
      },
      metadata: {
        hostingPlanId: hostingPlan.id,
        projectId: project.id,
        type: 'hosting_subscription'
      }
    })

    // Create Stripe Checkout Session for subscription
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{
        price: stripePrice.id,
        quantity: 1
      }],
      success_url: getPaymentSuccessUrl({ tab: 'hosting', success: true, subscription: true }),
      cancel_url: getPaymentCancelUrl({ tab: 'hosting', canceled: true, subscription: true }),
      metadata: {
        projectId: project.id,
        hostingPlanId: hostingPlan.id,
        userId: user.id,
        type: 'hosting_subscription'
      },
      subscription_data: {
        metadata: {
          projectId: project.id,
          hostingPlanId: hostingPlan.id,
          userId: user.id,
          type: 'hosting_subscription'
        }
      }
    })

    return {
      success: true,
      url: checkoutSession.url,
      sessionId: checkoutSession.id
    }
  } catch (error) {
    console.error('Error creating hosting subscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create hosting subscription'
    }
  }
}

// Get user's hosting subscriptions
export async function getUserHostingSubscriptions() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const subscriptions = await prisma.subscription.findMany({
      where: { 
        userId: user.id
      },
      orderBy: { createdAt: 'desc' }
    })

    return { success: true, subscriptions }
  } catch (error) {
    console.error('Error fetching hosting subscriptions:', error)
    return { success: false, error: 'Failed to fetch hosting subscriptions' }
  }
}

// Cancel hosting subscription
export async function cancelHostingSubscription(subscriptionId: string, immediate = false) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription || subscription.userId !== user.id) {
      throw new Error('Subscription not found or unauthorized')
    }

    // Cancel in Stripe
    if (immediate) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId)
    } else {
      await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
        cancel_at_period_end: true
      })
    }

    // Update in database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        cancelAtPeriodEnd: !immediate,
        ...(immediate && {
          status: 'CANCELLED',
          canceledAt: new Date()
        })
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error canceling hosting subscription:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    }
  }
}

// Update hosting plan (upgrade/downgrade)
export async function updateHostingPlan(subscriptionId: string, newHostingPlanId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get subscription from database
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId }
    })

    if (!subscription || subscription.userId !== user.id) {
      throw new Error('Subscription not found or unauthorized')
    }

    // Get new hosting plan
    const newHostingPlan = HOSTING_PLANS.find(plan => plan.id === newHostingPlanId)
    if (!newHostingPlan) {
      throw new Error('Invalid hosting plan')
    }

    // Create or get new Stripe price
    const stripePrice = await stripe.prices.create({
      currency: 'usd',
      unit_amount: newHostingPlan.price,
      recurring: {
        interval: newHostingPlan.interval
      },
      product_data: {
        name: newHostingPlan.name,
        metadata: {
          hostingPlanId: newHostingPlan.id
        }
      }
    })

    // Update Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripeSubscriptionId)
    await stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      items: [{
        id: stripeSubscription.items.data[0].id,
        price: stripePrice.id
      }],
      proration_behavior: 'create_prorations'
    })

    // Update database
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        stripePriceId: stripePrice.id
      }
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating hosting plan:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update hosting plan'
    }
  }
}

// Get all projects eligible for hosting subscriptions
export async function getEligibleProjectsForHosting() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get all completed projects for the user that don't already have hosting
    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
        status: 'COMPLETED'
      },
      select: {
        id: true,
        name: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    })

    // Filter out projects that already have active hosting subscriptions
    const eligibleProjects = []
    
    for (const project of projects) {
      const existingSubscription = await prisma.projectSubscription.findFirst({
        where: {
          projectId: project.id,
          status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] }
        }
      })

      if (!existingSubscription) {
        eligibleProjects.push({
          id: project.id,
          name: project.name,
          totalAmount: project.totalAmount,
          status: project.status,
          createdAt: project.createdAt
        })
      }
    }

    return { success: true, projects: eligibleProjects }
  } catch (error) {
    console.error('Error fetching eligible projects:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Failed to fetch projects' }
  }
}

// Check if project is eligible for hosting subscription
export async function checkProjectHostingEligibility(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project || project.userId !== user.id) {
      return { eligible: false, reason: 'Project not found or unauthorized' }
    }

    if (project.status !== 'COMPLETED') {
      return { eligible: false, reason: 'Project must be completed first' }
    }

    // Check if already has hosting subscription
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: { in: ['ACTIVE', 'TRIALING', 'PAST_DUE'] }
      }
    })

    if (existingSubscription) {
      return { eligible: false, reason: 'Already has active hosting subscription' }
    }

    return {
      eligible: true,
      recommendedPlan: 'basic-hosting',
      project: {
        id: project.id,
        name: project.name,
        totalAmount: project.totalAmount
      }
    }
  } catch (error) {
    console.error('Error checking hosting eligibility:', error)
    return { eligible: false, reason: 'Failed to check eligibility' }
  }
} 