import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

interface CustomerInfo {
  name?: string
  email?: string
  phone?: string
  company?: string
}

interface ProjectMetadata {
  contactInfo?: CustomerInfo
  customerInfo?: CustomerInfo  // Legacy support
  quoteNotes?: string
  validUntil?: string
  requirements?: string
  quoteBreakdown?: unknown
  submissionDate?: string
  [key: string]: unknown
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params

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
        },
        payments: true,
        subscriptions: true
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const formattedProject = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      totalAmount: project.totalAmount,
      paidAmount: project.paidAmount,
      customerInfo: (project.metadata as ProjectMetadata)?.contactInfo || (project.metadata as ProjectMetadata)?.customerInfo || {},
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      quoteValidUntil: project.quoteValidUntil?.toISOString(),
      contractSigned: project.contractSigned,
      contractDate: project.contractDate?.toISOString(),
      services: project.services,
      addOns: project.addOns,
      payments: project.payments,
      subscriptions: project.subscriptions
    }

    return NextResponse.json({ 
      success: true, 
      project: formattedProject 
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
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
    const { name, description, totalAmount, customerInfo, status } = body

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      )
    }

    // Get the current project to merge metadata
    const currentProject = await prisma.project.findUnique({
      where: { id: projectId }
    })

    if (!currentProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const currentMetadata = currentProject.metadata as ProjectMetadata || {}
    
    // Update project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
        ...(totalAmount && { totalAmount }),
        ...(status && { status }),
        metadata: {
          ...currentMetadata,
          contactInfo: customerInfo || currentMetadata.contactInfo || currentMetadata.customerInfo
        }
      },
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
      }
    })

    const formattedProject = {
      id: updatedProject.id,
      name: updatedProject.name,
      description: updatedProject.description,
      status: updatedProject.status,
      totalAmount: updatedProject.totalAmount,
      paidAmount: updatedProject.paidAmount,
      customerInfo: (updatedProject.metadata as ProjectMetadata)?.contactInfo || (updatedProject.metadata as ProjectMetadata)?.customerInfo || {},
      createdAt: updatedProject.createdAt.toISOString(),
      updatedAt: updatedProject.updatedAt.toISOString(),
      quoteValidUntil: updatedProject.quoteValidUntil?.toISOString(),
      contractSigned: updatedProject.contractSigned,
      contractDate: updatedProject.contractDate?.toISOString(),
      services: updatedProject.services,
      addOns: updatedProject.addOns,
      payments: updatedProject.payments,
      subscriptions: updatedProject.subscriptions
    }

    return NextResponse.json({ 
      success: true, 
      project: formattedProject,
      message: 'Project updated successfully'
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 