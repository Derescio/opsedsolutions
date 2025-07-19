export interface HostingPlan {
  id: string
  name: string
  price: number // in cents
  interval: 'month' | 'year'
  features: string[]
  stripePriceId?: string
}

// Pre-defined hosting plans matching your pricing tiers
export const HOSTING_PLANS: HostingPlan[] = [
  {
    id: 'basic-hosting',
    name: 'Basic Hosting',
    price: 2000, // $20/month
    interval: 'month',
    features: [
      'Up to 5GB storage',
      'Basic SSL certificate',
      'Email support',
      'Monthly backups'
    ]
  },
  {
    id: 'professional-hosting',
    name: 'Professional Hosting',
    price: 4500, // $45/month
    interval: 'month',
    features: [
      'Up to 25GB storage',
      'Advanced SSL certificate',
      'Priority email support',
      'Weekly backups',
      'CDN included',
      'Performance monitoring'
    ]
  },
  {
    id: 'enterprise-hosting',
    name: 'Enterprise Hosting',
    price: 15000, // $150/month
    interval: 'month',
    features: [
      'Unlimited storage',
      'Premium SSL certificate',
      '24/7 phone & email support',
      'Daily backups',
      'Advanced CDN',
      'Performance monitoring',
      'Custom server configuration',
      'Dedicated support manager'
    ]
  }
] 