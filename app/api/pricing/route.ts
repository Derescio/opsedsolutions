import { NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Get all pricing plans from database
    const pricingPlans = await prisma.pricingPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' }
    })

    // Transform the data to match frontend expectations
    const transformedPlans = pricingPlans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price / 100, // Convert from cents to dollars for display
      priceId: plan.stripePriceId,
      subscriptionPriceId: plan.stripeSubscriptionPriceId,
      features: plan.features,
      isPopular: plan.isPopular,
      isActive: plan.isActive
    }))

    return NextResponse.json({ success: true, plans: transformedPlans })
  } catch (error) {
    console.error('Error fetching pricing plans:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pricing plans' },
      { status: 500 }
    )
  }
} 