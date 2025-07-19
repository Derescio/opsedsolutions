import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Authentication required' 
      }, { status: 401 })
    }

    const body = await request.json()
    const { quote, contactInfo, selectedServices } = body

    console.log('Creating project with quote:', {
      userId,
      contactInfo,
      quote,
      selectedServices
    })

    // Create the project
    const project = await db.project.create({
      data: {
        userId,
        name: `${contactInfo.company || contactInfo.name}'s Project`,
        description: contactInfo.requirements || 'Quote request from pricing page',
        status: 'QUOTE_REQUESTED',
        totalAmount: quote.oneTimeTotal,
        paidAmount: 0,
        quoteNotes: `Contact: ${contactInfo.name} (${contactInfo.email})${contactInfo.phone ? `, Phone: ${contactInfo.phone}` : ''}`,
        metadata: {
          contactInfo,
          quoteBreakdown: quote.breakdown,
          submissionDate: new Date().toISOString()
        }
      }
    })

    // Create project services
    for (const selectedService of selectedServices) {
      await db.projectService.create({
        data: {
          projectId: project.id,
          serviceId: selectedService.service.id,
          customName: selectedService.service.name,
          notes: `Selected from pricing page - ${selectedService.service.description}`
        }
      })

      // Create project add-ons if any
      for (const addOn of selectedService.addOns || []) {
        await db.projectAddOn.create({
          data: {
            projectId: project.id,
            addOnId: addOn.id,
            customName: addOn.name,
            notes: `Selected from pricing page`
          }
        })
      }
    }

    console.log('Project created successfully:', project.id)

    return NextResponse.json({
      success: true,
      projectId: project.id,
      message: 'Quote request submitted successfully!'
    })

  } catch (error: any) {
    console.error('Error creating quote:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    })
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit quote request',
      details: error.message 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Get user's projects/quotes
    const projects = await db.project.findMany({
      where: { userId },
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