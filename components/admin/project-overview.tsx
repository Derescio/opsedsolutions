'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
    DollarSign,
    TrendingUp,
    // Users,
    FileText,
    Clock,
    CheckCircle,
    AlertCircle,
    Search,
    // Filter,
    // Calendar,
    Eye,
    // Edit,
    Send,
    MoreHorizontal,
    Plus,
    ArrowUpRight,
    // ArrowDownRight,
    Target,
    Briefcase
} from 'lucide-react'
import { toast } from 'sonner'

interface ProjectMetrics {
    totalProjects: number
    activeProjects: number
    completedProjects: number
    totalRevenue: number
    monthlyRevenue: number
    pendingQuotes: number
    conversionRate: number
    averageProjectValue: number
}

interface Project {
    id: string
    name: string
    description: string
    status: 'QUOTE_REQUESTED' | 'QUOTE_SENT' | 'QUOTE_APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    totalAmount: number
    paidAmount: number
    customerInfo: {
        name: string
        email: string
        phone?: string
        company?: string
    }
    createdAt: string
    updatedAt: string
    quoteValidUntil?: string
    services: {
        service: {
            name: string
            category: {
                name: string
            }
        }
    }[]
}

interface RecentActivity {
    id: string
    type: 'quote_requested' | 'quote_sent' | 'quote_approved' | 'payment_received' | 'project_completed'
    description: string
    timestamp: string
    projectId: string
    projectName: string
}

export default function ProjectOverview() {
    const [metrics, setMetrics] = useState<ProjectMetrics | null>(null)
    const [projects, setProjects] = useState<Project[]>([])
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    // Quote dialog state
    const [quoteDialogOpen, setQuoteDialogOpen] = useState(false)
    const [quotingProject, setQuotingProject] = useState<Project | null>(null)
    const [quoteForm, setQuoteForm] = useState({
        notes: '',
        validUntilDays: 30
    })

    // Edit dialog state
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingProject, setEditingProject] = useState<Project | null>(null)
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        status: '',
        customerInfo: {
            name: '',
            email: '',
            phone: '',
            company: ''
        }
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)

            // Fetch projects and metrics
            const [projectsResponse, metricsResponse] = await Promise.all([
                fetch('/api/admin/projects'),
                fetch('/api/admin/metrics')
            ])

            if (projectsResponse.ok) {
                const projectsData = await projectsResponse.json()
                setProjects(projectsData.projects)
            }

            if (metricsResponse.ok) {
                const metricsData = await metricsResponse.json()
                setMetrics(metricsData.metrics)
                setRecentActivity(metricsData.recentActivity || [])
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price / 100)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'QUOTE_REQUESTED': return 'bg-yellow-100 text-yellow-800'
            case 'QUOTE_SENT': return 'bg-blue-100 text-blue-800'
            case 'QUOTE_APPROVED': return 'bg-green-100 text-green-800'
            case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800'
            case 'COMPLETED': return 'bg-green-100 text-green-800'
            case 'CANCELLED': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'QUOTE_REQUESTED': return <Clock className="w-4 h-4" />
            case 'QUOTE_SENT': return <FileText className="w-4 h-4" />
            case 'QUOTE_APPROVED': return <CheckCircle className="w-4 h-4" />
            case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4" />
            case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
            case 'CANCELLED': return <AlertCircle className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'quote_requested': return <FileText className="w-4 h-4 text-blue-500" />
            case 'quote_sent': return <Send className="w-4 h-4 text-green-500" />
            case 'quote_approved': return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'payment_received': return <DollarSign className="w-4 h-4 text-green-500" />
            case 'project_completed': return <Target className="w-4 h-4 text-purple-500" />
            default: return <AlertCircle className="w-4 h-4 text-gray-500" />
        }
    }

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || project.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const handleSendQuote = (project: Project) => {
        setQuotingProject(project)
        setQuoteForm({ notes: '', validUntilDays: 30 })
        setQuoteDialogOpen(true)
    }

    const handleSubmitQuote = async () => {
        if (!quotingProject) return

        try {
            const response = await fetch(`/api/admin/projects/${quotingProject.id}/send-quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quoteNotes: quoteForm.notes || undefined,
                    validUntilDays: quoteForm.validUntilDays
                })
            })

            if (response.ok) {
                toast.success('Quote sent successfully!')
                fetchData()
                setQuoteDialogOpen(false)
                setQuotingProject(null)
            } else {
                toast.error('Failed to send quote')
            }
        } catch (error) {
            console.error('Error sending quote:', error)
            toast.error('Failed to send quote')
        }
    }

    const handleUpdateStatus = async (projectId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/admin/projects/${projectId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            if (response.ok) {
                toast.success('Project status updated!')
                fetchData()
            } else {
                toast.error('Failed to update status')
            }
        } catch (error) {
            console.error('Error updating status:', error)
            toast.error('Failed to update status')
        }
    }

    const handleEditProject = (project: Project) => {
        setEditingProject(project)
        setEditForm({
            name: project.name,
            description: project.description,
            status: project.status,
            customerInfo: {
                name: project.customerInfo?.name || '',
                email: project.customerInfo?.email || '',
                phone: project.customerInfo?.phone || '',
                company: project.customerInfo?.company || ''
            }
        })
        setEditDialogOpen(true)
    }

    const handleSubmitEdit = async () => {
        if (!editingProject) return

        try {
            const response = await fetch(`/api/admin/projects/${editingProject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editForm.name,
                    description: editForm.description,
                    status: editForm.status,
                    customerInfo: editForm.customerInfo
                })
            })

            if (response.ok) {
                toast.success('Project updated successfully!')
                fetchData()
                setEditDialogOpen(false)
                setEditingProject(null)
            } else {
                toast.error('Failed to update project')
            }
        } catch (error) {
            console.error('Error updating project:', error)
            toast.error('Failed to update project')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Project Management
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all client projects, quotes, and business operations
                    </p>
                </div>
                <Button onClick={() => window.location.href = '/pricing'}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Test Quote
                </Button>
            </div>

            {/* Key Metrics */}
            {metrics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatPrice(metrics.totalRevenue)}</div>
                            <p className="text-xs text-muted-foreground">
                                <ArrowUpRight className="inline w-3 h-3 text-green-500" />
                                +{metrics.monthlyRevenue > 0 ? Math.round((metrics.monthlyRevenue / metrics.totalRevenue) * 100) : 0}% this month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.activeProjects}</div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.totalProjects} total projects
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{metrics.conversionRate.toFixed(1)}%</div>
                            <p className="text-xs text-muted-foreground">
                                Quote to project conversion
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Avg. Project Value</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatPrice(metrics.averageProjectValue)}</div>
                            <p className="text-xs text-muted-foreground">
                                {metrics.pendingQuotes} pending quotes
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}

            <Tabs defaultValue="projects" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="projects">All Projects</TabsTrigger>
                    <TabsTrigger value="quotes">Pending Quotes</TabsTrigger>
                    <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                </TabsList>

                {/* All Projects Tab */}
                <TabsContent value="projects" className="space-y-4">
                    {/* Search and Filters */}
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Search projects, clients, or emails..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="QUOTE_REQUESTED">Quote Requested</option>
                            <option value="QUOTE_SENT">Quote Sent</option>
                            <option value="QUOTE_APPROVED">Quote Approved</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>

                    {/* Projects List */}
                    <div className="space-y-4">
                        {filteredProjects.map((project) => (
                            <Card key={project.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                    {project.name}
                                                </h3>
                                                <Badge className={getStatusColor(project.status)}>
                                                    {getStatusIcon(project.status)}
                                                    <span className="ml-1">{project.status.replace('_', ' ')}</span>
                                                </Badge>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                <div>
                                                    <strong>Client:</strong> {project.customerInfo.name}
                                                    {project.customerInfo.company && ` (${project.customerInfo.company})`}
                                                </div>
                                                <div>
                                                    <strong>Total:</strong> {formatPrice(project.totalAmount)}
                                                </div>
                                                <div>
                                                    <strong>Created:</strong> {formatDate(project.createdAt)}
                                                </div>
                                            </div>

                                            <div className="mt-3">
                                                <div className="flex flex-wrap gap-2">
                                                    {project.services.slice(0, 3).map((projectService, index) => (
                                                        <Badge key={index} variant="outline" className="text-xs">
                                                            {projectService.service.name}
                                                        </Badge>
                                                    ))}
                                                    {project.services.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{project.services.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                <Eye className="w-4 h-4 mr-1" />
                                                View
                                            </Button>

                                            {project.status === 'QUOTE_REQUESTED' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSendQuote(project)}
                                                >
                                                    <Send className="w-4 h-4 mr-1" />
                                                    Send Quote
                                                </Button>
                                            )}

                                            {project.status === 'QUOTE_APPROVED' && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateStatus(project.id, 'IN_PROGRESS')}
                                                >
                                                    Start Project
                                                </Button>
                                            )}

                                            <Button variant="outline" size="sm">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Pending Quotes Tab */}
                <TabsContent value="quotes" className="space-y-4">
                    <div className="space-y-4">
                        {projects.filter(p => p.status === 'QUOTE_REQUESTED' || p.status === 'QUOTE_SENT').map((project) => (
                            <Card key={project.id}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold">{project.name}</h3>
                                            <p className="text-gray-600">{project.customerInfo.name} • {formatPrice(project.totalAmount)}</p>
                                            <p className="text-sm text-gray-500">Requested {formatDate(project.createdAt)}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setSelectedProject(project)}
                                            >
                                                Review Quote
                                            </Button>
                                            {project.status === 'QUOTE_REQUESTED' && (
                                                <Button size="sm" onClick={() => handleSendQuote(project)}>
                                                    Send Quote
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Recent Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Latest project updates and client interactions</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                                        {getActivityIcon(activity.type)}
                                        <div className="flex-1">
                                            <p className="text-sm">{activity.description}</p>
                                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            View Project
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Project Detail Modal */}
            {selectedProject && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">{selectedProject.name}</h3>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedProject(null)}
                            >
                                Close
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-4">Project Details</h4>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Status:</span>
                                        <Badge className={`ml-2 ${getStatusColor(selectedProject.status)}`}>
                                            {selectedProject.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Client:</span>
                                        <span className="ml-2">{selectedProject.customerInfo.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Email:</span>
                                        <span className="ml-2">{selectedProject.customerInfo.email}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Total Amount:</span>
                                        <span className="ml-2 font-semibold">{formatPrice(selectedProject.totalAmount)}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Paid Amount:</span>
                                        <span className="ml-2 font-semibold">{formatPrice(selectedProject.paidAmount)}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold mb-4">Services</h4>
                                <div className="space-y-2">
                                    {selectedProject.services.map((service, index) => (
                                        <div key={index} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span className="text-sm">{service.service.name}</span>
                                            <div className="text-xs text-gray-500">{service.service.category.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            <Button onClick={() => handleSendQuote(selectedProject)}>
                                Send Quote
                            </Button>
                            <Button variant="outline" onClick={() => handleEditProject(selectedProject)}>
                                Edit Project
                            </Button>
                            <Button variant="outline">
                                View Full Details
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Quote Dialog */}
            <Dialog open={quoteDialogOpen} onOpenChange={setQuoteDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Send Quote</DialogTitle>
                        <DialogDescription>
                            Send a quote to {quotingProject?.customerInfo.name} for project &quot;{quotingProject?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="quote-notes" className="text-sm font-medium">
                                Quote Notes (Optional)
                            </label>
                            <Textarea
                                id="quote-notes"
                                placeholder="Add any special notes or terms for this quote..."
                                value={quoteForm.notes}
                                onChange={(e) => setQuoteForm(prev => ({ ...prev, notes: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="valid-until-days" className="text-sm font-medium">
                                Valid Until (Days)
                            </label>
                            <Input
                                id="valid-until-days"
                                type="number"
                                min="1"
                                max="365"
                                value={quoteForm.validUntilDays}
                                onChange={(e) => setQuoteForm(prev => ({ ...prev, validUntilDays: parseInt(e.target.value) || 30 }))}
                            />
                            <p className="text-xs text-gray-500">
                                Quote will expire in {quoteForm.validUntilDays} days ({new Date(Date.now() + quoteForm.validUntilDays * 24 * 60 * 60 * 1000).toLocaleDateString()})
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setQuoteDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSubmitQuote}
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Send Quote
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Project Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Edit Project</DialogTitle>
                        <DialogDescription>
                            Update project details for &quot;{editingProject?.name}&quot;
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label htmlFor="edit-name" className="text-sm font-medium">
                                Project Name
                            </label>
                            <Input
                                id="edit-name"
                                value={editForm.name}
                                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="edit-description"
                                value={editForm.description}
                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={3}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-status" className="text-sm font-medium">
                                Project Status
                            </label>
                            <Select
                                value={editForm.status}
                                onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-sm font-medium">Customer Information</h4>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="edit-customer-name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <Input
                                        id="edit-customer-name"
                                        value={editForm.customerInfo.name}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            customerInfo: { ...prev.customerInfo, name: e.target.value }
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="edit-customer-email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="edit-customer-email"
                                        type="email"
                                        value={editForm.customerInfo.email}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            customerInfo: { ...prev.customerInfo, email: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="edit-customer-phone" className="text-sm font-medium">
                                        Phone (Optional)
                                    </label>
                                    <Input
                                        id="edit-customer-phone"
                                        type="tel"
                                        value={editForm.customerInfo.phone}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            customerInfo: { ...prev.customerInfo, phone: e.target.value }
                                        }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="edit-customer-company" className="text-sm font-medium">
                                        Company (Optional)
                                    </label>
                                    <Input
                                        id="edit-customer-company"
                                        value={editForm.customerInfo.company}
                                        onChange={(e) => setEditForm(prev => ({
                                            ...prev,
                                            customerInfo: { ...prev.customerInfo, company: e.target.value }
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitEdit} disabled={!editingProject}>
                            Update Project
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
} 