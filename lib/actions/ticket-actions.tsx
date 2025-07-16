'use server'

import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED'
export type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
export type TicketCategory = 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'PROJECT_SETUP'
export type UpdateType = 'COMMENT' | 'STATUS_CHANGE' | 'PRIORITY_CHANGE' | 'ASSIGNMENT' | 'INTERNAL_NOTE'

export interface AddCommentData {
    ticketId: string
    content: string
    isInternal?: boolean
    attachments?: {
        filename: string
        originalName: string
        url: string
        fileType: string
        fileSize: number
    }[]
}

export interface UpdateTicketStatusData {
    ticketId: string
    status: TicketStatus
    comment?: string
}

export interface AssignTicketData {
    ticketId: string
    assignedToId: string
}

// Get detailed ticket with full update history
export async function getTicketDetails(ticketId: string) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required'
            }
        }

        // Get ticket with all updates
        const ticket = await db.ticket.findFirst({
            where: {
                id: ticketId,
                // Users can only see their own tickets unless they're admin/support
                ...(user.role === 'CLIENT' ? { createdById: user.id } : {})
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                updates: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                role: true
                            }
                        },
                        attachments: {
                            include: {
                                uploadedBy: {
                                    select: {
                                        id: true,
                                        firstName: true,
                                        lastName: true
                                    }
                                }
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'asc'
                    }
                }
            }
        })

        if (!ticket) {
            return {
                success: false,
                error: 'Ticket not found or access denied'
            }
        }

        // Filter out internal notes for non-admin/support users
        const filteredUpdates = user.role === 'CLIENT'
            ? ticket.updates.filter(update => !update.isInternal)
            : ticket.updates

        return {
            success: true,
            ticket: {
                ...ticket,
                updates: filteredUpdates
            }
        }

    } catch (error) {
        console.error('Error fetching ticket details:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch ticket details'
        }
    }
}

// Add comment to ticket
export async function addComment(data: AddCommentData) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required'
            }
        }

        // Validate input
        if (!data.content?.trim()) {
            return {
                success: false,
                error: 'Comment content is required'
            }
        }

        // Check if user can access this ticket
        const ticket = await db.ticket.findFirst({
            where: {
                id: data.ticketId,
                ...(user.role === 'CLIENT' ? { createdById: user.id } : {})
            }
        })

        if (!ticket) {
            return {
                success: false,
                error: 'Ticket not found or access denied'
            }
        }

        // Only admin/support can add internal notes
        const isInternal = data.isInternal && (user.role === 'ADMIN' || user.role === 'SUPPORT')

        // Create comment with attachments
        const comment = await db.ticketUpdate.create({
            data: {
                ticketId: data.ticketId,
                userId: user.id,
                type: 'COMMENT',
                content: data.content.trim(),
                isInternal: isInternal || false,
                attachments: data.attachments ? {
                    create: data.attachments.map(attachment => ({
                        filename: attachment.filename,
                        originalName: attachment.originalName,
                        url: attachment.url,
                        fileType: attachment.fileType,
                        fileSize: attachment.fileSize,
                        uploadedById: user.id
                    }))
                } : undefined
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true
                    }
                },
                attachments: {
                    include: {
                        uploadedBy: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                }
            }
        })

        // Update ticket's updatedAt timestamp
        await db.ticket.update({
            where: { id: data.ticketId },
            data: { updatedAt: new Date() }
        })

        // Revalidate pages
        revalidatePath('/dashboard')
        revalidatePath(`/ticket/${data.ticketId}`)

        return {
            success: true,
            comment
        }

    } catch (error) {
        console.error('Error adding comment:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to add comment'
        }
    }
}

// Update ticket status
export async function updateTicketStatus(data: UpdateTicketStatusData) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required'
            }
        }

        // Only admin/support can update status
        if (user.role !== 'ADMIN' && user.role !== 'SUPPORT') {
            return {
                success: false,
                error: 'Insufficient permissions to update ticket status'
            }
        }

        // Validate status
        if (!['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'].includes(data.status)) {
            return {
                success: false,
                error: 'Invalid ticket status'
            }
        }

        // Get current ticket
        const currentTicket = await db.ticket.findUnique({
            where: { id: data.ticketId },
            select: { status: true }
        })

        if (!currentTicket) {
            return {
                success: false,
                error: 'Ticket not found'
            }
        }

        // Update ticket status
        const updatedTicket = await db.ticket.update({
            where: { id: data.ticketId },
            data: {
                status: data.status,
                isResolved: data.status === 'RESOLVED',
                resolvedAt: data.status === 'RESOLVED' ? new Date() : null,
                closedAt: data.status === 'CLOSED' ? new Date() : null
            }
        })

        // Create status change update
        await db.ticketUpdate.create({
            data: {
                ticketId: data.ticketId,
                userId: user.id,
                type: 'STATUS_CHANGE',
                content: `Status changed from ${currentTicket.status} to ${data.status}`,
                oldValue: currentTicket.status,
                newValue: data.status
            }
        })

        // Add optional comment
        if (data.comment?.trim()) {
            await db.ticketUpdate.create({
                data: {
                    ticketId: data.ticketId,
                    userId: user.id,
                    type: 'COMMENT',
                    content: data.comment.trim(),
                    isInternal: false
                }
            })
        }

        // Revalidate pages
        revalidatePath('/dashboard')
        revalidatePath(`/ticket/${data.ticketId}`)

        return {
            success: true,
            ticket: updatedTicket
        }

    } catch (error) {
        console.error('Error updating ticket status:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to update ticket status'
        }
    }
}

// Assign ticket to user
export async function assignTicket(data: AssignTicketData) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required'
            }
        }

        // Only admin/support can assign tickets
        if (user.role !== 'ADMIN' && user.role !== 'SUPPORT') {
            return {
                success: false,
                error: 'Insufficient permissions to assign tickets'
            }
        }

        // Validate assigned user exists and has appropriate role
        const assignedUser = await db.user.findUnique({
            where: { id: data.assignedToId },
            select: { id: true, role: true, firstName: true, lastName: true }
        })

        if (!assignedUser) {
            return {
                success: false,
                error: 'Assigned user not found'
            }
        }

        if (assignedUser.role !== 'ADMIN' && assignedUser.role !== 'SUPPORT') {
            return {
                success: false,
                error: 'Can only assign tickets to admin or support users'
            }
        }

        // Update ticket assignment
        const updatedTicket = await db.ticket.update({
            where: { id: data.ticketId },
            data: { assignedToId: data.assignedToId }
        })

        // Create assignment update
        await db.ticketUpdate.create({
            data: {
                ticketId: data.ticketId,
                userId: user.id,
                type: 'ASSIGNMENT',
                content: `Ticket assigned to ${assignedUser.firstName} ${assignedUser.lastName}`,
                newValue: data.assignedToId
            }
        })

        // Revalidate pages
        revalidatePath('/dashboard')
        revalidatePath(`/ticket/${data.ticketId}`)

        return {
            success: true,
            ticket: updatedTicket
        }

    } catch (error) {
        console.error('Error assigning ticket:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to assign ticket'
        }
    }
}

// Get all users for assignment dropdown
export async function getSupportUsers() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return {
                success: false,
                error: 'Authentication required',
                users: []
            }
        }

        // Only admin/support can view support users
        if (user.role !== 'ADMIN' && user.role !== 'SUPPORT') {
            return {
                success: false,
                error: 'Insufficient permissions',
                users: []
            }
        }

        const supportUsers = await db.user.findMany({
            where: {
                role: {
                    in: ['ADMIN', 'SUPPORT']
                },
                isActive: true
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            },
            orderBy: {
                firstName: 'asc'
            }
        })

        return {
            success: true,
            users: supportUsers
        }

    } catch (error) {
        console.error('Error fetching support users:', error)
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch support users',
            users: []
        }
    }
} 