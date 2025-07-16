'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { Bell, MessageSquare, CheckCircle, UserCheck, AlertCircle } from 'lucide-react'

interface TicketNotificationProps {
    ticketId: string
    userId: string
    userRole: string
}

export default function TicketNotification({ ticketId, userId, userRole }: TicketNotificationProps) {
    useEffect(() => {
        // This would be replaced with a real-time notification system
        // For now, we'll use a simple polling mechanism or websocket
        // In a real application, you'd use Socket.IO, Server-Sent Events, or WebSockets

        const checkForUpdates = async () => {
            try {
                // This would check for new updates since last visit
                // For now, we'll just show a welcome message
                if (userRole === 'ADMIN' || userRole === 'SUPPORT') {
                    toast('Ticket notifications enabled', {
                        description: 'You will receive notifications for ticket updates',
                        icon: <Bell className="w-4 h-4" />
                    })
                }
            } catch (error) {
                console.error('Error checking for updates:', error)
            }
        }

        checkForUpdates()

        // Set up polling for updates (replace with real-time solution)
        const interval = setInterval(checkForUpdates, 30000) // Check every 30 seconds

        return () => {
            clearInterval(interval)
        }
    }, [ticketId, userId, userRole])

    return null // This component doesn't render anything visible
}

// Utility functions for showing different types of notifications
export const showTicketNotification = {
    newComment: (ticketId: string, username: string) => {
        toast('New comment added', {
            description: `${username} added a comment to ticket #${ticketId.slice(-8)}`,
            icon: <MessageSquare className="w-4 h-4" />,
            action: {
                label: 'View',
                onClick: () => window.location.href = `/ticket/${ticketId}`
            }
        })
    },

    statusChange: (ticketId: string, oldStatus: string, newStatus: string, username: string) => {
        toast('Ticket status updated', {
            description: `${username} changed status from ${oldStatus} to ${newStatus}`,
            icon: <CheckCircle className="w-4 h-4" />,
            action: {
                label: 'View',
                onClick: () => window.location.href = `/ticket/${ticketId}`
            }
        })
    },

    assignment: (ticketId: string, assignedTo: string, username: string) => {
        toast('Ticket assigned', {
            description: `${username} assigned ticket to ${assignedTo}`,
            icon: <UserCheck className="w-4 h-4" />,
            action: {
                label: 'View',
                onClick: () => window.location.href = `/ticket/${ticketId}`
            }
        })
    },

    highPriority: (ticketId: string, priority: string) => {
        toast('High priority ticket', {
            description: `Ticket #${ticketId.slice(-8)} marked as ${priority} priority`,
            icon: <AlertCircle className="w-4 h-4" />,
            action: {
                label: 'View',
                onClick: () => window.location.href = `/ticket/${ticketId}`
            }
        })
    }
} 