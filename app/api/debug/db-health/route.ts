import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await db.$connect()
    console.log('✅ Database connection successful')
    
    // Test if we can access services table
    const serviceCount = await db.service.count()
    console.log(`✅ Found ${serviceCount} total services in database`)
    
    // Test if we can access service_categories table
    const categoryCount = await db.serviceCategory.count()
    console.log(`✅ Found ${categoryCount} service categories`)
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      services: serviceCount,
      categories: categoryCount,
      timestamp: new Date().toISOString()
    })
    
  } catch (error: any) {
    console.error('❌ Database health check failed:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
  } finally {
    await db.$disconnect()
  }
} 