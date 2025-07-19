import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@/lib/generated/prisma'
import { getCurrentUser } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 401 })
    }

    const { projectId, paymentAmount } = await request.json()

    if (!projectId || !paymentAmount) {
      return NextResponse.json({ error: 'projectId and paymentAmount required' }, { status: 400 })
    }

    // Find the project
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        payments: {
          where: { status: 'SUCCEEDED' }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Create a test payment record
    const payment = await prisma.payment.create({
      data: {
        userId: project.userId,
        stripePaymentIntentId: `test_${Date.now()}`,
        amount: paymentAmount,
        currency: 'usd',
        status: 'SUCCEEDED',
        type: 'ONE_TIME',
        description: `Test payment for ${project.name}`,
        metadata: {
          projectId: project.id,
          test: true
        }
      }
    })

    // Calculate total paid amount from all successful payments
    const allPayments = await prisma.payment.findMany({
      where: {
        userId: project.userId,
        status: 'SUCCEEDED',
        metadata: {
          path: ['projectId'],
          equals: projectId
        }
      }
    })

    const totalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0)

    // Update project with new paid amount
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { 
        paidAmount: totalPaid,
        // If fully paid, update status to IN_PROGRESS
        ...(totalPaid >= project.totalAmount && project.status === 'QUOTE_APPROVED' && {
          status: 'IN_PROGRESS'
        })
      }
    })

    // Create invoice record for the payment
    await prisma.invoice.create({
      data: {
        userId: project.userId,
        stripeInvoiceId: payment.stripePaymentIntentId,
        number: `TEST-${Date.now()}`,
        status: 'PAID',
        subtotal: paymentAmount,
        tax: 0,
        total: paymentAmount,
        currency: 'usd',
        description: `Test Project Payment - ${project.name}`,
        invoiceDate: new Date(),
        paidAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Test payment processed successfully',
      payment: {
        id: payment.id,
        amount: payment.amount,
        description: payment.description
      },
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        paidAmount: updatedProject.paidAmount,
        totalAmount: updatedProject.totalAmount,
        status: updatedProject.status
      }
    })
  } catch (error) {
    console.error('Error processing test payment:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 