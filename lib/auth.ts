import { auth, currentUser } from '@clerk/nextjs/server'
import { userHelpers, ticketHelpers } from './db'
import { redirect } from 'next/navigation'

// Get current user with database information
export async function getCurrentUser() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }
  
  // Get user from database
  const dbUser = await userHelpers.getUserByClerkId(userId)
  
  if (!dbUser) {
    // If user doesn't exist in database, create them
    const clerkUser = await currentUser()
    if (clerkUser) {
      const userData = {
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName ?? undefined,
        lastName: clerkUser.lastName ?? undefined,
        imageUrl: clerkUser.imageUrl,
        phone: clerkUser.phoneNumbers[0]?.phoneNumber
      }
      
      console.log('Creating new user in database:', userData)
      return await userHelpers.upsertUser(userId, userData)
    }
    return null
  }
  
  return dbUser
}

// Check if user is authenticated
export async function requireAuth() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }
  
  return userId
}

// Check if user has specific role
export async function hasRole(role: 'ADMIN' | 'CLIENT' | 'SUPPORT' | 'MODERATOR') {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  return user.role === role
}

// Check if user is admin
export async function isAdmin() {
  return await hasRole('ADMIN')
}

// Check if user is support staff
export async function isSupport() {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  return user.role === 'ADMIN' || user.role === 'SUPPORT'
}

// Require admin role or redirect
export async function requireAdmin() {
  const user = await getCurrentUser()
  
  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard?error=unauthorized')
  }
  
  return user
}

// Require support role or redirect
export async function requireSupport() {
  const user = await getCurrentUser()
  
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
    redirect('/dashboard?error=unauthorized')
  }
  
  return user
}

// Get user permissions
export async function getUserPermissions() {
  const user = await getCurrentUser()
  
  if (!user) {
    return {
      canViewAllTickets: false,
      canAssignTickets: false,
      canManageUsers: false,
      canAccessAdmin: false,
      canViewReports: false
    }
  }
  
  const basePermissions = {
    canViewAllTickets: false,
    canAssignTickets: false,
    canManageUsers: false,
    canAccessAdmin: false,
    canViewReports: false
  }
  
  switch (user.role) {
    case 'ADMIN':
      return {
        canViewAllTickets: true,
        canAssignTickets: true,
        canManageUsers: true,
        canAccessAdmin: true,
        canViewReports: true
      }
    case 'SUPPORT':
      return {
        ...basePermissions,
        canViewAllTickets: true,
        canAssignTickets: true,
        canViewReports: true
      }
    case 'MODERATOR':
      return {
        ...basePermissions,
        canViewAllTickets: true,
        canAssignTickets: true
      }
    default:
      return basePermissions
  }
}

// Check if user can access ticket
export async function canAccessTicket(ticketId: string) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }
  
  // Admin and support can access all tickets
  if (user.role === 'ADMIN' || user.role === 'SUPPORT') {
    return true
  }
  
  // Users can access their own tickets
  const tickets = await ticketHelpers.getTickets({
    createdById: user.id,
    limit: 1
  })
  
  return tickets.tickets.some((t: any) => t.id === ticketId)
}

// Authentication helpers for client components
export const authHelpers = {
  getCurrentUser,
  requireAuth,
  hasRole,
  isAdmin,
  isSupport,
  requireAdmin,
  requireSupport,
  getUserPermissions,
  canAccessTicket
}

// Types for role-based access
export type UserRole = 'ADMIN' | 'CLIENT' | 'SUPPORT' | 'MODERATOR'

export type UserPermissions = {
  canViewAllTickets: boolean
  canAssignTickets: boolean
  canManageUsers: boolean
  canAccessAdmin: boolean
  canViewReports: boolean
} 