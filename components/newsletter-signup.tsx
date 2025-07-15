'use client'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface NewsletterSignupProps {
    variant?: 'default' | 'compact' | 'footer'
}

export default function NewsletterSignup({ variant = 'default' }: NewsletterSignupProps) {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email) {
            toast.error('Please enter your email address')
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsLoading(true)

        try {
            // Here you would integrate with your newsletter service (Mailchimp, ConvertKit, etc.)
            // For now, we'll simulate the API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Simulate success
            setIsSubscribed(true)
            setEmail('')
            toast.success('Successfully subscribed to our newsletter!')

            // Reset after 3 seconds
            setTimeout(() => setIsSubscribed(false), 3000)

        } catch (error) {
            toast.error('Failed to subscribe. Please try again.' + error)
        } finally {
            setIsLoading(false)
        }
    }

    if (variant === 'compact') {
        return (
            <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] border-0">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <Mail className="w-8 h-8 text-white flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-white mb-1">Stay Updated</h3>
                            <p className="text-white/90 text-sm">Get latest articles in your inbox</p>
                        </div>
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/20 border-white/30 text-white placeholder-white/70 w-48"
                                disabled={isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={isLoading || isSubscribed}
                                className="bg-white text-[#0376aa] hover:bg-white/90"
                            >
                                {isLoading ? 'Subscribing...' : isSubscribed ? <CheckCircle className="w-4 h-4" /> : 'Subscribe'}
                            </Button>
                        </form>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (variant === 'footer') {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                    <Mail className="w-6 h-6 text-[#0376aa]" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Newsletter</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                    Get weekly insights on development, data analytics, and tech trends.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <Input
                        type="email"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        disabled={isLoading || isSubscribed}
                        className="w-full bg-[#0376aa] hover:bg-[#0376aa]/90 text-white"
                    >
                        {isLoading ? 'Subscribing...' : isSubscribed ? 'Subscribed!' : 'Subscribe'}
                    </Button>
                </form>
            </div>
        )
    }

    // Default variant
    return (
        <Card className="bg-gradient-to-br from-[#0376aa] to-[#32cf37] border-0 text-white">
            <CardContent className="p-8">
                <div className="text-center mb-6">
                    <Mail className="w-12 h-12 text-white mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
                    <p className="text-white/90 text-lg">
                        Get the latest insights on full-stack development, data analytics, and emerging technologies delivered to your inbox.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-white/20 border-white/30 text-white placeholder-white/70 focus:bg-white/30"
                            disabled={isLoading}
                        />
                        <Button
                            type="submit"
                            disabled={isLoading || isSubscribed}
                            className="bg-white text-[#0376aa] hover:bg-white/90 px-8"
                        >
                            {isLoading ? (
                                'Subscribing...'
                            ) : isSubscribed ? (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Subscribed!
                                </div>
                            ) : (
                                'Subscribe'
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-white/70 text-sm">
                        No spam, unsubscribe at any time. We respect your privacy.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
} 