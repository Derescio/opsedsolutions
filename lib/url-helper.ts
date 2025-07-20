/**
 * Get the base URL for the application
 * Works in development, production, and Vercel deployments
 */
export function getBaseUrl(): string {
  // 1. First priority: Explicit environment variable
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  // 2. Second priority: Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // 3. Fallback: Local development
  return 'http://localhost:3000'
}

/**
 * Generate payment success URL
 */
export function getPaymentSuccessUrl(params: {
  tab?: string
  success?: boolean
  project?: string
  addon?: boolean
  subscription?: boolean
}): string {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  
  if (params.tab) searchParams.set('tab', params.tab)
  if (params.success) searchParams.set('success', 'true')
  if (params.project) searchParams.set('project', params.project)
  if (params.addon) searchParams.set('addon', 'true')
  if (params.subscription) searchParams.set('subscription', 'true')
  
  return `${baseUrl}/dashboard?${searchParams.toString()}`
}

/**
 * Generate payment cancel URL
 */
export function getPaymentCancelUrl(params: {
  tab?: string
  canceled?: boolean
  project?: string
  subscription?: boolean
}): string {
  const baseUrl = getBaseUrl()
  const searchParams = new URLSearchParams()
  
  if (params.tab) searchParams.set('tab', params.tab)
  if (params.canceled) searchParams.set('canceled', 'true')
  if (params.project) searchParams.set('project', params.project)
  if (params.subscription) searchParams.set('subscription', 'true')
  
  return `${baseUrl}/dashboard?${searchParams.toString()}`
} 