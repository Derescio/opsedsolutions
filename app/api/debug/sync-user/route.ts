import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { userHelpers } from '@/lib/db'

export async function POST() {
  try {
    // Get current user from Clerk
    const clerkUser = await currentUser()
    
    if (!clerkUser) {
      return NextResponse.json({
        success: false,
        error: 'No authenticated user found'
      }, { status: 401 })
    }

    // Prepare user data
    const userData = {
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName ?? undefined,
      lastName: clerkUser.lastName ?? undefined,
      imageUrl: clerkUser.imageUrl,
      phone: clerkUser.phoneNumbers[0]?.phoneNumber
    }

    console.log('Syncing user to database:', {
      clerkId: clerkUser.id,
      userData
    })

    // Create or update user in database
    const dbUser = await userHelpers.upsertUser(clerkUser.id, userData)

    console.log('User synced successfully:', dbUser)

    return NextResponse.json({
      success: true,
      message: 'User synced successfully',
      user: {
        id: dbUser.id,
        clerkId: dbUser.clerkId,
        email: dbUser.email,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        role: dbUser.role,
        createdAt: dbUser.createdAt
      }
    })
  } catch (error) {
    console.error('Error syncing user:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 