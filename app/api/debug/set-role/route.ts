import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { userHelpers } from '@/lib/db'

export async function POST(request: Request) {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({
        success: false,
        error: 'No authenticated user found'
      }, { status: 401 })
    }

    // Get role from request body
    const { role } = await request.json()
    
    if (!role || !['ADMIN', 'CLIENT', 'SUPPORT', 'MODERATOR'].includes(role)) {
      return NextResponse.json({
        success: false,
        error: 'Invalid role. Must be one of: ADMIN, CLIENT, SUPPORT, MODERATOR'
      }, { status: 400 })
    }

    console.log('Setting user role:', {
      clerkId: clerkUser.id,
      role
    })

    // Update user role in database
    const dbUser = await userHelpers.updateUserRole(clerkUser.id, role)

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
    console.error('Error setting user role:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 