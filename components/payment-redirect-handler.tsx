'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

export default function PaymentRedirectHandler() {
    const { isLoaded, userId } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        if (!isLoaded) return

        // Check if user just signed in and there's a redirect URL with payment success
        const redirectUrl = searchParams.get('redirect_url')

        if (userId && redirectUrl) {
            try {
                const url = new URL(redirectUrl)
                const isPaymentRedirect = url.pathname === '/dashboard' &&
                    (url.searchParams.has('success') || url.searchParams.has('canceled')) &&
                    url.searchParams.has('project')

                if (isPaymentRedirect) {
                    // Clear the current URL and redirect to the payment success page
                    router.replace(redirectUrl)
                }
            } catch (error) {
                console.error('Error parsing redirect URL:', error)
            }
        }
    }, [isLoaded, userId, searchParams, router])

    return null // This component doesn't render anything
} 