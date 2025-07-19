'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    FileText,
    Download,

    ExternalLink,
    CheckCircle,
    XCircle,
    Clock
} from 'lucide-react'
import { getUserInvoices } from '@/lib/actions/billing-actions'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface Invoice {
    id: string
    number: string
    status: string
    subtotal: number
    tax: number
    total: number
    currency: string
    description?: string | null
    invoiceDate: Date
    dueDate?: Date | null
    paidAt?: Date | null
    invoiceUrl?: string | null
    pdfUrl?: string | null
    subscription?: {
        id: string
        status: string
    } | null
}

export default function ClientInvoices() {
    const [invoices, setInvoices] = useState<Invoice[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadInvoices()
    }, [])

    const loadInvoices = async () => {
        try {
            setLoading(true)
            const result = await getUserInvoices()

            if (result.success && result.invoices) {
                setInvoices(result.invoices)
            }
        } catch (error) {
            console.error('Error loading invoices:', error)
            toast.error('Failed to load invoices')
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Paid</Badge>
            case 'open':
                return <Badge variant="outline" className="border-orange-500 text-orange-600"><Clock className="w-3 h-3 mr-1" />Due</Badge>
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>
            case 'void':
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Void</Badge>
            case 'uncollectible':
                return <Badge variant="destructive">Uncollectible</Badge>
            default:
                return <Badge variant="secondary">{status}</Badge>
        }
    }

    const formatAmount = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase()
        }).format(amount / 100)
    }

    const isOverdue = (invoice: Invoice) => {
        return invoice.status === 'open' && invoice.dueDate && new Date(invoice.dueDate) < new Date()
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Invoices
                    </CardTitle>
                    <CardDescription>
                        View and download your invoices
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {invoices.length > 0 ? (
                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full">
                                            <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-semibold">
                                                Invoice #{invoice.number}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {format(new Date(invoice.invoiceDate), 'MMM d, yyyy')}
                                                {invoice.dueDate && (
                                                    <span className={`ml-2 ${isOverdue(invoice) ? 'text-red-600' : ''}`}>
                                                        • Due: {format(new Date(invoice.dueDate), 'MMM d, yyyy')}
                                                    </span>
                                                )}
                                            </div>
                                            {invoice.description && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {invoice.description}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-semibold">
                                                {formatAmount(invoice.total, invoice.currency)}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {invoice.tax > 0 && `Tax: ${formatAmount(invoice.tax, invoice.currency)}`}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {getStatusBadge(invoice.status)}
                                            <div className="flex gap-1">
                                                {invoice.invoiceUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(invoice.invoiceUrl!, '_blank')}
                                                    >
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                )}
                                                {invoice.pdfUrl && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => window.open(invoice.pdfUrl!, '_blank')}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        PDF
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                No Invoices Yet
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Your invoices will appear here once you make a purchase.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 