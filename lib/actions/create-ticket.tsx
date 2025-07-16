'use server'

import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'PROJECT_SETUP'

export interface CreateTicketData {
    title: string
    description: string
    priority: TicketPriority
    category: TicketCategory
}

export interface CreateTicketResult {
    success: boolean
    error?: string
    ticket?: {
        id: string
        title: string
        description: string
        status: string
        priority: TicketPriority
        category: TicketCategory
        createdAt: Date
        createdBy: {
            id: string
            firstName: string | null
            lastName: string | null
            email: string
        }
    }
}

export async function createTicket(data: CreateTicketData): Promise<CreateTicketResult> {
    try {
        // Get current user
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required. Please sign in.'
            }
        }

        // Validate required fields
        if (!data.title?.trim()) {
            return {
                success: false,
                error: 'Title is required'
            }
        }

        if (!data.description?.trim()) {
            return {
                success: false,
                error: 'Description is required'
            }
        }

        // Validate priority
        if (!['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(data.priority)) {
            return {
                success: false,
                error: 'Invalid priority. Must be LOW, MEDIUM, HIGH, or URGENT'
            }
        }

        // Validate category
        if (!['TECHNICAL', 'BILLING', 'GENERAL', 'FEATURE_REQUEST', 'BUG_REPORT', 'PROJECT_SETUP'].includes(data.category)) {
            return {
                success: false,
                error: 'Invalid category'
            }
        }

        console.log('Creating ticket with server action:', {
            title: data.title,
            description: data.description,
            priority: data.priority,
            category: data.category,
            userId: user.id
        })

        // Create ticket in database
        const ticket = await db.ticket.create({
            data: {
                title: data.title.trim(),
                description: data.description.trim(),
                priority: data.priority,
                category: data.category,
                status: 'OPEN',
                createdById: user.id
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        })

        console.log('Ticket created successfully via server action:', {
            id: ticket.id,
            title: ticket.title,
            status: ticket.status
        })

        // Revalidate the dashboard to show the new ticket
        revalidatePath('/dashboard')

        return {
            success: true,
            ticket: {
                id: ticket.id,
                title: ticket.title,
                description: ticket.description,
                status: ticket.status,
                priority: ticket.priority,
                category: ticket.category,
                createdAt: ticket.createdAt,
                createdBy: ticket.createdBy
            }
        }

    } catch (error) {
        console.error('Error creating ticket with server action:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create ticket. Please try again.'
        }
    }
}

export async function getTickets() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required',
                tickets: []
            }
        }

        // Get tickets based on user role
        const tickets = user.role === 'ADMIN' || user.role === 'SUPPORT'
            ? await db.ticket.findMany({
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })
            : await db.ticket.findMany({
                where: {
                    createdById: user.id
                },
                include: {
                    createdBy: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    },
                    assignedTo: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            })

        return {
            success: true,
            tickets
        }

    } catch (error) {
        console.error('Error fetching tickets:', error)

        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch tickets',
            tickets: []
        }
    }
} 