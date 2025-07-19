import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('Fetching services from database...')
    
    // Test database connection first
    await db.$connect()
    console.log('Database connected successfully')
    
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
        addOns: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            priceType: true,
            price: true,
            percentage: true,
            billingInterval: true,
            features: true
          }
        }
      }
    })

    console.log(`Found ${services.length} services`)
    return NextResponse.json(services)
  } catch (error: any) {
    console.error('Detailed error fetching services:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack
    })
    
    return NextResponse.json({ 
      error: 'Failed to fetch services',
      details: error.message 
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
} 