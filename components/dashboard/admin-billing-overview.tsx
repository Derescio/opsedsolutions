'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    DollarSign,
    TrendingUp,
    Users,
    CreditCard,
    // Calendar,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react'
import { getBillingAnalytics, getRecentActivity } from '@/lib/actions/billing-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface BillingAnalytics {
    subscriptionStats: Array<{
        status: string
        _count: { id: number }
    }>
    paymentStats: Array<{
        status: string
        _count: { id: number }
        _sum: { amount: number | null }
    }>
    revenueByMonth: Record<string, number>
    totalRevenue: number
}

interface RecentActivity {
    payments: Array<{
        id: string
        amount: number
        currency: string
        status: string
        createdAt: Date
        user: {
            firstName: string | null
            lastName: string | null
            email: string
        }
    }>
    subscriptions: Array<{
        id: string
        status: string
        createdAt: Date
        user: {
            firstName: string | null
            lastName: string | null
            email: string
        }
    }>
}

export default function AdminBillingOverview() {
    const [analytics, setAnalytics] = useState<BillingAnalytics | null>(null)
    const [activity, setActivity] = useState<RecentActivity | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)

            const [analyticsResult, activityResult] = await Promise.all([
                getBillingAnalytics(),
                getRecentActivity()
            ])

            if (analyticsResult.success && analyticsResult.analytics) {
                setAnalytics(analyticsResult.analytics)
            }

            if (activityResult.success && activityResult.activity) {
                setActivity(activityResult.activity)
            }
        } catch (error) {
            console.error('Error loading billing data:', error)
            toast.error('Failed to load billing data')
        } finally {
            setLoading(false)
        }
    }

    const formatAmount = (amount: number, currency: string = 'USD') => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount / 100)
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
            case 'succeeded':
                return <Badge variant="default" className="bg-green-100 text-green-800">Succeeded</Badge>
            case 'cancelled':
                return <Badge variant="destructive">Cancelled</Badge>
            case 'failed':
                return <Badge variant="destructive">Failed</Badge>
            case 'trialing':
                return <Badge variant="outline" className="border-blue-500 text-blue-600">Trial</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const getSubscriptionStats = () => {
        if (!analytics) return { total: 0, active: 0, cancelled: 0, trialing: 0 }

        const stats = analytics.subscriptionStats.reduce((acc, stat) => {
            acc.total += stat._count.id
            acc[stat.status.toLowerCase() as keyof typeof acc] = stat._count.id
            return acc
        }, { total: 0, active: 0, cancelled: 0, trialing: 0 })

        return stats
    }

    const getPaymentStats = () => {
        if (!analytics) return { total: 0, succeeded: 0, failed: 0, revenue: 0 }

        const stats = analytics.paymentStats.reduce((acc, stat) => {
            acc.total += stat._count.id
            acc[stat.status.toLowerCase() as keyof typeof acc] = stat._count.id
            if (stat.status.toLowerCase() === 'succeeded') {
                acc.revenue += stat._sum.amount || 0
            }
            return acc
        }, { total: 0, succeeded: 0, failed: 0, revenue: 0 })

        return stats
    }

    const getRevenueGrowth = () => {
        if (!analytics) return 0

        const months = Object.keys(analytics.revenueByMonth).sort()
        if (months.length < 2) return 0

        const currentMonth = analytics.revenueByMonth[months[months.length - 1]]
        const previousMonth = analytics.revenueByMonth[months[months.length - 2]]

        if (!previousMonth) return 0

        return ((currentMonth - previousMonth) / previousMonth) * 100
    }

    const subscriptionStats = getSubscriptionStats()
    const paymentStats = getPaymentStats()
    const revenueGrowth = getRevenueGrowth()

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatAmount(analytics?.totalRevenue || 0)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Revenue
                                </div>
                            </div>
                            <DollarSign className="w-8 h-8 text-green-600" />
                        </div>
                        <div className="flex items-center mt-2">
                            {revenueGrowth > 0 ? (
                                <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                            ) : (
                                <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                            )}
                            <span className={`text-sm ${revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {Math.abs(revenueGrowth).toFixed(1)}%
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                vs last month
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {subscriptionStats.total}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Subscriptions
                                </div>
                            </div>
                            <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {subscriptionStats.active} active, {subscriptionStats.cancelled} cancelled
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {paymentStats.total}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Total Payments
                                </div>
                            </div>
                            <CreditCard className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {paymentStats.succeeded} successful, {paymentStats.failed} failed
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-2xl font-bold">
                                    {formatAmount(paymentStats.revenue)}
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    This Month
                                </div>
                            </div>
                            <TrendingUp className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            From {paymentStats.succeeded} payments
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="w-5 h-5" />
                            Recent Payments
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activity?.payments.length ? (
                            <div className="space-y-4">
                                {activity.payments.slice(0, 5).map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {payment.user.firstName} {payment.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {format(new Date(payment.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="font-medium">
                                                    {formatAmount(payment.amount, payment.currency)}
                                                </div>
                                            </div>
                                            {getStatusBadge(payment.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No recent payments
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Recent Subscriptions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {activity?.subscriptions.length ? (
                            <div className="space-y-4">
                                {activity.subscriptions.slice(0, 5).map((subscription) => (
                                    <div key={subscription.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full">
                                                <Users className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {subscription.user.firstName} {subscription.user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    {format(new Date(subscription.createdAt), 'MMM d, yyyy')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(subscription.status)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No recent subscriptions
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 