'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
    Calculator,

    Check,
    Plus,
    Minus,
    Globe,
    Server,
    BarChart3,

} from 'lucide-react'
import { toast } from 'sonner'

interface Service {
    id: string
    name: string
    description: string
    basePrice: number
    priceType: 'ONE_TIME' | 'RECURRING' | 'CUSTOM'
    billingInterval?: string
    features: string[]
    category: {
        id: string
        name: string
    }
    addOns: ServiceAddOn[]
}

interface ServiceAddOn {
    id: string
    name: string
    description: string
    priceType: 'FIXED' | 'PERCENTAGE' | 'CUSTOM'
    price?: number
    percentage?: number
    billingInterval?: string
    features: string[]
}

interface SelectedService {
    service: Service
    addOns: ServiceAddOn[]
}

interface QuoteCalculation {
    oneTimeTotal: number
    recurringTotal: number
    yearlyTotal: number
    breakdown: {
        services: {
            service: Service
            price: number
            addOns: {
                addOn: ServiceAddOn
                price: number
            }[]
        }[]
    }
}

export default function PricingCalculator() {
    const [services, setServices] = useState<Service[]>([])
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
    const [quote, setQuote] = useState<QuoteCalculation | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeCategory, setActiveCategory] = useState<string>('')

    // Quote form
    const [showQuoteForm, setShowQuoteForm] = useState(false)
    const [quoteForm, setQuoteForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirements: ''
    })

    useEffect(() => {
        fetchServices()
    }, [])

    useEffect(() => {
        calculateQuote()
    }, [selectedServices])

    const fetchServices = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/services')
            if (response.ok) {
                const data = await response.json()
                setServices(data)
                if (data.length > 0) {
                    setActiveCategory(data[0].category.name)
                }
            }
        } catch (error) {
            console.error('Error fetching services:', error)
            toast.error('Failed to load services')
        } finally {
            setLoading(false)
        }
    }

    const calculateQuote = () => {
        if (selectedServices.length === 0) {
            setQuote(null)
            return
        }

        let oneTimeTotal = 0
        let recurringTotal = 0
        const breakdown = { services: [] as any[] }

        selectedServices.forEach(({ service, addOns }) => {
            const servicePrice = service.basePrice
            const serviceAddOns = addOns.map(addOn => {
                let addOnPrice = 0

                if (addOn.priceType === 'FIXED') {
                    addOnPrice = addOn.price || 0
                } else if (addOn.priceType === 'PERCENTAGE') {
                    addOnPrice = Math.round(servicePrice * (addOn.percentage || 0) / 100)
                }

                return {
                    addOn,
                    price: addOnPrice
                }
            })

            const totalAddOnPrice = serviceAddOns.reduce((sum, { price }) => sum + price, 0)
            const totalServicePrice = servicePrice + totalAddOnPrice

            if (service.priceType === 'ONE_TIME') {
                oneTimeTotal += totalServicePrice
            } else if (service.priceType === 'RECURRING') {
                recurringTotal += totalServicePrice
            }

            breakdown.services.push({
                service,
                price: servicePrice,
                addOns: serviceAddOns
            })
        })

        setQuote({
            oneTimeTotal,
            recurringTotal,
            yearlyTotal: oneTimeTotal + (recurringTotal * 12),
            breakdown
        })
    }

    const addService = (service: Service) => {
        const isAlreadySelected = selectedServices.some(s => s.service.id === service.id)
        if (isAlreadySelected) return

        setSelectedServices([...selectedServices, { service, addOns: [] }])
    }

    const removeService = (serviceId: string) => {
        setSelectedServices(selectedServices.filter(s => s.service.id !== serviceId))
    }

    const toggleAddOn = (serviceId: string, addOn: ServiceAddOn) => {
        setSelectedServices(selectedServices.map(selected => {
            if (selected.service.id === serviceId) {
                const isAddOnSelected = selected.addOns.some(a => a.id === addOn.id)
                return {
                    ...selected,
                    addOns: isAddOnSelected
                        ? selected.addOns.filter(a => a.id !== addOn.id)
                        : [...selected.addOns, addOn]
                }
            }
            return selected
        }))
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price / 100) // Prices stored in cents in database
    }

    const getCategoryIcon = (categoryName: string) => {
        if (categoryName.toLowerCase().includes('website')) return <Globe className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('hosting')) return <Server className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('analytics')) return <BarChart3 className="w-4 h-4" />
        return <Calculator className="w-4 h-4" />
    }

    const categories = [...new Set(services.map(s => s.category.name))]

    const handleQuoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!quote) return

        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...quoteForm,
                    services: selectedServices.map(s => ({
                        serviceId: s.service.id,
                        addOnIds: s.addOns.map(a => a.id)
                    })),
                    quote
                }),
            })

            if (response.ok) {
                toast.success('Quote request submitted successfully!')
                setShowQuoteForm(false)
                setQuoteForm({ name: '', email: '', phone: '', company: '', requirements: '' })
            } else {
                toast.error('Failed to submit quote request')
            }
        } catch (error) {
            console.error('Error submitting quote:', error)
            toast.error('Failed to submit quote request')
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading pricing calculator...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pricing Calculator
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Build your custom package by selecting services and add-ons. Get an instant quote for your project.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Services Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {categories.map(category => (
                                <Button
                                    key={category}
                                    variant={activeCategory === category ? 'default' : 'outline'}
                                    onClick={() => setActiveCategory(category)}
                                    className="flex items-center gap-2"
                                >
                                    {getCategoryIcon(category)}
                                    {category}
                                </Button>
                            ))}
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            {services
                                .filter(service => service.category.name === activeCategory)
                                .map(service => {
                                    const isSelected = selectedServices.some(s => s.service.id === service.id)
                                    const selectedService = selectedServices.find(s => s.service.id === service.id)

                                    return (
                                        <Card key={service.id} className={`transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
                                            <CardHeader>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="flex items-center gap-2">
                                                            {service.name}
                                                            {service.priceType === 'CUSTOM' && (
                                                                <Badge variant="outline">Custom Quote</Badge>
                                                            )}
                                                        </CardTitle>
                                                        <CardDescription>{service.description}</CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-2xl font-bold text-blue-600">
                                                            {service.priceType === 'CUSTOM' ? 'Custom' : formatPrice(service.basePrice)}
                                                        </div>
                                                        {service.billingInterval && (
                                                            <div className="text-sm text-gray-500">
                                                                per {service.billingInterval}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {/* Features */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                        {service.features.map((feature, index) => (
                                                            <div key={index} className="flex items-center gap-2">
                                                                <Check className="w-4 h-4 text-green-500" />
                                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {feature}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Add-ons */}
                                                    {service.addOns.length > 0 && isSelected && (
                                                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                            <h4 className="font-semibold mb-3">Available Add-ons:</h4>
                                                            <div className="space-y-2">
                                                                {service.addOns.map(addOn => {
                                                                    const isAddOnSelected = selectedService?.addOns.some(a => a.id === addOn.id)
                                                                    return (
                                                                        <div key={addOn.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded">
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    checked={isAddOnSelected}
                                                                                    onChange={() => toggleAddOn(service.id, addOn)}
                                                                                    className="rounded"
                                                                                />
                                                                                <div>
                                                                                    <span className="font-medium">{addOn.name}</span>
                                                                                    <p className="text-xs text-gray-500">{addOn.description}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <span className="font-semibold">
                                                                                    {addOn.priceType === 'FIXED' && addOn.price && formatPrice(addOn.price)}
                                                                                    {addOn.priceType === 'PERCENTAGE' && `${addOn.percentage}%`}
                                                                                </span>
                                                                                {addOn.billingInterval && (
                                                                                    <div className="text-xs text-gray-500">
                                                                                        per {addOn.billingInterval}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Action Button */}
                                                    <div className="flex justify-end">
                                                        {isSelected ? (
                                                            <Button
                                                                variant="outline"
                                                                onClick={() => removeService(service.id)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Minus className="w-4 h-4" />
                                                                Remove
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                onClick={() => addService(service)}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Add to Quote
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })}
                        </div>
                    </div>

                    {/* Quote Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Calculator className="w-5 h-5" />
                                        Quote Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {quote ? (
                                        <div className="space-y-6">
                                            {/* Quote Breakdown */}
                                            <div className="space-y-4">
                                                {quote.breakdown.services.map(({ service, price, addOns }) => (
                                                    <div key={service.id} className="space-y-2">
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium">{service.name}</span>
                                                            <span>{formatPrice(price)}</span>
                                                        </div>
                                                        {addOns.map(({ addOn, price }) => (
                                                            <div key={addOn.id} className="flex justify-between items-center text-sm text-gray-600 ml-4">
                                                                <span>+ {addOn.name}</span>
                                                                <span>{formatPrice(price)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ))}
                                            </div>

                                            <Separator />

                                            {/* Totals */}
                                            <div className="space-y-2">
                                                {quote.oneTimeTotal > 0 && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">One-time Total:</span>
                                                        <span className="font-bold text-green-600">
                                                            {formatPrice(quote.oneTimeTotal)}
                                                        </span>
                                                    </div>
                                                )}
                                                {quote.recurringTotal > 0 && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-medium">Monthly Total:</span>
                                                        <span className="font-bold text-blue-600">
                                                            {formatPrice(quote.recurringTotal)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-lg">
                                                    <span className="font-bold">Total (First Year):</span>
                                                    <span className="font-bold text-purple-600">
                                                        {formatPrice(quote.yearlyTotal)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Request Quote Button */}
                                            <Button
                                                onClick={() => setShowQuoteForm(true)}
                                                className="w-full"
                                                size="lg"
                                            >
                                                Request Detailed Quote
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <Calculator className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>Select services to see your quote</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* Quote Form Modal */}
                {showQuoteForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">Request Detailed Quote</h3>
                            <form onSubmit={handleQuoteSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                                        Full Name *
                                    </label>
                                    <Input
                                        id="name"
                                        value={quoteForm.name}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                                        Email *
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={quoteForm.email}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                                        Phone
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={quoteForm.phone}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="company" className="block text-sm font-medium mb-1">
                                        Company
                                    </label>
                                    <Input
                                        id="company"
                                        value={quoteForm.company}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, company: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium mb-1">
                                        Additional Requirements
                                    </label>
                                    <Textarea
                                        id="requirements"
                                        value={quoteForm.requirements}
                                        onChange={(e) => setQuoteForm({ ...quoteForm, requirements: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setShowQuoteForm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Submit Request</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
} 