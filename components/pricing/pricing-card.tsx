'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/lib/actions/billing-actions'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PricingPlan {
    name: string
    description: string
    price: number
    priceId: string
    interval: string
    icon: React.ReactNode
    features: string[]
    buttonText: string
    popular: boolean
}

interface User {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    role: string
}

interface PricingCardProps {
    plan: PricingPlan
    user: User | null
}

export default function PricingCard({ plan, user }: PricingCardProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubscribe = async () => {
        if (!user) {
            router.push('/sign-in')
            return
        }

        try {
            setLoading(true)
            const result = await createCheckoutSession(plan.priceId)

            if (result.success && result.url) {
                window.location.href = result.url
            } else {
                toast.error(result.error || 'Failed to create checkout session')
            }
        } catch (error) {
            console.error('Error creating checkout session:', error)
            toast.error('Failed to start checkout process')
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price)
    }

    return (
        <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${plan.popular
                ? 'border-2 border-blue-500 shadow-lg transform scale-105'
                : 'border border-gray-200 dark:border-gray-700'
            }`}>
            {/* Popular Badge */}
            {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                    Most Popular
                </div>
            )}

            <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${plan.popular
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                        {plan.icon}
                    </div>
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {plan.name}
                </CardTitle>

                <CardDescription className="text-gray-600 dark:text-gray-400">
                    {plan.description}
                </CardDescription>

                <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                            {formatPrice(plan.price)}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 ml-2">
                            /{plan.interval}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                                <Check className="w-5 h-5 text-green-500" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300 text-sm">
                                {feature}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Action Button */}
                <div className="pt-6">
                    <Button
                        onClick={handleSubscribe}
                        disabled={loading}
                        className={`w-full py-3 text-base font-medium transition-all duration-200 ${plan.popular
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl'
                                : 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200'
                            }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {!user ? 'Sign In to Subscribe' : plan.buttonText}
                            </>
                        )}
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        No setup fee • Cancel anytime • 14-day free trial
                    </p>
                </div>
            </CardContent>
        </Card>
    )
} 