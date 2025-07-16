import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { userHelpers } from '@/lib/db'

export async function POST(request: Request) {
  try {
    // Verify admin access
    await requireAdmin()
    
    const { clerkId, role } = await request.json()
    
    // Validate inputs
    if (!clerkId || !role) {
      return NextResponse.json({
        success: false,
        error: 'Missing clerkId or role'
      }, { status: 400 })
    }
    
    if (!['ADMIN', 'CLIENT', 'SUPPORT', 'MODERATOR'].includes(role)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid role. Must be one of: ADMIN, CLIENT, SUPPORT, MODERATOR'
      }, { status: 400 })
    }

    console.log('Admin updating user role:', {
      clerkId,
      role
    })

    // Update user role in database
    const dbUser = await userHelpers.updateUserRole(clerkId, role)

    console.log('User role updated successfully:', dbUser)

    return NextResponse.json({
      success: true,
      message: 'User role updated successfully',
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        updatedAt: dbUser.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    
    // Check if it's an authorization error
    if (error instanceof Error && error.message.includes('unauthorized')) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized. Admin access required.'
      }, { status: 403 })
    }
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 