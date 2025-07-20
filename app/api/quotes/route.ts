import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    
    if (!clerkId) {
      return NextResponse.json({ 
        success: false,
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Look up the user's internal database ID
    const user = await db.user.findUnique({
      where: { clerkId }
    })

    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'User not found in database' 
      }, { status: 404 })
    }

    const body = await request.json()
    const { quote, contactInfo, selectedServices } = body

    console.log('Creating project with quote:', {
      clerkId,
      userId: user.id,
      contactInfo,
      quote,
      selectedServices
    })

    // Create the project
    console.log('Creating project...')
    const project = await db.project.create({
      data: {
        userId: user.id,
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
    console.log('Project created:', project.id)

    // Create project services
    console.log('Creating project services for:', selectedServices.length, 'services')
    const serviceErrors: string[] = []
    
    for (const selectedService of selectedServices) {
      console.log('Creating service:', selectedService.service.id, selectedService.service.name)
      
      try {
        // First verify the service exists
        const serviceExists = await db.service.findUnique({
          where: { id: selectedService.service.id }
        })
        
        if (!serviceExists) {
          console.error('Service not found in database:', selectedService.service.id)
          serviceErrors.push(`Service "${selectedService.service.name}" not found`)
          continue
        }
        
        await db.projectService.create({
          data: {
            projectId: project.id,
            serviceId: selectedService.service.id,
            customName: selectedService.service.name,
            notes: `Selected from pricing page - ${selectedService.service.description}`
          }
        })
        console.log('Service created successfully')
        
        // Create project add-ons if any
        if (selectedService.addOns && selectedService.addOns.length > 0) {
          console.log('Creating', selectedService.addOns.length, 'add-ons')
          for (const addOn of selectedService.addOns) {
            try {
              await db.projectAddOn.create({
                data: {
                  projectId: project.id,
                  addOnId: addOn.id,
                  customName: addOn.name,
                  notes: `Selected from pricing page`
                }
              })
            } catch (addOnError) {
              const errorMessage = addOnError instanceof Error ? addOnError.message : 'Unknown error'
              console.error('Error creating add-on:', addOn.name, errorMessage)
              serviceErrors.push(`Add-on "${addOn.name}" failed: ${errorMessage}`)
            }
          }
        }
      } catch (serviceError) {
        const errorMessage = serviceError instanceof Error ? serviceError.message : 'Unknown error'
        console.error('Error creating project service:', {
          serviceId: selectedService.service.id,
          serviceName: selectedService.service.name,
          error: errorMessage
        })
        serviceErrors.push(`Service "${selectedService.service.name}": ${errorMessage}`)
      }
    }
    
    if (serviceErrors.length > 0) {
      console.warn('Some services/add-ons failed to create:', serviceErrors)
      // Still return success but log the issues
    }

    console.log('Project created successfully:', project.id)

    return NextResponse.json({
      success: true,
      projectId: project.id,
      message: 'Quote request submitted successfully!'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error creating quote:', {
      message: errorMessage
    })
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit quote request',
      details: errorMessage 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Look up the user's internal database ID
    const user = await db.user.findUnique({
      where: { clerkId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get user's projects/quotes
    const projects = await db.project.findMany({
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