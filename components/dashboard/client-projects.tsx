'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    DollarSign,
    Calendar,
    Globe,
    Server,
    BarChart3,
    FileText,
    CreditCard,
    Eye,

    Plus
} from 'lucide-react'
import { toast } from 'sonner'
import { createProjectPayment, createAddOnPayment, approveProject } from '@/lib/actions/project-actions'

interface Project {
    id: string
    name: string
    description: string
    status: 'QUOTE_REQUESTED' | 'QUOTE_SENT' | 'QUOTE_APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
    totalAmount: number
    paidAmount: number
    quoteValidUntil: string
    contractSigned: boolean
    contractDate: string
    createdAt: string
    updatedAt: string
    services: {
        id: string
        customPrice: number
        service: {
            id: string
            name: string
            description: string
            priceType: string
            category: {
                name: string
            }
        }
    }[]
    addOns: {
        id: string
        customPrice: number
        addOn: {
            id: string
            name: string
            description: string
        }
    }[]
    payments: {
        id: string
        amount: number
        status: string
        description: string
        createdAt: string
        receiptUrl: string
    }[]
    subscriptions: {
        id: string
        status: string
        currentPeriodStart: string
        currentPeriodEnd: string
        service: {
            name: string
        }
    }[]
}

interface ServiceAddOn {
    id: string
    name: string
    description: string
    priceType: 'FIXED' | 'PERCENTAGE'
    price?: number
    percentage?: number
}

export default function ClientProjects() {
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)
    const [paymentLoading, setPaymentLoading] = useState(false)

    // Add-on selection state
    const [availableAddOns, setAvailableAddOns] = useState<ServiceAddOn[]>([])
    const [selectedAddOn, setSelectedAddOn] = useState<string>('')
    const [addingAddOn, setAddingAddOn] = useState(false)

    useEffect(() => {
        fetchProjects()
    }, [])

    const fetchProjects = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/quotes')
            if (response.ok) {
                const data = await response.json()
                setProjects(data.projects)
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
            toast.error('Failed to load projects')
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
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
            case 'CANCELLED': return <XCircle className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    const getCategoryIcon = (categoryName: string) => {
        if (categoryName.toLowerCase().includes('website')) return <Globe className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('hosting')) return <Server className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('analytics')) return <BarChart3 className="w-4 h-4" />
        return <FileText className="w-4 h-4" />
    }

    const handleApproveQuote = async (projectId: string) => {
        try {
            const result = await approveProject(projectId)
            if (result.success) {
                toast.success('Quote approved successfully!')
                fetchProjects()
            } else {
                toast.error(result.error || 'Failed to approve quote')
            }
        } catch (error) {
            console.error('Error approving quote:', error)
            toast.error('Failed to approve quote')
        }
    }

    const handleMakePayment = async (projectId: string, paymentType: 'deposit' | 'full' | 'remaining') => {
        try {
            setPaymentLoading(true)
            const result = await createProjectPayment(projectId, paymentType)

            if (result.success && result.url) {
                window.location.href = result.url
            } else {
                toast.error(result.error || 'Failed to create payment')
            }
        } catch (error) {
            console.error('Error creating payment:', error)
            toast.error('Failed to create payment')
        } finally {
            setPaymentLoading(false)
        }
    }

    // Fetch available add-ons for a project
    const fetchAvailableAddOns = async (project: Project) => {
        try {
            // Get services from the project to find compatible add-ons
            const serviceIds = project.services.map(s => s.service.id)
            const response = await fetch(`/api/services/add-ons?serviceIds=${serviceIds.join(',')}`)

            if (response.ok) {
                const data = await response.json()

                // Filter out add-ons already in the project
                const existingAddOnIds = project.addOns.map(a => a.addOn.id)
                const available = data.addOns.filter((addOn: ServiceAddOn) =>
                    !existingAddOnIds.includes(addOn.id)
                )

                setAvailableAddOns(available)
            }
        } catch (error) {
            console.error('Error fetching add-ons:', error)
            toast.error('Failed to load available add-ons')
        }
    }

    // Add selected add-on to project
    const handleAddAddOn = async () => {
        if (!selectedProject || !selectedAddOn) return

        setAddingAddOn(true)

        try {
            const response = await fetch(`/api/projects/${selectedProject.id}/add-ons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    addOnId: selectedAddOn
                })
            })

            if (response.ok) {
                const data = await response.json()

                toast.success('Add-on added successfully! Redirecting to payment...')

                // Redirect to payment for the add-on amount only
                const result = await createAddOnPayment(
                    selectedProject.id,
                    data.addOnPrice,
                    data.addOnName
                )

                if (result.success && result.url) {
                    window.location.href = result.url
                } else {
                    toast.error('Failed to redirect to payment')
                }
            } else {
                const error = await response.json()
                toast.error(error.error || 'Failed to add add-on')
            }
        } catch (error) {
            console.error('Error adding add-on:', error)
            toast.error('Failed to add add-on')
        } finally {
            setAddingAddOn(false)
            setSelectedAddOn('')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading projects...</p>
                </div>
            </div>
        )
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-16">
                <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Projects Yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Get started by requesting a quote for your next project.
                </p>
                <Button onClick={() => window.location.href = '/pricing'}>
                    Request Quote
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        My Projects
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Track your project progress and manage payments
                    </p>
                </div>
                <Button onClick={() => window.location.href = '/pricing'}>
                    New Project
                </Button>
            </div>

            {/* Projects List */}
            <div className="grid gap-6">
                {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{project.name}</CardTitle>
                                    <CardDescription>{project.description}</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Badge className={getStatusColor(project.status)}>
                                        {getStatusIcon(project.status)}
                                        <span className="ml-1">{project.status.replace('_', ' ')}</span>
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Project Details */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                        Total: <span className="font-semibold">{formatPrice(project.totalAmount)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                        Paid: <span className="font-semibold">{formatPrice(project.paidAmount)}</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm">
                                        Created: {formatDate(project.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {/* Services */}
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                    Services Included:
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.services.map((projectService) => (
                                        <Badge key={projectService.id} variant="outline" className="flex items-center gap-1">
                                            {getCategoryIcon(projectService.service.category.name)}
                                            {projectService.service.name}
                                        </Badge>
                                    ))}
                                    {project.addOns.map((projectAddOn) => (
                                        <Badge key={projectAddOn.id} variant="outline" className="flex items-center gap-1">
                                            <BarChart3 className="w-3 h-3" />
                                            {projectAddOn.addOn.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Payment Progress
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {Math.round((project.paidAmount / project.totalAmount) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min((project.paidAmount / project.totalAmount) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>

                            <Separator />

                            {/* Actions */}
                            <div className="flex justify-between items-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedProject(project)
                                        fetchAvailableAddOns(project)
                                    }}
                                >
                                    <Eye className="w-4 h-4 mr-2" />
                                    View Details
                                </Button>

                                <div className="flex gap-2">
                                    {project.status === 'QUOTE_SENT' && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleApproveQuote(project.id)}
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Approve Quote
                                        </Button>
                                    )}

                                    {project.status === 'QUOTE_APPROVED' && project.paidAmount === 0 && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleMakePayment(project.id, 'deposit')}
                                                disabled={paymentLoading}
                                            >
                                                Pay Deposit (50%)
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleMakePayment(project.id, 'full')}
                                                disabled={paymentLoading}
                                            >
                                                Pay Full Amount
                                            </Button>
                                        </div>
                                    )}

                                    {project.status === 'IN_PROGRESS' && project.paidAmount < project.totalAmount && (
                                        <Button
                                            size="sm"
                                            onClick={() => handleMakePayment(project.id, 'remaining')}
                                            disabled={paymentLoading}
                                        >
                                            Pay Remaining
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

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
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project Info */}
                            <div>
                                <h4 className="font-semibold mb-4">Project Information</h4>
                                <div className="space-y-3">
                                    <div>
                                        <span className="text-sm text-gray-500">Status:</span>
                                        <Badge className={`ml-2 ${getStatusColor(selectedProject.status)}`}>
                                            {selectedProject.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Total Amount:</span>
                                        <span className="ml-2 font-semibold">{formatPrice(selectedProject.totalAmount)}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Paid Amount:</span>
                                        <span className="ml-2 font-semibold">{formatPrice(selectedProject.paidAmount)}</span>
                                    </div>
                                    <div>
                                        <span className="text-sm text-gray-500">Created:</span>
                                        <span className="ml-2">{formatDate(selectedProject.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Services Breakdown */}
                            <div>
                                <h4 className="font-semibold mb-4">Services & Add-ons</h4>
                                <div className="space-y-2">
                                    {selectedProject.services.map((service) => (
                                        <div key={service.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span className="text-sm">{service.service.name}</span>
                                            <span className="text-sm font-semibold">{formatPrice(service.customPrice)}</span>
                                        </div>
                                    ))}
                                    {selectedProject.addOns.map((addOn) => (
                                        <div key={addOn.id} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                            <span className="text-sm">+ {addOn.addOn.name}</span>
                                            <span className="text-sm font-semibold">{formatPrice(addOn.customPrice)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Add More Services */}
                        {availableAddOns.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold mb-4 flex items-center">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add More Services
                                </h4>
                                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                    <div className="flex gap-3 items-end">
                                        <div className="flex-1">
                                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                                Choose Add-on Service
                                            </label>
                                            <Select value={selectedAddOn} onValueChange={setSelectedAddOn}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select an add-on service..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableAddOns.map((addOn) => (
                                                        <SelectItem key={addOn.id} value={addOn.id}>
                                                            <div className="flex justify-between items-center w-full">
                                                                <span>{addOn.name}</span>
                                                                <span className="ml-2 font-semibold">
                                                                    {addOn.priceType === 'FIXED'
                                                                        ? formatPrice(addOn.price || 0)
                                                                        : `${addOn.percentage}%`
                                                                    }
                                                                </span>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            onClick={handleAddAddOn}
                                            disabled={!selectedAddOn || addingAddOn}
                                            className="px-6"
                                        >
                                            {addingAddOn ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Adding...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Add & Pay
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                    {selectedAddOn && (
                                        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                                <strong>Note:</strong> Adding this service will update your project total and redirect you to payment.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Payment History */}
                        {selectedProject.payments.length > 0 && (
                            <div className="mt-6">
                                <h4 className="font-semibold mb-4">Payment History</h4>
                                <div className="space-y-2">
                                    {selectedProject.payments.map((payment) => (
                                        <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                                            <div>
                                                <span className="text-sm font-medium">{payment.description}</span>
                                                <div className="text-xs text-gray-500">{formatDate(payment.createdAt)}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-semibold">{formatPrice(payment.amount)}</div>
                                                <Badge variant="outline" className="text-xs">
                                                    {payment.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
} 