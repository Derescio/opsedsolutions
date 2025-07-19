import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: projectId } = await params
    const body = await request.json()
    const { addOnId } = body

    if (!addOnId) {
      return NextResponse.json({ error: 'Add-on ID is required' }, { status: 400 })
    }

    // Verify project belongs to user (unless admin)
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    if (project.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check if add-on is already in project
    const existingAddOn = await db.projectAddOn.findFirst({
      where: {
        projectId,
        addOnId
      }
    })

    if (existingAddOn) {
      return NextResponse.json({ error: 'Add-on already exists in project' }, { status: 409 })
    }

    // Fetch the add-on details
    const addOn = await db.serviceAddOn.findUnique({
      where: { id: addOnId },
      include: {
        service: true
      }
    })

    if (!addOn) {
      return NextResponse.json({ error: 'Add-on not found' }, { status: 404 })
    }

    // Check if add-on is compatible with project services
    const projectServiceIds = project.services.map(s => s.service.id)
    if (!projectServiceIds.includes(addOn.serviceId)) {
      return NextResponse.json(
        { error: 'Add-on not compatible with project services' },
        { status: 400 }
      )
    }

    // Calculate add-on price
    let addOnPrice = 0
    
    if (addOn.priceType === 'FIXED') {
      addOnPrice = addOn.price || 0
    } else if (addOn.priceType === 'PERCENTAGE') {
      // Calculate based on the related service price
      const relatedService = project.services.find(s => s.service.id === addOn.serviceId)
      if (relatedService && relatedService.customPrice && addOn.percentage) {
        addOnPrice = Math.round((relatedService.customPrice * addOn.percentage) / 100)
      }
    }

    // Add the add-on to the project
    const projectAddOn = await db.projectAddOn.create({
      data: {
        projectId,
        addOnId,
        customPrice: addOnPrice
      }
    })

    // Update project total amount
    const updatedProject = await db.project.update({
      where: { id: projectId },
      data: {
        totalAmount: project.totalAmount + addOnPrice
      }
    })

    return NextResponse.json({
      success: true,
      projectAddOn,
      newTotal: updatedProject.totalAmount,
      addOnPrice,
      addOnName: addOn.name,
      message: 'Add-on added successfully'
    })

  } catch (error) {
    console.error('Error adding add-on to project:', error)
    return NextResponse.json(
      { error: 'Failed to add add-on to project' },
      { status: 500 }
    )
  }
} 