'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Users,
    CreditCard,
    Search,
    Calendar,
    DollarSign,
    ExternalLink,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle
} from 'lucide-react'
import {
    getAllSubscriptions,
    getAllPayments,
    updateSubscriptionStatus
} from '@/lib/actions/billing-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Subscription {
    id: string
    stripeSubscriptionId: string
    status: string
    stripePriceId: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
    cancelAtPeriodEnd: boolean
    canceledAt?: Date | null
    createdAt: Date
    user: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
    }
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
    user: {
        id: string
        email: string
        firstName: string | null
        lastName: string | null
    }
}

export default function AdminCustomerBilling() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeTab, setActiveTab] = useState<'subscriptions' | 'payments'>('subscriptions')
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            const [subscriptionsResult, paymentsResult] = await Promise.all([
                getAllSubscriptions(),
                getAllPayments()
            ])

            if (subscriptionsResult.success && subscriptionsResult.subscriptions) {
                setSubscriptions(subscriptionsResult.subscriptions)
            }

            if (paymentsResult.success && paymentsResult.payments) {
                setPayments(paymentsResult.payments)
            }
        } catch (error) {
            console.error('Error loading data:', error)
            toast.error('Failed to load billing data')
        } finally {
            setLoading(false)
        }
    }

    const handleSubscriptionAction = async (subscriptionId: string, action: 'cancel' | 'reactivate') => {
        try {
            setActionLoading(subscriptionId)
            const result = await updateSubscriptionStatus(subscriptionId, action)

            if (result.success) {
                toast.success(result.message)
                loadData() // Refresh data
            } else {
                toast.error(result.error || 'Failed to update subscription')
            }
        } catch (error) {
            console.error('Error updating subscription:', error)
            toast.error('Failed to update subscription')
        } finally {
            setActionLoading(null)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
            case 'succeeded':
                return <Badge variant="default" className="bg-green-100 text-green-800">Succeeded</Badge>
            case 'cancelled':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Cancelled</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            case 'trialing':
                return <Badge variant="outline" className="border-blue-500 text-blue-600"><Clock className="w-3 h-3 mr-1" />Trial</Badge>
            case 'past_due':
                return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Past Due</Badge>
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

    const filteredSubscriptions = subscriptions.filter(sub =>
        sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${sub.user.firstName || ''} ${sub.user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredPayments = payments.filter(payment =>
        payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${payment.user.firstName || ''} ${payment.user.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search by customer name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'subscriptions' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('subscriptions')}
                    >
                        Subscriptions
                    </Button>
                    <Button
                        variant={activeTab === 'payments' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('payments')}
                    >
                        Payments
                    </Button>
                </div>
            </div>

            {/* Subscriptions Tab */}
            {activeTab === 'subscriptions' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Customer Subscriptions
                        </CardTitle>
                        <CardDescription>
                            Manage all customer subscriptions
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredSubscriptions.length > 0 ? (
                            <div className="space-y-4">
                                {filteredSubscriptions.map((subscription) => (
                                    <div key={subscription.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    {subscription.user.firstName} {subscription.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {subscription.user.email}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    Period: {format(new Date(subscription.currentPeriodStart), 'MMM d')} - {format(new Date(subscription.currentPeriodEnd), 'MMM d, yyyy')}
                                                </div>
                                                {subscription.cancelAtPeriodEnd && (
                                                    <div className="flex items-center gap-1 text-sm text-orange-600 dark:text-orange-400 mt-1">
                                                        <AlertCircle className="w-3 h-3" />
                                                        <span>Will cancel at period end</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500">
                                                    Created: {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(subscription.status)}
                                                <div className="flex gap-1">
                                                    {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && (
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            onClick={() => handleSubscriptionAction(subscription.id, 'cancel')}
                                                            disabled={actionLoading === subscription.id}
                                                        >
                                                            Cancel
                                                        </Button>
                                                    )}
                                                    {subscription.cancelAtPeriodEnd && (
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            onClick={() => handleSubscriptionAction(subscription.id, 'reactivate')}
                                                            disabled={actionLoading === subscription.id}
                                                        >
                                                            Reactivate
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Subscriptions Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchTerm ? 'No subscriptions match your search.' : 'No customer subscriptions yet.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Customer Payments
                        </CardTitle>
                        <CardDescription>
                            View all customer payments
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {filteredPayments.length > 0 ? (
                            <div className="space-y-4">
                                {filteredPayments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">
                                                    {payment.user.firstName} {payment.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {payment.user.email}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {payment.description || 'Payment'} • {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {formatAmount(payment.amount, payment.currency)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {payment.type}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(payment.status)}
                                                {payment.receiptUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(payment.receiptUrl!, '_blank')}
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-1" />
                                                        Receipt
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <CreditCard className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No Payments Found
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {searchTerm ? 'No payments match your search.' : 'No customer payments yet.'}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
} 