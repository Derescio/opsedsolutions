import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

// TypeScript interfaces for project data
interface CustomerInfo {
  name?: string
  email?: string
  phone?: string
  company?: string
}

interface ProjectMetadata {
  customerInfo?: CustomerInfo
  quoteNotes?: string
  validUntil?: string
  requirements?: string
  [key: string]: unknown
}

interface ServiceInput {
  serviceId: string
  customPrice?: number
  notes?: string
}

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const projects = await prisma.project.findMany({
      include: {
        services: {
          include: {
            service: true
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
      orderBy: { updatedAt: 'desc' }
    })

    const formattedProjects = projects.map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      totalAmount: project.totalAmount,
      paidAmount: project.paidAmount,
      customerInfo: (project.metadata as ProjectMetadata)?.customerInfo || {},
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      quoteValidUntil: project.quoteValidUntil?.toISOString(),
      contractSigned: project.contractSigned,
      contractDate: project.contractDate?.toISOString(),
      services: project.services,
      addOns: project.addOns,
      payments: project.payments,
      subscriptions: project.subscriptions
    }))

    return NextResponse.json({ 
      success: true, 
      projects: formattedProjects 
    })
  } catch (error) {
    console.error('Error fetching admin projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, description, status, totalAmount, customerInfo, services } = await request.json()

    // Validate required fields
    if (!name || !description || !customerInfo?.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        totalAmount,
        paidAmount: 0,
        userId: user.id,
        contractSigned: false,
        quoteValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        metadata: {
          customerInfo,
          requirements: ''
        },
        services: {
          create: services.map((service: ServiceInput) => ({
            serviceId: service.serviceId,
            customPrice: service.customPrice || 0,
            notes: service.notes
          }))
        }
      },
      include: {
        services: {
          include: {
            service: true
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

    return NextResponse.json({ 
      success: true, 
      project 
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 