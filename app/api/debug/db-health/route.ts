import { NextResponse } from 'next/server'
import { dbUtils } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection
    const isConnected = await dbUtils.testConnection()
    const healthCheck = await dbUtils.healthCheck()
    
    return NextResponse.json({
      success: true,
      connected: isConnected,
      health: healthCheck,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 