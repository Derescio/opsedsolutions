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
                    ((url.searchParams.has('success') || url.searchParams.has('canceled')) &&
                        (url.searchParams.has('project') || url.searchParams.has('subscription')))

                if (isPaymentRedirect) {
                    // Clear the current URL and redirect to the payment success page immediately
                    window.location.href = redirectUrl
                }
            } catch (error) {
                console.error('Error parsing redirect URL:', error)
                // Fallback: try to extract dashboard URL from redirect_url
                if (redirectUrl.includes('/dashboard')) {
                    const dashboardUrl = redirectUrl.split('?')[0] + '?' + redirectUrl.split('?')[1]
                    window.location.href = dashboardUrl
                }
            }
        }

        // Also check for direct payment redirects without redirect_url param
        const currentUrl = window.location.href
        if (userId && currentUrl.includes('/sign-in') && currentUrl.includes('redirect_url')) {
            const redirectParam = new URLSearchParams(window.location.search).get('redirect_url')
            if (redirectParam && (redirectParam.includes('success=true') || redirectParam.includes('canceled=true'))) {
                window.location.href = decodeURIComponent(redirectParam)
            }
        }
    }, [isLoaded, userId, searchParams, router])

    return null // This component doesn't render anything
} 