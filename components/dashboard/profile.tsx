import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Calendar, Mail, Phone, Shield } from 'lucide-react'

interface ProfileUser {
    id: string
    clerkId: string
    email: string
    firstName: string | null
    lastName: string | null
    imageUrl: string | null
    phone: string | null
    role: string
    isActive: boolean
    createdAt: Date
    updatedAt: Date
}

interface ProfileProps {
    user: ProfileUser
}

export default function Profile({ user }: ProfileProps) {
    const getRoleColor = (role: string) => {
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

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Your Profile
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt={`${user.firstName} ${user.lastName}`}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-primary" />
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {user.firstName} {user.lastName}
                                </h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className={getRoleColor(user.role)}>
                                        {user.role}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        {user.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Email</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.email}
                                </p>
                            </div>

                            {user.phone && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {user.phone}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Member since</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                                </div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.role}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Account Status
                                </h4>
                                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                    Last Updated
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formatDate(user.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 