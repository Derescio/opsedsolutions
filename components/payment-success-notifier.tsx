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

        if (success === 'true' && project) {
            if (addon === 'true') {
                toast.success('Add-on payment completed successfully! Your project has been updated.')
            } else {
                toast.success('Payment completed successfully! Thank you for your payment.')
            }
        } else if (canceled === 'true' && project) {
            toast.error('Payment was canceled. You can try again anytime from your project dashboard.')
        }
    }, [searchParams])

    return null // This component doesn't render anything
} 