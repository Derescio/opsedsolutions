'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Calendar, Settings, Check, X, ChevronDown } from 'lucide-react'
import { toast } from 'sonner'

type UserRole = 'ADMIN' | 'CLIENT' | 'SUPPORT' | 'MODERATOR'

interface User {
    id: string
    clerkId: string
    email: string
    firstName: string | null
    lastName: string | null
    role: UserRole
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface UserRoleManagerProps {
    users: User[]
}

export default function UserRoleManager({ users }: UserRoleManagerProps) {
    const [loading, setLoading] = useState<{ [key: string]: boolean }>({})
    const [userRoles, setUserRoles] = useState<{ [key: string]: UserRole }>(() => {
        const initialRoles: { [key: string]: UserRole } = {}
        users.forEach(user => {
            initialRoles[user.clerkId] = user.role
        })
        return initialRoles
    })

    const getRoleColor = (role: UserRole) => {
        switch (role) {
            case 'ADMIN':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            case 'SUPPORT':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
            case 'MODERATOR':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    const updateUserRole = async (clerkId: string, newRole: UserRole) => {
        setLoading(prev => ({ ...prev, [clerkId]: true }))

        try {
            const response = await fetch('/api/admin/set-user-role', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clerkId,
                    role: newRole
                })
            })

            const data = await response.json()

            if (data.success) {
                setUserRoles(prev => ({ ...prev, [clerkId]: newRole }))
                toast.success(`User role updated to ${newRole}`)
            } else {
                toast.error(data.error || 'Failed to update user role')
            }
        } catch (error) {
            toast.error('Failed to update user role')
        } finally {
            setLoading(prev => ({ ...prev, [clerkId]: false }))
        }
    }

    const roleOptions: UserRole[] = ['CLIENT', 'SUPPORT', 'MODERATOR', 'ADMIN']

    return (
        <div className="space-y-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Total users: {users.length}
            </div>

            <div className="grid gap-4">
                {users.map((user) => (
                    <Card key={user.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {user.firstName} {user.lastName}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Mail className="w-3 h-3" />
                                            {user.email}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge className={getRoleColor(userRoles[user.clerkId])}>
                                        {userRoles[user.clerkId]}
                                    </Badge>

                                    <div className="flex items-center gap-2">
                                        <div className="relative">
                                            <select
                                                value={userRoles[user.clerkId]}
                                                onChange={(e) => updateUserRole(user.clerkId, e.target.value as UserRole)}
                                                disabled={loading[user.clerkId]}
                                                className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 pr-8 text-sm text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                                            >
                                                {roleOptions.map(role => (
                                                    <option key={role} value={role}>
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                <ChevronDown className="w-4 h-4 text-gray-400" />
                                            </div>
                                        </div>

                                        {loading[user.clerkId] && (
                                            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {users.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No users found
                </div>
            )}
        </div>
    )
} 