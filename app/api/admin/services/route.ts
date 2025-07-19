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

    const services = await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { addOns: true }
        }
      }
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error('Error fetching services:', error)
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
      categoryId, 
      name, 
      description, 
      basePrice, 
      priceType, 
      billingInterval, 
      features, 
      isActive, 
      sortOrder 
    } = body

    const service = await prisma.service.create({
      data: {
        categoryId,
        name,
        description,
        basePrice,
        priceType,
        billingInterval,
        features,
        isActive,
        sortOrder
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        _count: {
          select: { addOns: true }
        }
      }
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 