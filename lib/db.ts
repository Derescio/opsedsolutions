import { PrismaClient } from './generated/prisma'

// Singleton pattern for Prisma client to avoid connection issues
declare global {
  var __prisma: PrismaClient | undefined
}

// Create a single instance of PrismaClient
export const db = globalThis.__prisma || new PrismaClient()

// In development, store the client on the global object to prevent
// multiple instances during hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = db
}

// Database connection utility functions
export const dbUtils = {
  // Test database connection
  async testConnection() {
    try {
      await db.$connect()
      console.log('Database connected successfully')
      return true
    } catch (error) {
      console.error('Database connection failed:', error)
      return false
    }
  },

  // Graceful shutdown
  async disconnect() {
    await db.$disconnect()
  },

  // Health check
  async healthCheck() {
    try {
      await db.$queryRaw`SELECT 1`
      return { status: 'healthy', timestamp: new Date().toISOString() }
    } catch (error) {
      return { status: 'unhealthy', error: error instanceof Error ? error.message : 'Unknown error', timestamp: new Date().toISOString() }
    }
  }
}

// Helper functions for common database operations
export const userHelpers = {
  // Create or update user from Clerk webhook
  async upsertUser(clerkId: string, userData: {
    email: string
    firstName?: string
    lastName?: string
    imageUrl?: string
    phone?: string
  }) {
    try {
      return await db.user.upsert({
        where: { clerkId },
        update: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          imageUrl: userData.imageUrl,
          phone: userData.phone,
          updatedAt: new Date()
        },
        create: {
          clerkId,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          imageUrl: userData.imageUrl,
          phone: userData.phone
        }
      })
    } catch (error: any) {
      // Handle unique constraint error on email (P2002)
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        console.log(`User with email ${userData.email} already exists, updating with new clerkId`)
        
        // Find and update the existing user with the new clerkId
        const existingUser = await db.user.findUnique({
          where: { email: userData.email }
        })
        
        if (existingUser) {
          return await db.user.update({
            where: { id: existingUser.id },
            data: {
              clerkId,
              firstName: userData.firstName,
              lastName: userData.lastName,
              imageUrl: userData.imageUrl,
              phone: userData.phone,
              updatedAt: new Date()
            }
          })
        }
      }
      
      // Re-throw if it's a different error
      throw error
    }
  },

  // Get user by Clerk ID
  async getUserByClerkId(clerkId: string) {
    return await db.user.findUnique({
      where: { clerkId },
      include: {
        ticketsCreated: true,
        ticketsAssigned: true
      }
    })
  },

  // Update user role
  async updateUserRole(clerkId: string, role: 'ADMIN' | 'CLIENT' | 'SUPPORT' | 'MODERATOR') {
    return await db.user.update({
      where: { clerkId },
      data: { role }
    })
  }
}

export const ticketHelpers = {
  // Create a new ticket
  async createTicket(data: {
    title: string
    description: string
    category: 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT'
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    createdById: string
  }) {
    return await db.ticket.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        priority: data.priority || 'MEDIUM',
        createdById: data.createdById
      },
      include: {
        createdBy: true,
        assignedTo: true,
        updates: {
          include: {
            user: true
          }
        }
      }
    })
  },

  // Get tickets with pagination and filtering
  async getTickets(options: {
    page?: number
    limit?: number
    status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED'
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    category?: 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT'
    createdById?: string
    assignedToId?: string
  } = {}) {
    const page = options.page || 1
    const limit = options.limit || 10
    const skip = (page - 1) * limit

    const where: any = {}
    if (options.status) where.status = options.status
    if (options.priority) where.priority = options.priority
    if (options.category) where.category = options.category
    if (options.createdById) where.createdById = options.createdById
    if (options.assignedToId) where.assignedToId = options.assignedToId

    const [tickets, total] = await Promise.all([
      db.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          createdBy: true,
          assignedTo: true,
          updates: {
            include: {
              user: true
            },
            orderBy: { createdAt: 'desc' },
            take: 1 // Get latest update
          }
        }
      }),
      db.ticket.count({ where })
    ])

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    }
  },

  // Update ticket status
  async updateTicketStatus(ticketId: string, status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED', userId: string) {
    const ticket = await db.ticket.findUnique({
      where: { id: ticketId },
      select: { status: true }
    })

    if (!ticket) {
      throw new Error('Ticket not found')
    }

    const updatedTicket = await db.ticket.update({
      where: { id: ticketId },
      data: {
        status,
        isResolved: status === 'RESOLVED',
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
        closedAt: status === 'CLOSED' ? new Date() : null
      }
    })

    // Create update record
    await db.ticketUpdate.create({
      data: {
        ticketId,
        userId,
        type: 'STATUS_CHANGE',
        content: `Status changed from ${ticket.status} to ${status}`,
        oldValue: ticket.status,
        newValue: status
      }
    })

    return updatedTicket
  },

  // Assign ticket to user
  async assignTicket(ticketId: string, assignedToId: string, assignedBy: string) {
    const updatedTicket = await db.ticket.update({
      where: { id: ticketId },
      data: { assignedToId }
    })

    // Create update record
    await db.ticketUpdate.create({
      data: {
        ticketId,
        userId: assignedBy,
        type: 'ASSIGNMENT',
        content: `Ticket assigned to user`,
        newValue: assignedToId
      }
    })

    return updatedTicket
  },

  // Add comment to ticket
  async addComment(ticketId: string, userId: string, content: string, isInternal: boolean = false) {
    return await db.ticketUpdate.create({
      data: {
        ticketId,
        userId,
        type: 'COMMENT',
        content,
        isInternal
      },
      include: {
        user: true,
        ticket: true
      }
    })
  }
}

// Export types for use in other files
export type { User, Ticket, TicketUpdate, Role, Session } from './generated/prisma' 