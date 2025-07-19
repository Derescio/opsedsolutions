import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const body = await request.json()
    const { quoteNotes, validUntilDays = 30 } = body

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update project status to QUOTE_SENT
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status: 'QUOTE_SENT',
        quoteValidUntil: new Date(Date.now() + validUntilDays * 24 * 60 * 60 * 1000),
        ...(quoteNotes && { quoteNotes })
      }
    })

    // TODO: Send email notification to client
    // This would integrate with your email service (SendGrid, Resend, etc.)
    const customerInfo = (project.metadata as any)?.customerInfo || {}
    console.log(`Quote sent to ${customerInfo.email} for project: ${project.name}`)

    // TODO: Create activity log entry
    
    return NextResponse.json({ 
      success: true, 
      message: 'Quote sent successfully',
      project: updatedProject
    })
  } catch (error) {
    console.error('Error sending quote:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 