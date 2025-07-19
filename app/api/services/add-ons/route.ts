import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceIds = searchParams.get('serviceIds')?.split(',') || []

    if (serviceIds.length === 0) {
      return NextResponse.json({ error: 'Service IDs are required' }, { status: 400 })
    }

    // Fetch all add-ons that are compatible with the provided services
    const addOns = await db.serviceAddOn.findMany({
      where: {
        serviceId: {
          in: serviceIds
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceType: true,
        price: true,
        percentage: true
      }
    })

    return NextResponse.json({
      success: true,
      addOns
    })
  } catch (error) {
    console.error('Error fetching service add-ons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch service add-ons' },
      { status: 500 }
    )
  }
} 