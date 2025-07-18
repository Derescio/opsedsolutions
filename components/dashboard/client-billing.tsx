'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    CreditCard,
    Calendar,
    DollarSign,
    Download,
    Settings,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'
import {
    getUserSubscription,
    getUserPaymentHistory,
    createBillingPortalSession,
    cancelSubscription
} from '@/lib/actions/billing-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Subscription {
    id: string
    status: string
    stripePriceId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date | null
    trialEnd?: Date | null
}

interface Payment {
    id: string
    amount: number
    currency: string
    status: string
    type: string
    description?: string | null
    receiptUrl?: string | null
    createdAt: Date
}

export default function ClientBilling() {
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        loadBillingData()
    }, [])

    const loadBillingData = async () => {
        try {
            setLoading(true)

            const [subscriptionResult, paymentsResult] = await Promise.all([
                getUserSubscription(),
                getUserPaymentHistory()
            ])

            if (subscriptionResult.success && subscriptionResult.subscription) {
                setSubscription(subscriptionResult.subscription)
            }

            if (paymentsResult.success && paymentsResult.payments) {
                setPayments(paymentsResult.payments)
            }
        } catch (error) {
            console.error('Error loading billing data:', error)
            toast.error('Failed to load billing data')
        } finally {
            setLoading(false)
        }
    }

    const handleManageBilling = async () => {
        try {
            setActionLoading(true)
            const result = await createBillingPortalSession()

            if (result.success && result.url) {
                window.location.href = result.url
            } else {
                toast.error(result.error || 'Failed to open billing portal')
            }
        } catch (error) {
            console.error('Error opening billing portal:', error)
            toast.error('Failed to open billing portal')
        } finally {
            setActionLoading(false)
        }
    }

    const handleCancelSubscription = async () => {
        if (!subscription) return

        try {
            setActionLoading(true)
            const result = await cancelSubscription(subscription.id)

            if (result.success) {
                toast.success(result.message)
                loadBillingData() // Refresh data
            } else {
                toast.error(result.error || 'Failed to cancel subscription')
            }
        } catch (error) {
            console.error('Error canceling subscription:', error)
            toast.error('Failed to cancel subscription')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
            case 'trialing':
                return <Badge variant="outline" className="border-blue-500 text-blue-600"><Clock className="w-3 h-3 mr-1" />Trial</Badge>
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
            case 'past_due':
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Past Due</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getPaymentStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'succeeded':
                return <Badge variant="default" className="bg-green-100 text-green-800">Paid</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            case 'pending':
                return <Badge variant="outline">Pending</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount / 100)
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Subscription Status */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Subscription Status
                    </CardTitle>
                    <CardDescription>
                        Manage your subscription and billing details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {subscription ? (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-semibold">Status:</span>
                                        {getStatusBadge(subscription.status)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                        <span>
                                            Current period: {format(new Date(subscription.currentPeriodStart), 'MMM d, yyyy')} - {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    {subscription.cancelAtPeriodEnd && (
                                        <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 mt-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>Subscription will cancel at the end of the current period</span>
                                        </div>
                                    )}
                                    {subscription.trialEnd && new Date(subscription.trialEnd) > new Date() && (
                                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 mt-2">
                                            <Clock className="w-4 h-4" />
                                            <span>Trial ends: {format(new Date(subscription.trialEnd), 'MMM d, yyyy')}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleManageBilling}
                                        disabled={actionLoading}
                                        variant="outline"
                                        size="sm"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        Manage Billing
                                    </Button>
                                    {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                                        <Button
                                            onClick={handleCancelSubscription}
                                            disabled={actionLoading}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Cancel Subscription
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Active Subscription
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                You don&apos;t have an active subscription. Choose a plan to get started.
                            </p>
                            <Button onClick={() => window.location.href = '/pricing'}>
                                View Pricing Plans
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5" />
                        Payment History
                    </CardTitle>
                    <CardDescription>
                        View your payment history and download receipts
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <DollarSign className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">
                                                {formatAmount(payment.amount, payment.currency)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {payment.description || 'Payment'} • {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getPaymentStatusBadge(payment.status)}
                                        {payment.receiptUrl && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => window.open(payment.receiptUrl!, '_blank')}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Receipt
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Payment History
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your payment history will appear here once you make a payment.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 