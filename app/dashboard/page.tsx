import { getCurrentUser } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PaymentSuccessNotifier from '@/components/payment-success-notifier'
import { Suspense } from 'react'
import {
    User,
    Ticket,
    Users,
    Settings,

    Plus,

    CreditCard,
    FileText,
    DollarSign,
    Briefcase,
    Server
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getTickets } from '@/lib/actions/create-ticket'
import Profile from '@/components/dashboard/profile'
import CreateTicket from '@/components/dashboard/create-ticket'
import TicketList from '@/components/dashboard/ticket-list'
import UserRoleManager from '@/components/admin/user-role-manager'
import ClientBilling from '@/components/dashboard/client-billing'
import ClientInvoices from '@/components/dashboard/client-invoices'
import AdminBillingOverview from '@/components/dashboard/admin-billing-overview'
import AdminCustomerBilling from '@/components/dashboard/admin-customer-billing'
import ClientProjects from '@/components/dashboard/client-projects'
import ProjectOverview from '@/components/admin/project-overview'
import HostingSubscriptions from '@/components/dashboard/hosting-subscriptions'

export default async function DashboardPage() {
    const user = await getCurrentUser()

    if (!user) {
        redirect('/sign-in')
    }

    // Get all users for admin user management
    const allUsers = user.role === 'ADMIN' ? await db.user.findMany({
        select: {
            id: true,
            clerkId: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    }) : []

    // Get user statistics for admin
    const userStats = user.role === 'ADMIN' ? await db.user.groupBy({
        by: ['role'],
        _count: {
            id: true
        }
    }) : []

    // const roleStats = userStats.reduce((acc, stat) => {
    //     acc[stat.role] = stat._count.id
    //     return acc
    // }, {} as Record<string, number>)

    // Get tickets from database using server action
    const ticketResult = await getTickets()
    const tickets = ticketResult.success ? ticketResult.tickets : []

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
            <Suspense>
                <PaymentSuccessNotifier />
            </Suspense>
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
                        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 gap-2">
                            <TabsTrigger value="profile" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Profile
                            </TabsTrigger>

                            {user.role === 'ADMIN' ? (
                                <>
                                    <TabsTrigger value="projects" className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        Projects
                                    </TabsTrigger>
                                    <TabsTrigger value="billing-overview" className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4" />
                                        Billing Overview
                                    </TabsTrigger>
                                    <TabsTrigger value="customer-billing" className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Customer Billing
                                    </TabsTrigger>
                                    <TabsTrigger value="users" className="flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Users
                                    </TabsTrigger>
                                    <TabsTrigger value="tickets" className="flex items-center gap-2">
                                        <Ticket className="w-4 h-4" />
                                        All Tickets
                                    </TabsTrigger>
                                </>
                            ) : (
                                <>
                                    <TabsTrigger value="projects" className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4" />
                                        My Projects
                                    </TabsTrigger>
                                    <TabsTrigger value="hosting" className="flex items-center gap-2">
                                        <Server className="w-4 h-4" />
                                        Hosting
                                    </TabsTrigger>
                                    <TabsTrigger value="billing" className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4" />
                                        Billing
                                    </TabsTrigger>
                                    <TabsTrigger value="invoices" className="flex items-center gap-2">
                                        <FileText className="w-4 h-4" />
                                        Invoices
                                    </TabsTrigger>
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
                                <TabsContent value="projects" className="mt-6">
                                    <ProjectOverview />
                                </TabsContent>

                                <TabsContent value="billing-overview" className="mt-6">
                                    <AdminBillingOverview />
                                </TabsContent>

                                <TabsContent value="customer-billing" className="mt-6">
                                    <AdminCustomerBilling />
                                </TabsContent>

                                <TabsContent value="users" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Users className="w-5 h-5" />
                                                User Management
                                            </CardTitle>
                                            <CardDescription>
                                                Manage user accounts and permissions
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <UserRoleManager users={allUsers} />
                                        </CardContent>
                                    </Card>
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
                            </>
                        )}

                        {/* Client-specific tabs */}
                        {user.role !== 'ADMIN' && (
                            <>
                                <TabsContent value="projects" className="mt-6">
                                    <ClientProjects />
                                </TabsContent>
                                <TabsContent value="hosting" className="mt-6">
                                    <HostingSubscriptions />
                                </TabsContent>
                                <TabsContent value="billing" className="mt-6">
                                    <ClientBilling />
                                </TabsContent>

                                <TabsContent value="invoices" className="mt-6">
                                    <ClientInvoices />
                                </TabsContent>

                                <TabsContent value="my-tickets" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Ticket className="w-5 h-5" />
                                                My Support Tickets
                                            </CardTitle>
                                            <CardDescription>
                                                View and manage your support requests
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <TicketList tickets={tickets.filter(ticket => ticket.createdById === user.id)} isAdmin={false} />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="create-ticket" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Plus className="w-5 h-5" />
                                                Create Support Ticket
                                            </CardTitle>
                                            <CardDescription>
                                                Submit a new support request or report an issue
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <CreateTicket />
                                        </CardContent>
                                    </Card>
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