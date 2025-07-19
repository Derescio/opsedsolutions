import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { PrismaClient } from '@/lib/generated/prisma'

const prisma = new PrismaClient()

// TypeScript interfaces for project metadata
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
  [key: string]: unknown
}

export async function GET() {
  try {
    // Check if user is authenticated and is admin
    const user = await getCurrentUser()
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total projects
    const totalProjects = await prisma.project.count()

    // Get active projects
    const activeProjects = await prisma.project.count({
      where: {
        status: {
          in: ['QUOTE_SENT', 'QUOTE_APPROVED', 'IN_PROGRESS']
        }
      }
    })

    // Get total revenue from payments
    const totalRevenue = await prisma.payment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        status: 'SUCCEEDED'
      }
    })

    // Get monthly revenue (last 12 months)
    const monthlyRevenue = await prisma.$queryRaw`
      SELECT 
        EXTRACT(YEAR FROM created_at) as year,
        EXTRACT(MONTH FROM created_at) as month,
        SUM(amount) as revenue
      FROM payments 
      WHERE status = 'SUCCEEDED' 
        AND created_at >= NOW() - INTERVAL '12 months'
      GROUP BY EXTRACT(YEAR FROM created_at), EXTRACT(MONTH FROM created_at)
      ORDER BY year DESC, month DESC
    `

    // Get recent activity (last 10 projects with status changes)
    const recentProjects = await prisma.project.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    })

    const recentActivity = recentProjects.map(project => {
      const metadata = project.metadata as ProjectMetadata
      const customerInfo = metadata?.customerInfo || {}
      let activityType = 'quote_requested'
      let description = `New quote requested by ${customerInfo.name || 'Unknown'}`

      switch (project.status) {
        case 'QUOTE_SENT':
          activityType = 'quote_sent'
          description = `Quote sent to ${customerInfo.name || 'Unknown'}`
          break
        case 'QUOTE_APPROVED':
          activityType = 'quote_approved'
          description = `Quote approved by ${customerInfo.name || 'Unknown'}`
          break
        case 'IN_PROGRESS':
          activityType = 'project_started'
          description = `Project started for ${customerInfo.name || 'Unknown'}`
          break
        case 'COMPLETED':
          activityType = 'project_completed'
          description = `Project completed for ${customerInfo.name || 'Unknown'}`
          break
        case 'CANCELLED':
          activityType = 'project_cancelled'
          description = `Project cancelled for ${customerInfo.name || 'Unknown'}`
          break
      }

      return {
        id: project.id,
        type: activityType,
        description,
        timestamp: project.updatedAt,
        amount: project.totalAmount
      }
    })

    // Get payment statistics
    const paymentStats = await prisma.payment.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      _sum: {
        amount: true
      }
    })

    // Get service popularity
    const serviceStats = await prisma.projectService.groupBy({
      by: ['serviceId'],
      _count: {
        serviceId: true
      },
      orderBy: {
        _count: {
          serviceId: 'desc'
        }
      },
      take: 5
    })

    return NextResponse.json({
      success: true,
      metrics: {
        totalProjects,
        activeProjects,
        totalRevenue: totalRevenue._sum.amount || 0,
        monthlyRevenue,
        recentActivity,
        paymentStats,
        serviceStats
      }
    })
  } catch (error) {
    console.error('Error fetching metrics:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch metrics' },
      { status: 500 }
    )
  }
} 