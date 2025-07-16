'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
    Calendar,
    User,
    MessageSquare,
    AlertCircle,
    Bug,
    HelpCircle,
    CreditCard,
    Plus,
    Send,
    CheckCircle,
    Clock,
    UserCheck,
    Eye,
    EyeOff,
    FileText,
    Download
} from 'lucide-react'
import { toast } from 'sonner'
import { addComment, updateTicketStatus, assignTicket, getSupportUsers } from '@/lib/actions/ticket-actions'
import type { TicketStatus } from '@/lib/actions/ticket-actions'
import FileUpload from './file-upload'

interface TicketDetailUser {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    role: string
}

interface TicketUpdate {
    id: string
    type: string
    content: string
    oldValue: string | null
    newValue: string | null
    isInternal: boolean
    createdAt: Date
    user: TicketDetailUser
    attachments?: {
        id: string
        filename: string
        originalName: string
        url: string
        fileType: string
        fileSize: number
        uploadedBy: {
            id: string
            firstName: string | null
            lastName: string | null
        }
    }[]
}

interface TicketDetailData {
    id: string
    title: string
    description: string
    status: TicketStatus
    priority: string
    category: string
    isResolved: boolean
    resolvedAt: Date | null
    closedAt: Date | null
    createdAt: Date
    updatedAt: Date
    createdBy: TicketDetailUser
    assignedTo: TicketDetailUser | null
    updates: TicketUpdate[]
}

interface TicketDetailProps {
    ticket: TicketDetailData
    currentUserId: string
    currentUserRole: string
}

export default function TicketDetail({ ticket, currentUserRole }: { ticket: TicketDetailData; currentUserRole: string }) {
    const [isAddingComment, setIsAddingComment] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [isInternal, setIsInternal] = useState(false)
    const [attachments, setAttachments] = useState<{
        filename: string
        originalName: string
        url: string
        fileType: string
        fileSize: number
    }[]>([])
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [newStatus, setNewStatus] = useState<TicketStatus>(ticket.status)
    const [statusComment, setStatusComment] = useState('')
    const [supportUsers, setSupportUsers] = useState<{ id: string; firstName: string | null; lastName: string | null; email: string; role: string }[]>([])
    const [showAssignment, setShowAssignment] = useState(false)
    const [isAssigning, setIsAssigning] = useState(false)

    const isAdminOrSupport = currentUserRole === 'ADMIN' || currentUserRole === 'SUPPORT'

    const statusOptions: { value: TicketStatus; label: string; color: string }[] = [
        { value: 'OPEN', label: 'Open', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
        { value: 'IN_PROGRESS', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { value: 'RESOLVED', label: 'Resolved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        { value: 'CLOSED', label: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400' },
        { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    ]

    const priorityColors = {
        'LOW': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        'MEDIUM': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        'HIGH': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
        'URGENT': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    }

    const categoryIcons = {
        'PROJECT_SETUP': <Plus className="w-4 h-4" />,
        'TECHNICAL': <AlertCircle className="w-4 h-4" />,
        'BUG_REPORT': <Bug className="w-4 h-4" />,
        'BILLING': <CreditCard className="w-4 h-4" />,
        'FEATURE_REQUEST': <Plus className="w-4 h-4" />,
        'GENERAL': <HelpCircle className="w-4 h-4" />
    }

    const handleAddComment = async () => {
        if (!commentContent.trim()) return

        setIsAddingComment(true)
        try {
            const result = await addComment({
                ticketId: ticket.id,
                content: commentContent,
                isInternal: isInternal,
                attachments: attachments.length > 0 ? attachments : undefined
            })

            if (result.success) {
                toast.success('Comment added successfully')
                setCommentContent('')
                setAttachments([])
                setIsInternal(false)
                // Refresh the page to show the new comment
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to add comment')
            }
        } catch (error) {
            toast.error('Failed to add comment')
        } finally {
            setIsAddingComment(false)
        }
    }

    const handleStatusUpdate = async () => {
        setIsUpdatingStatus(true)
        try {
            const result = await updateTicketStatus({
                ticketId: ticket.id,
                status: newStatus,
                comment: statusComment
            })

            if (result.success) {
                toast.success('Status updated successfully')
                setStatusComment('')
                // Refresh the page to show the status update
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to update status')
            }
        } catch (error) {
            toast.error('Failed to update status')
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const loadSupportUsers = async () => {
        const result = await getSupportUsers()
        if (result.success) {
            setSupportUsers(result.users)
        }
    }

    const handleAssignTicket = async (userId: string) => {
        try {
            const result = await assignTicket({
                ticketId: ticket.id,
                assignedToId: userId
            })

            if (result.success) {
                toast.success('Ticket assigned successfully')
                setShowAssignment(false)
                // Refresh the page to show the assignment
                window.location.reload()
            } else {
                toast.error(result.error || 'Failed to assign ticket')
            }
        } catch (error) {
            toast.error('Failed to assign ticket')
        }
    }

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const getUpdateIcon = (type: string) => {
        switch (type) {
            case 'COMMENT':
                return <MessageSquare className="w-4 h-4" />
            case 'STATUS_CHANGE':
                return <CheckCircle className="w-4 h-4" />
            case 'ASSIGNMENT':
                return <UserCheck className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Ticket Header */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                {categoryIcons[ticket.category as keyof typeof categoryIcons]}
                                <CardTitle className="text-lg sm:text-xl">{ticket.title}</CardTitle>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                {ticket.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {ticket.createdBy.firstName} {ticket.createdBy.lastName}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(ticket.createdAt)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex sm:flex-col gap-2 justify-start sm:justify-end">
                            <Badge className={statusOptions.find(s => s.value === ticket.status)?.color}>
                                {ticket.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={priorityColors[ticket.priority as keyof typeof priorityColors]}>
                                {ticket.priority}
                            </Badge>
                        </div>
                    </div>
                </CardHeader>

                {/* Admin/Support Controls */}
                {isAdminOrSupport && (
                    <CardContent className="border-t pt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                                <span className="text-sm font-medium">Assigned to:</span>
                                {ticket.assignedTo ? (
                                    <span className="text-sm">
                                        {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-500">Unassigned</span>
                                )}
                            </div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setShowAssignment(!showAssignment)
                                        if (!showAssignment) loadSupportUsers()
                                    }}
                                    className="w-full sm:w-auto"
                                >
                                    <UserCheck className="w-4 h-4 mr-1" />
                                    {ticket.assignedTo ? 'Reassign' : 'Assign'}
                                </Button>

                                <div className="flex items-center gap-2 w-full sm:w-auto">
                                    {/* Status Update */}
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                                        className="flex-1 sm:flex-none border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>

                                    {newStatus !== ticket.status && (
                                        <Button
                                            size="sm"
                                            onClick={handleStatusUpdate}
                                            disabled={isUpdatingStatus}
                                            className="whitespace-nowrap"
                                        >
                                            {isUpdatingStatus ? 'Updating...' : 'Update Status'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Assignment Dropdown */}
                        {showAssignment && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <div className="space-y-2">
                                    {supportUsers.map(user => (
                                        <div key={user.id} className="flex items-center justify-between">
                                            <span className="text-sm">
                                                {user.firstName} {user.lastName} ({user.role})
                                            </span>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAssignTicket(user.id)}
                                                disabled={ticket.assignedTo?.id === user.id}
                                            >
                                                {ticket.assignedTo?.id === user.id ? 'Current' : 'Assign'}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                )}
            </Card>

            {/* Conversation Thread */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Conversation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {ticket.updates.map((update) => (
                            <div key={update.id} className="flex gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                    {getUpdateIcon(update.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">
                                            {update.user.firstName} {update.user.lastName}
                                        </span>
                                        <Badge variant="outline" className="text-xs">
                                            {update.user.role}
                                        </Badge>
                                        {update.isInternal && (
                                            <Badge variant="secondary" className="text-xs">
                                                <Eye className="w-3 h-3 mr-1" />
                                                Internal
                                            </Badge>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {formatDate(update.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {update.content}
                                    </p>

                                    {/* Attachments */}
                                    {update.attachments && update.attachments.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                                Attachments ({update.attachments.length})
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {update.attachments.map((attachment) => (
                                                    <div key={attachment.id} className="flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded border">
                                                        <div className="flex-shrink-0">
                                                            {attachment.fileType.startsWith('image/') ? (
                                                                <img
                                                                    src={attachment.url}
                                                                    alt={attachment.originalName}
                                                                    className="w-8 h-8 object-cover rounded"
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded flex items-center justify-center">
                                                                    {attachment.fileType.includes('pdf') ? (
                                                                        <FileText className="w-4 h-4 text-red-500" />
                                                                    ) : (
                                                                        <AlertCircle className="w-4 h-4 text-gray-500" />
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                                                {attachment.originalName}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {formatFileSize(attachment.fileSize)}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => window.open(attachment.url, '_blank')}
                                                            className="text-blue-500 hover:text-blue-700"
                                                        >
                                                            <Download className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Comment Form */}
                    <div className="mt-6 pt-4 border-t">
                        <div className="space-y-3">
                            <Textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Add a comment..."
                                rows={3}
                            />

                            {/* File Upload Section */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Attachments (optional)
                                </label>
                                <FileUpload
                                    onUploadComplete={setAttachments}
                                    maxFiles={3}
                                    acceptedTypes={['image/*', 'application/pdf', 'text/plain', '.docx', '.doc']}
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {isAdminOrSupport && (
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={isInternal}
                                                onChange={(e) => setIsInternal(e.target.checked)}
                                                className="rounded"
                                            />
                                            <EyeOff className="w-4 h-4" />
                                            Internal Note
                                        </label>
                                    )}
                                </div>
                                <Button
                                    onClick={handleAddComment}
                                    disabled={isAddingComment || !commentContent.trim()}
                                >
                                    {isAddingComment ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2"></div>
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Add Comment
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 