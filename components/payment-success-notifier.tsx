'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

export default function PaymentSuccessNotifier() {
    const searchParams = useSearchParams()

    useEffect(() => {
        const success = searchParams.get('success')
        const canceled = searchParams.get('canceled')
        const project = searchParams.get('project')
        const addon = searchParams.get('addon')
        const subscription = searchParams.get('subscription')

        if (success === 'true') {
            if (subscription === 'true') {
                toast.success('🎉 Hosting subscription activated successfully! Your site is now live.')
            } else if (project && addon === 'true') {
                toast.success('Add-on payment completed successfully! Your project has been updated.')
            } else if (project) {
                toast.success('Payment completed successfully! Thank you for your payment.')
            } else {
                toast.success('Payment completed successfully!')
            }
        } else if (canceled === 'true') {
            if (subscription === 'true') {
                toast.error('Hosting subscription was canceled. You can try again anytime.')
            } else if (project) {
                toast.error('Payment was canceled. You can try again anytime from your project dashboard.')
            } else {
                toast.error('Payment was canceled.')
            }
        }

        // Clear URL parameters after showing notification to prevent repeated toasts
        if (success === 'true' || canceled === 'true') {
            const url = new URL(window.location.href)
            url.searchParams.delete('success')
            url.searchParams.delete('canceled')
            url.searchParams.delete('project')
            url.searchParams.delete('addon')
            url.searchParams.delete('subscription')
            window.history.replaceState({}, '', url.pathname + url.search)
        }
    }, [searchParams])

    return null // This component doesn't render anything
} 