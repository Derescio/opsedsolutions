'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Ticket,
    Calendar,
    User,
    MessageSquare,
    AlertCircle,
    Bug,
    HelpCircle,
    CreditCard,
    Plus,
    Filter,
    Search,
    Settings
} from 'lucide-react'
import { Input } from '@/components/ui/input'

type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'CANCELLED'
type TicketPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
type TicketCategory = 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'FEATURE_REQUEST' | 'BUG_REPORT' | 'PROJECT_SETUP'

interface TicketItem {
    id: string
    title: string
    description: string
    status: TicketStatus
    priority: TicketPriority
    category: TicketCategory
    createdAt: Date
    updatedAt: Date
    createdBy: {
        id: string
        firstName: string | null
        lastName: string | null
        email: string
    }
    assignedTo: {
        id: string
        firstName: string | null
        lastName: string | null
        email: string
    } | null
}

interface TicketListProps {
    tickets: TicketItem[]
    isAdmin?: boolean
    onAssignTicket?: (ticketId: string, userId: string) => void
    onUpdateStatus?: (ticketId: string, status: TicketStatus) => void
}

export default function TicketList({ tickets, isAdmin = false, onAssignTicket, onUpdateStatus }: TicketListProps) {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<TicketStatus | 'ALL'>('ALL')
    const [priorityFilter, setPriorityFilter] = useState<TicketPriority | 'ALL'>('ALL')

    const getStatusColor = (status: TicketStatus) => {
        switch (status) {
            case 'OPEN':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'IN_PROGRESS':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'RESOLVED':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'CLOSED':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
            case 'CANCELLED':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getPriorityColor = (priority: TicketPriority) => {
        switch (priority) {
            case 'LOW':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'HIGH':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
            case 'URGENT':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const getCategoryIcon = (category: TicketCategory) => {
        switch (category) {
            case 'TECHNICAL':
                return <AlertCircle className="w-4 h-4" />
            case 'BUG_REPORT':
                return <Bug className="w-4 h-4" />
            case 'BILLING':
                return <CreditCard className="w-4 h-4" />
            case 'FEATURE_REQUEST':
                return <Plus className="w-4 h-4" />
            case 'GENERAL':
                return <HelpCircle className="w-4 h-4" />
            case 'PROJECT_SETUP':
                return <Settings className="w-4 h-4" />
            default:
                return <MessageSquare className="w-4 h-4" />
        }
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter
        const matchesPriority = priorityFilter === 'ALL' || ticket.priority === priorityFilter
        return matchesSearch && matchesStatus && matchesPriority
    })

    return (
        <div className="space-y-4">
            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search tickets..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value as TicketStatus | 'ALL')}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                            >
                                <option value="ALL">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value as TicketPriority | 'ALL')}
                                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                            >
                                <option value="ALL">All Priority</option>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <Ticket className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">
                                {tickets.length === 0 ? 'No tickets found' : 'No tickets match your filters'}
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    filteredTickets.map((ticket) => (
                        <Link key={ticket.id} href={`/ticket/${ticket.id}`}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="mt-1">
                                                {getCategoryIcon(ticket.category)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                    {ticket.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                                                    {ticket.description}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                                    </div>
                                                    {ticket.assignedTo && (
                                                        <div className="flex items-center gap-1">
                                                            <span>Assigned to:</span>
                                                            {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                            <Badge className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {ticket.status.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            {/* Summary */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                        <span>Showing {filteredTickets.length} of {tickets.length} tickets</span>
                        <div className="flex items-center gap-4">
                            <span>Open: {tickets.filter(t => t.status === 'OPEN').length}</span>
                            <span>In Progress: {tickets.filter(t => t.status === 'IN_PROGRESS').length}</span>
                            <span>Resolved: {tickets.filter(t => t.status === 'RESOLVED').length}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 