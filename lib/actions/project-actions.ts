'use server'

import { stripe } from '@/lib/stripe'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'
// import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

interface ProjectRequest {
  name: string
  description?: string
  services: {
    serviceId: string
    addOnIds: string[]
  }[]
  customerInfo: {
    name: string
    email: string
    phone?: string
    company?: string
  }
  requirements?: string
}

export async function createProject(projectData: ProjectRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    // Get services and calculate total
    const services = await prisma.service.findMany({
      where: {
        id: { in: projectData.services.map(s => s.serviceId) }
      },
      include: {
        addOns: true
      }
    })

    let totalAmount = 0
    const projectServices = []
    const projectAddOns = []

    for (const serviceRequest of projectData.services) {
      const service = services.find(s => s.id === serviceRequest.serviceId)
      if (!service) continue

      totalAmount += service.basePrice
      projectServices.push({
        serviceId: service.id,
        customPrice: service.basePrice
      })

      // Add add-ons
      for (const addOnId of serviceRequest.addOnIds) {
        const addOn = service.addOns.find(a => a.id === addOnId)
        if (!addOn) continue

        let addOnPrice = 0
        if (addOn.priceType === 'FIXED') {
          addOnPrice = addOn.price || 0
        } else if (addOn.priceType === 'PERCENTAGE') {
          addOnPrice = Math.round(service.basePrice * (addOn.percentage || 0) / 100)
        }

        totalAmount += addOnPrice
        projectAddOns.push({
          addOnId: addOn.id,
          customPrice: addOnPrice
        })
      }
    }

    // Create project
    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name: projectData.name,
        description: projectData.description,
        totalAmount,
        status: 'QUOTE_REQUESTED',
        services: {
          create: projectServices
        },
        addOns: {
          create: projectAddOns
        },
        metadata: {
          customerInfo: projectData.customerInfo,
          requirements: projectData.requirements
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
        }
      }
    })

    return { success: true, project }
  } catch (error) {
    console.error('Error creating project:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function createProjectPayment(projectId: string, paymentType: 'full' | 'deposit' | 'remaining' = 'deposit') {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id
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
        }
      }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
          clerkId: user.clerkId
        }
      })
      
      customerId = customer.id
      
      // Update user with customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Calculate payment amount
    const fullAmount = project.totalAmount
    const paidAmount = project.paidAmount
    let paymentAmount: number
    
    if (paymentType === 'full') {
        paymentAmount = fullAmount
    } else if (paymentType === 'deposit') {
        paymentAmount = Math.round(fullAmount * 0.5) // 50% deposit
    } else if (paymentType === 'remaining') {
        paymentAmount = fullAmount - paidAmount // Remaining balance
    } else {
        throw new Error('Invalid payment type')
    }

    // Ensure payment amount is positive
    if (paymentAmount <= 0) {
        throw new Error('Payment amount must be greater than zero')
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'usd',
      customer: customerId,
      metadata: {
        projectId: project.id,
        userId: user.id,
        paymentType,
        fullAmount: fullAmount.toString()
      },
      description: `${paymentType === 'full' ? 'Full payment' : paymentType === 'deposit' ? 'Deposit' : 'Remaining payment'} for ${project.name}`
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_intent_data: {
        metadata: paymentIntent.metadata
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${project.name} - ${paymentType === 'full' ? 'Full Payment' : paymentType === 'deposit' ? 'Deposit' : 'Remaining Payment'}`,
            description: project.description || 'Web development project'
          },
          unit_amount: paymentAmount
        },
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')}/dashboard?tab=projects&success=true&project=${project.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')}/dashboard?tab=projects&canceled=true&project=${project.id}`,
      metadata: {
        projectId: project.id,
        userId: user.id,
        paymentType
      }
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error('Error creating project payment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function createAddOnPayment(projectId: string, addOnPrice: number, addOnName: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id
      }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Create or get Stripe customer
    let customerId = user.stripeCustomerId
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id,
          clerkId: user.clerkId
        }
      })
      
      customerId = customer.id
      
      // Update user with customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      })
    }

    // Create payment intent for add-on only
    const paymentIntent = await stripe.paymentIntents.create({
      amount: addOnPrice,
      currency: 'usd',
      customer: customerId,
      metadata: {
        projectId: project.id,
        userId: user.id,
        paymentType: 'addon',
        addOnPrice: addOnPrice.toString(),
        fullAmount: project.totalAmount.toString()
      },
      description: `Add-on: ${addOnName} for ${project.name}`
    })

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_intent_data: {
        metadata: paymentIntent.metadata
      },
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${addOnName} - Add-on Service`,
            description: `Additional service for project: ${project.name}`
          },
          unit_amount: addOnPrice
        },
        quantity: 1
      }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?tab=projects&success=true&addon=true&project=${project.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?tab=projects&canceled=true&project=${project.id}`,
      metadata: {
        projectId: project.id,
        userId: user.id,
        paymentType: 'addon'
      }
    })

    return { success: true, url: session.url }
  } catch (error) {
    console.error('Error creating add-on payment:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function createProjectSubscriptions(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id
      },
      include: {
        services: {
          include: {
            service: true
          }
        }
      }
    })

    if (!project) {
      throw new Error('Project not found')
    }

    // Get recurring services (hosting, maintenance, etc.)
    const recurringServices = project.services.filter(ps => ps.service.priceType === 'RECURRING')
    
    if (recurringServices.length === 0) {
      return { success: true, message: 'No recurring services found' }
    }

    // Create subscription for each recurring service
    const subscriptions = []
    
    for (const projectService of recurringServices) {
      const service = projectService.service
      
      // Create Stripe price for this service if it doesn't exist
      let stripePriceId = service.stripePriceId
      if (!stripePriceId) {
        const stripePrice = await stripe.prices.create({
          currency: 'usd',
          unit_amount: service.basePrice,
          recurring: {
            interval: (service.billingInterval as 'day' | 'week' | 'month' | 'year') || 'month'
          },
          product_data: {
            name: service.name
          }
        })
        
        stripePriceId = stripePrice.id
        
        // Update service with Stripe price ID
        await prisma.service.update({
          where: { id: service.id },
          data: { stripePriceId }
        })
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: user.stripeCustomerId!,
        items: [{
          price: stripePriceId
        }],
        metadata: {
          projectId: project.id,
          serviceId: service.id,
          userId: user.id
        }
      })

      subscriptions.push(subscription)
    }

    return { success: true, subscriptions }
  } catch (error) {
    console.error('Error creating project subscriptions:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function getProjectsForUser() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

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

    return { success: true, projects }
  } catch (error) {
    console.error('Error getting projects:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
}

export async function approveProject(projectId: string) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }

    const project = await prisma.project.update({
      where: { 
        id: projectId,
        userId: user.id
      },
      data: {
        status: 'QUOTE_APPROVED',
        contractSigned: true,
        contractDate: new Date()
      }
    })

    return { success: true, project }
  } catch (error) {
    console.error('Error approving project:', error)
    return { success: false, error: error instanceof Error ? error.message : 'An error occurred' }
  }
} 