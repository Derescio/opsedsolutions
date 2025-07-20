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
    return NextResponse.json({
      success: true,
      services: services,
      addOns: services.flatMap(service => service.addOns || [])
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : 'No stack trace'
    console.error('Detailed error fetching services:', {
      message: errorMessage,
      stack: errorStack
    })
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to fetch services',
      details: errorStack 
    }, { status: 500 })
  } finally {
    await db.$disconnect()
  }
} 