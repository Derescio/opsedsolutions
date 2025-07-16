import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    User,
    Ticket,
    Users,
    Settings,
    BarChart3,
    Plus,
    Shield
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getTickets } from '@/lib/actions/create-ticket'
import Profile from '@/components/dashboard/profile'
import CreateTicket from '@/components/dashboard/create-ticket'
import TicketList from '@/components/dashboard/ticket-list'
import UserRoleManager from '@/components/admin/user-role-manager'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Get all users for admin user management
    const users = user.role === 'ADMIN' ? await db.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            clerkId: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
        }
    }) : []

    // Get user statistics for admin
    const userStats = user.role === 'ADMIN' ? await db.user.groupBy({
        by: ['role'],
        _count: {
            id: true
        }
    }) : []

    const roleStats = userStats.reduce((acc, stat) => {
        acc[stat.role] = stat._count.id
        return acc
    }, {} as Record<string, number>)

    // Get tickets from database using server action
    const ticketResult = await getTickets()
    const tickets = ticketResult.success ? ticketResult.tickets : []

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Welcome back, {user.firstName}!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your account and access your resources
                        </p>
                    </div>

                    {/* Role-based Dashboard Tabs */}
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>

                            {user.role === 'ADMIN' ? (
                                <>
                                    <TabsTrigger value="users" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Users
                                    </TabsTrigger>
                                    <TabsTrigger value="tickets" className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        All Tickets
                                    </TabsTrigger>
                                    <TabsTrigger value="reports" className="flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4" />
                                        Reports
                                    </TabsTrigger>
                                    <TabsTrigger value="settings" className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </TabsTrigger>
                                </>
                            ) : (
                                <>
                                    <TabsTrigger value="my-tickets" className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        My Tickets
                                    </TabsTrigger>
                                    <TabsTrigger value="create-ticket" className="flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        Create Ticket
                                    </TabsTrigger>
                                    <TabsTrigger value="account" className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        Account
                                    </TabsTrigger>
                                </>
                            )}
                        </TabsList>

                        {/* Profile Tab */}
                        <TabsContent value="profile" className="mt-6">
                            <Profile user={user} />
                        </TabsContent>

                        {/* Admin-specific tabs */}
                        {user.role === 'ADMIN' && (
                            <>
                                <TabsContent value="users" className="mt-6">
                                    <div className="space-y-6">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2">
                                                    <Shield className="w-5 h-5" />
                                                    User Management
                                                </CardTitle>
                                                <CardDescription>
                                                    Manage user roles and permissions
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                                                    <Card>
                                                        <CardContent className="p-4">
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {users.length}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Total Users
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card>
                                                        <CardContent className="p-4">
                                                            <div className="text-2xl font-bold text-red-600">
                                                                {roleStats.ADMIN || 0}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Admins
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card>
                                                        <CardContent className="p-4">
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {roleStats.SUPPORT || 0}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Support
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card>
                                                        <CardContent className="p-4">
                                                            <div className="text-2xl font-bold text-gray-600">
                                                                {roleStats.CLIENT || 0}
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Clients
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                                <UserRoleManager users={users} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </TabsContent>

                                <TabsContent value="tickets" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Ticket className="w-5 h-5" />
                                                All Tickets
                                            </CardTitle>
                                            <CardDescription>
                                                Manage all support tickets across the system
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TicketList tickets={tickets} isAdmin={true} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="reports" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <BarChart3 className="w-5 h-5" />
                                                Reports & Analytics
                                            </CardTitle>
                                            <CardDescription>
                                                System reports and analytics
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-12">
                                                <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Reports Coming Soon
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Advanced reporting and analytics features will be available soon.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="settings" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="w-5 h-5" />
                                                System Settings
                                            </CardTitle>
                                            <CardDescription>
                                                Manage system-wide settings
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-12">
                                                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Settings Coming Soon
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    System settings and configuration options will be available soon.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </>
                        )}

                        {/* Regular user tabs */}
                        {user.role !== 'ADMIN' && (
                            <>
                                <TabsContent value="my-tickets" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Ticket className="w-5 h-5" />
                                                My Tickets
                                            </CardTitle>
                                            <CardDescription>
                                                View and manage your support tickets
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TicketList tickets={tickets} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="create-ticket" className="mt-6">
                                    <CreateTicket />
                                </TabsContent>

                                <TabsContent value="account" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Settings className="w-5 h-5" />
                                                Account Settings
                                            </CardTitle>
                                            <CardDescription>
                                                Manage your account preferences
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-12">
                                                <Settings className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                    Account Settings Coming Soon
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    Account settings and preferences will be available soon.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </>
                        )}
                    </Tabs>
                </div>
            </div>
        </div>
    )
} 