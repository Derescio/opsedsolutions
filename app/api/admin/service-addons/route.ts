import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const addOns = await prisma.serviceAddOn.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(addOns)
  } catch (error) {
    console.error('Error fetching service add-ons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      serviceId, 
      name, 
      description, 
      priceType, 
      price, 
      percentage, 
      billingInterval, 
      features, 
      isActive, 
      sortOrder 
    } = body

    const addOn = await prisma.serviceAddOn.create({
      data: {
        serviceId,
        name,
        description,
        priceType,
        price,
        percentage,
        billingInterval,
        features,
        isActive,
        sortOrder
      },
      include: {
        service: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(addOn)
  } catch (error) {
    console.error('Error creating service add-on:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 