import { notFound, redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { getTicketDetails } from '@/lib/actions/ticket-actions'
import TicketDetail from '@/components/dashboard/ticket-detail'

interface TicketPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function TicketPage({ params }: TicketPageProps) {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    const resolvedParams = await params
    const result = await getTicketDetails(resolvedParams.id)

    if (!result.success || !result.ticket) {
        notFound()
    }

    const ticket = result.ticket

    // Check if user has permission to view this ticket
    const isAdmin = user.role === 'ADMIN'
    const isSupport = user.role === 'SUPPORT'
    const isOwner = ticket.createdBy.id === user.id
    const isAssigned = ticket.assignedToId === user.id

    if (!isAdmin && !isSupport && !isOwner && !isAssigned) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <TicketDetail ticket={ticket} currentUserRole={user.role} />
                </div>
            </div>
        </div>
    )
} 