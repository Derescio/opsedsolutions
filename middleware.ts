import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define which routes should be protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/admin(.*)',
  '/studio(.*)', // Protect Sanity Studio
  '/tickets(.*)',
  '/profile(.*)',
  '/api/tickets(.*)',
  '/api/users(.*)',
  '/api/webhooks/clerk' // Protect webhook endpoint
])

// Role-based route protection is handled at the page level using database roles
// This ensures consistency with the database role management system

export default clerkMiddleware(async (auth, req) => {
  // Protect routes that require authentication
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
  
  // Note: Role-based authorization is handled at the page level using database roles
  // via requireAdmin(), requireSupport(), etc. functions in /lib/auth.ts
  // This ensures consistency with the database role management system
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
} 