import Stripe from 'stripe'
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js'

// Initialize Stripe with secret key for server-side
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
})

// Initialize Stripe Promise for client-side
let stripePromise: Promise<StripeJS | null>

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// Stripe configuration constants
export const STRIPE_CONFIG = {
  currency: 'usd',
  taxRate: 0.13, // 13% tax rate
  success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
}

// Product and pricing tiers
export const PRICING_TIERS = [
  {
    name: 'Basic',
    description: 'Perfect for small projects',
    price: 99, // $99 USD
    priceId: process.env.STRIPE_BASIC_PLAN_ID!,
    features: [
      'Basic website development',
      'Email support',
      'Up to 3 revisions',
      'Basic analytics setup'
    ],
    popular: false
  },
  {
    name: 'Premium',
    description: 'Best for growing businesses',
    price: 299, // $299 USD
    priceId: process.env.STRIPE_PREMIUM_PLAN_ID!,
    features: [
      'Advanced website development',
      'Priority support',
      'Unlimited revisions',
      'Advanced analytics',
      'SEO optimization',
      'Mobile optimization'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    description: 'For large scale projects',
    price: 599, // $599 USD
    priceId: process.env.STRIPE_ENTERPRISE_PLAN_ID!,
    features: [
      'Custom development',
      '24/7 dedicated support',
      'Unlimited revisions',
      'Advanced analytics',
      'Full SEO package',
      'Performance optimization',
      'Custom integrations',
      'Ongoing maintenance'
    ],
    popular: false
  }
]

// Helper function to format price for display
export const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Helper function to calculate tax
export const calculateTax = (amount: number) => {
  return Math.round(amount * STRIPE_CONFIG.taxRate)
}

// Helper function to calculate total with tax
export const calculateTotal = (amount: number) => {
  return amount + calculateTax(amount)
} 