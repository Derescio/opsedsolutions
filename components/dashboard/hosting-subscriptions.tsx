'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
    Server,
    Check,
    X,
    AlertCircle,
    // Calendar,
    // DollarSign,
    Crown,
    Zap,
    Settings,
    // CreditCard,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'
import { toast } from 'sonner'
import {
    createHostingSubscription,
    getUserHostingSubscriptions,
    cancelHostingSubscription,
    updateHostingPlan,
    checkProjectHostingEligibility,
    getEligibleProjectsForHosting
} from '@/lib/actions/subscription-actions'
import { HOSTING_PLANS } from '@/lib/constants/hosting-plans'

interface HostingSubscription {
    id: string
    status: string
    stripePriceId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date | null
    metadata?: Record<string, unknown>
    project?: {
        id: string
        name: string
        status: string
    }
}

interface EligibleProject {
    id: string
    name: string
    totalAmount: number
}

export default function HostingSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<HostingSubscription[]>([])
    const [eligibleProjects, setEligibleProjects] = useState<EligibleProject[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedProject, setSelectedProject] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)

            // Fetch existing subscriptions
            const subscriptionsResult = await getUserHostingSubscriptions()
            if (subscriptionsResult.success) {
                setSubscriptions(subscriptionsResult.subscriptions || [])
            }

            // Fetch projects eligible for hosting subscriptions
            const projectsResult = await getEligibleProjectsForHosting()
            if (projectsResult.success) {
                setEligibleProjects(projectsResult.projects || [])
            } else {
                console.error('Failed to fetch eligible projects:', projectsResult.error)
                setEligibleProjects([])
            }
        } catch (error) {
            console.error('Error fetching hosting data:', error)
            toast.error('Failed to load hosting information')
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

    const formatDate = (dateString: string | Date) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'past_due': return 'bg-red-100 text-red-800'
            case 'cancelled': return 'bg-gray-100 text-gray-800'
            case 'incomplete': return 'bg-yellow-100 text-yellow-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active': return <CheckCircle className="w-4 h-4" />
            case 'past_due': return <AlertCircle className="w-4 h-4" />
            case 'cancelled': return <XCircle className="w-4 h-4" />
            case 'incomplete': return <Clock className="w-4 h-4" />
            default: return <Clock className="w-4 h-4" />
        }
    }

    const getPlanIcon = (planId: string) => {
        switch (planId) {
            case 'basic-hosting': return <Zap className="w-5 h-5 text-blue-500" />
            case 'professional-hosting': return <Server className="w-5 h-5 text-purple-500" />
            case 'enterprise-hosting': return <Crown className="w-5 h-5 text-yellow-500" />
            default: return <Server className="w-5 h-5 text-gray-500" />
        }
    }

    const handleCreateSubscription = async () => {
        if (!selectedProject || !selectedPlan) {
            toast.error('Please select both a project and hosting plan')
            return
        }

        setCreating(true)
        try {
            const result = await createHostingSubscription(selectedProject, selectedPlan)

            if (result.success) {
                toast.success('Redirecting to payment setup...')

                // Redirect to Stripe Checkout for subscription setup
                if (result.url) {
                    window.location.href = result.url
                } else {
                    toast.error('Failed to redirect to payment setup')
                }
            } else {
                toast.error(result.error || 'Failed to create hosting subscription')
            }
        } catch (error) {
            console.error('Error creating subscription:', error)
            toast.error('Failed to create hosting subscription')
        } finally {
            setCreating(false)
        }
    }

    const handleCancelSubscription = async (subscriptionId: string, immediate = false) => {
        try {
            const result = await cancelHostingSubscription(subscriptionId, immediate)

            if (result.success) {
                toast.success(immediate ? 'Subscription cancelled immediately' : 'Subscription will cancel at end of period')
                fetchData()
            } else {
                toast.error(result.error || 'Failed to cancel subscription')
            }
        } catch (error) {
            console.error('Error canceling subscription:', error)
            toast.error('Failed to cancel subscription')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading hosting subscriptions...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Hosting Subscriptions
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage hosting for your completed projects
                </p>
            </div>

            {/* Current Subscriptions */}
            {subscriptions.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Active Hosting Plans
                    </h3>
                    <div className="space-y-4">
                        {subscriptions.map((subscription) => {
                            const planId = (subscription.metadata?.hostingPlanId as string) || 'default'
                            const plan = HOSTING_PLANS.find(p => p.id === planId)

                            return (
                                <Card key={subscription.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-3">
                                                {getPlanIcon(planId)}
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {(subscription.metadata?.hostingPlanName as string) || 'Hosting Plan'}
                                                    </h4>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        For project: {subscription.project?.name}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                        <span>Next billing: {formatDate(subscription.currentPeriodEnd)}</span>
                                                        {plan && <span>• {formatPrice(plan.price)}/month</span>}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Badge className={getStatusColor(subscription.status)}>
                                                    {getStatusIcon(subscription.status)}
                                                    <span className="ml-1">{subscription.status}</span>
                                                </Badge>

                                                <div className="flex gap-2">
                                                    {subscription.status === 'ACTIVE' && !subscription.cancelAtPeriodEnd && (
                                                        <>
                                                            <Button variant="outline" size="sm">
                                                                <Settings className="w-4 h-4 mr-1" />
                                                                Manage
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleCancelSubscription(subscription.id, false)}
                                                            >
                                                                Cancel at Period End
                                                            </Button>
                                                        </>
                                                    )}

                                                    {subscription.cancelAtPeriodEnd && (
                                                        <Badge variant="outline" className="text-orange-600">
                                                            Cancels {formatDate(subscription.currentPeriodEnd)}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {plan && (
                                            <div className="mt-4">
                                                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Plan Features:</h5>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {plan.features.map((feature, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Check className="w-4 h-4 text-green-500" />
                                                            {feature}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Available Hosting Plans */}
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Available Hosting Plans
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {HOSTING_PLANS.map((plan) => (
                        <Card key={plan.id} className={`cursor-pointer transition-all ${selectedPlan === plan.id ? 'ring-2 ring-blue-500' : ''
                            }`}>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    {getPlanIcon(plan.id)}
                                </div>
                                <CardTitle className="text-xl">{plan.name}</CardTitle>
                                <div className="text-3xl font-bold text-blue-600">
                                    {formatPrice(plan.price)}
                                </div>
                                <p className="text-sm text-gray-500">per month</p>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    className="w-full mt-6"
                                    variant={selectedPlan === plan.id ? 'default' : 'outline'}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create New Subscription */}
            {eligibleProjects.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Start Hosting for Completed Project</CardTitle>
                        <CardDescription>
                            Select a completed project and hosting plan to begin hosting services
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Project Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Select Project
                            </label>
                            <select
                                value={selectedProject || ''}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Choose a project...</option>
                                {eligibleProjects.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name} - {formatPrice(project.totalAmount)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Selected Plan Display */}
                        {selectedPlan && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Selected Hosting Plan
                                </label>
                                <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                                    {HOSTING_PLANS.find(p => p.id === selectedPlan)?.name} - {
                                        formatPrice(HOSTING_PLANS.find(p => p.id === selectedPlan)?.price || 0)
                                    }/month
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleCreateSubscription}
                            disabled={!selectedProject || !selectedPlan || creating}
                            className="w-full"
                        >
                            {creating ? 'Creating Subscription...' : 'Start Hosting Subscription'}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* No Subscriptions State */}
            {subscriptions.length === 0 && eligibleProjects.length === 0 && (
                <Card>
                    <CardContent className="text-center py-16">
                        <Server className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            No Hosting Subscriptions
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Complete a project first to start hosting services
                        </p>
                        <Button onClick={() => window.location.href = '/pricing'}>
                            Start New Project
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 