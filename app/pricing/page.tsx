import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getCurrentUser } from '@/lib/auth'
import PricingPlans from '@/components/pricing/pricing-plans'

export default async function PricingPage() {
    const user = await getCurrentUser()

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Choose Your Perfect Plan
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Select the plan that best fits your needs. All plans include our core features
                            with varying levels of support and customization.
                        </p>
                    </div>

                    {/* Pricing Toggle */}
                    <div className="flex justify-center mb-12">
                        <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <div className="flex">
                                <button className="px-4 py-2 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm font-medium">
                                    Monthly
                                </button>
                                <button className="px-4 py-2 rounded-md text-gray-600 dark:text-gray-400 font-medium">
                                    Annual
                                    <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                        Save 20%
                                    </Badge>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Cards */}
                    <div className="mb-16">
                        <PricingPlans user={user} />
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">What&apos;s included in all plans?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        All plans include modern, responsive web development, secure hosting recommendations,
                                        basic SEO setup, and email support. The main differences are in the level of customization,
                                        support response time, and additional features.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Can I upgrade or downgrade my plan?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated
                                        and reflected in your next billing cycle. Contact support for assistance with plan changes.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We accept all major credit cards, PayPal, and bank transfers. All payments are processed
                                        securely through Stripe, and you can manage your payment methods in your dashboard.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Is there a free trial available?</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        We offer a 14-day free trial for all plans. You can cancel anytime during the trial
                                        period without being charged. No credit card required to start your trial.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="text-center mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Ready to get started?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Join thousands of satisfied customers who trust us with their web development needs.
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                                Start Free Trial
                            </Button>
                            <Button size="lg" variant="outline">
                                Contact Sales
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 