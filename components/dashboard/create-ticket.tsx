'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Send, AlertCircle, Bug, HelpCircle, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { createTicket, type TicketPriority, type TicketCategory } from '@/lib/actions/create-ticket'

export default function CreateTicket() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM' as TicketPriority,
        category: 'GENERAL' as TicketCategory
    })

    const priorityOptions: { value: TicketPriority; label: string; color: string }[] = [
        { value: 'LOW', label: 'Low', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
        { value: 'MEDIUM', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
        { value: 'HIGH', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' },
        { value: 'URGENT', label: 'Urgent', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' }
    ]

    const categoryOptions: { value: TicketCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
        { value: 'PROJECT_SETUP', label: 'Project Setup', icon: Plus },
        { value: 'TECHNICAL', label: 'Technical Issue', icon: AlertCircle },
        { value: 'BUG_REPORT', label: 'Bug Report', icon: Bug },
        { value: 'BILLING', label: 'Billing', icon: CreditCard },
        { value: 'FEATURE_REQUEST', label: 'Feature Request', icon: Plus },
        { value: 'GENERAL', label: 'General Inquiry', icon: HelpCircle }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            // Use server action instead of API route
            const result = await createTicket(formData)

            if (result.success) {
                toast.success('Ticket created successfully!')
                console.log('Ticket created:', result.ticket)

                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    priority: 'MEDIUM',
                    category: 'GENERAL'
                })
            } else {
                toast.error(result.error || 'Failed to create ticket')
            }
        } catch (error) {
            console.error('Error creating ticket:', error)
            toast.error('Failed to create ticket. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Ticket
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Title</label>
                        <Input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Brief description of your issue..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Please provide detailed information about your issue..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {categoryOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TicketPriority })}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {priorityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                        <Badge className={priorityOptions.find(p => p.value === formData.priority)?.color}>
                            {priorityOptions.find(p => p.value === formData.priority)?.label}
                        </Badge>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                Create Ticket
                            </>
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
} 