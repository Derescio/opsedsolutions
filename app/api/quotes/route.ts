import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'
import { createProject } from '@/lib/actions/project-actions'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      name,
      description,
      services,
      customerInfo,
      requirements
    } = body

    // Create project using the existing project action
    const result = await createProject({
      name,
      description,
      services,
      customerInfo,
      requirements
    })

    if (result.success) {
      // TODO: Send email notification to admin
      // TODO: Send confirmation email to client
      
      return NextResponse.json({ 
        success: true, 
        project: result.project,
        message: 'Quote request submitted successfully'
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Error creating quote:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user's projects/quotes
    const projects = await prisma.project.findMany({
      where: { userId: user.id },
      include: {
        services: {
          include: {
            service: {
              include: {
                category: true
              }
            }
          }
        },
        addOns: {
          include: {
            addOn: true
          }
        },
        payments: true,
        subscriptions: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ success: true, projects })
  } catch (error) {
    console.error('Error fetching quotes:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 