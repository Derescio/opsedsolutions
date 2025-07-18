'use client'

import { useState, useEffect } from 'react'
import { Zap, Star, Crown, Loader2 } from 'lucide-react'
import PricingCard from './pricing-card'
import { toast } from 'sonner'

interface PricingPlan {
    id: string
    name: string
    description: string
    price: number
    priceId: string
    subscriptionPriceId: string
    features: string[]
    isPopular: boolean
    isActive: boolean
}

interface User {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: string
}

interface PricingPlansProps {
    user: User | null
}

export default function PricingPlans({ user }: PricingPlansProps) {
    const [plans, setPlans] = useState<PricingPlan[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPricingPlans()
    }, [])

    const fetchPricingPlans = async () => {
        try {
            const response = await fetch('/api/pricing')
            const data = await response.json()

            if (data.success) {
                setPlans(data.plans)
            } else {
                toast.error('Failed to load pricing plans')
            }
        } catch (error) {
            console.error('Error fetching pricing plans:', error)
            toast.error('Failed to load pricing plans')
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (planName: string) => {
        if (planName.toLowerCase().includes('basic')) {
            return <Zap className="w-6 h-6" />
        } else if (planName.toLowerCase().includes('premium')) {
            return <Star className="w-6 h-6" />
        } else if (planName.toLowerCase().includes('enterprise')) {
            return <Crown className="w-6 h-6" />
        } else {
            return <Zap className="w-6 h-6" />
        }
    }

    const getButtonText = (planName: string, isPopular: boolean) => {
        if (isPopular) return 'Most Popular'
        if (planName.toLowerCase().includes('basic')) return 'Get Started'
        if (planName.toLowerCase().includes('enterprise')) return 'Go Enterprise'
        return 'Choose Plan'
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        )
    }

    if (plans.length === 0) {
        return (
            <div className="text-center py-16">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No pricing plans available
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Please check back later or contact support.
                </p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
                <PricingCard
                    key={plan.id}
                    plan={{
                        name: plan.name,
                        description: plan.description,
                        price: plan.price,
                        priceId: plan.subscriptionPriceId, // Use subscription price ID for subscriptions
                        interval: 'month',
                        icon: getIcon(plan.name),
                        features: Array.isArray(plan.features) ? plan.features : [],
                        buttonText: getButtonText(plan.name, plan.isPopular),
                        popular: plan.isPopular
                    }}
                    user={user}
                />
            ))}
        </div>
    )
} 