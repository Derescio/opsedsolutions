import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function PATCH(
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
    const { status } = body

    // Validate status
    const validStatuses = ['QUOTE_REQUESTED', 'QUOTE_SENT', 'QUOTE_APPROVED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Get the project
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Update project status
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        status,
        // Set contract date when project is approved
        ...(status === 'QUOTE_APPROVED' && { contractDate: new Date() }),
        // Mark contract as signed when approved
        ...(status === 'QUOTE_APPROVED' && { contractSigned: true })
      }
    })

    // TODO: Send email notification to client about status change
    const customerInfo = (project.metadata as any)?.customerInfo || {}
    console.log(`Project status updated to ${status} for ${customerInfo.email}`)

    // TODO: Create activity log entry
    
    return NextResponse.json({ 
      success: true, 
      message: 'Project status updated successfully',
      project: updatedProject
    })
  } catch (error) {
    console.error('Error updating project status:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
} 