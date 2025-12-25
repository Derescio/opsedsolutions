'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Check,
    ChevronRight,
    Star,
    Globe,
    Search,
    TrendingUp,
    Building,
    User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Service, ServiceAddOn, ServiceCategory, ServicesByCategory } from '@/lib/queries/services'

// TypeScript interfaces for quote and breakdown structures
interface SelectedService {
    service: Service
    addOns: ServiceAddOn[]
}

interface ServiceBreakdown {
    service: Service
    price: number
    addOns: Array<{
        addOn: ServiceAddOn
        price: number
    }>
}

interface QuoteBreakdown {
    services: ServiceBreakdown[]
}

interface Quote {
    oneTimeTotal: number
    recurringTotal: number
    breakdown: QuoteBreakdown
}

interface ContactInfo {
    name: string
    email: string
    phone: string
    company: string
    requirements: string
}

interface ServiceSelectorProps {
    services: Service[]
    servicesByCategory: Record<string, ServicesByCategory>
    categories: ServiceCategory[]
}

export default function ServiceSelector({ services, servicesByCategory, categories }: ServiceSelectorProps) {
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
    const [currentStep, setCurrentStep] = useState(1)
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirements: ''
    })
    const [quote, setQuote] = useState<Quote | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

    useEffect(() => {
        calculateQuote()
    }, [selectedServices])

    const calculateQuote = () => {
        if (selectedServices.length === 0) {
            setQuote(null)
            return
        }

        let oneTimeTotal = 0
        let recurringTotal = 0
        const breakdown: QuoteBreakdown = { services: [] }

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

            // Calculate totals based on service and add-on types
            if (service.priceType === 'RECURRING' && service.billingInterval) {
                // Recurring service - base price goes to recurring
                recurringTotal += servicePrice
            } else {
                // One-time or custom service - base price goes to one-time
                oneTimeTotal += servicePrice
            }

            // Process add-ons - categorize by billing interval
            serviceAddOns.forEach(({ addOn, price }) => {
                if (addOn.billingInterval) {
                    // Recurring add-on
                    recurringTotal += price
                } else {
                    // One-time add-on
                    oneTimeTotal += price
                }
            })

            // Total price for display (includes both one-time and recurring components)
            const totalServicePrice = servicePrice + serviceAddOns.reduce((sum, { price }) => sum + price, 0)

            breakdown.services.push({
                service,
                price: totalServicePrice,
                addOns: serviceAddOns
            })
        })

        setQuote({
            oneTimeTotal,
            recurringTotal,
            breakdown
        })
    }

    const selectService = (service: Service) => {
        // Check if service is already selected
        const existingIndex = selectedServices.findIndex(s => s.service.id === service.id)

        if (existingIndex >= 0) {
            // Remove if already selected
            setSelectedServices(selectedServices.filter((_, index) => index !== existingIndex))
        } else {
            // Add new service with no add-ons initially
            setSelectedServices([...selectedServices, {
                service,
                addOns: []
            }])
        }
    }

    const toggleAddOn = (serviceId: string, addOn: ServiceAddOn) => {
        setSelectedServices(selectedServices.map(selected => {
            if (selected.service.id === serviceId) {
                const addOnIndex = selected.addOns.findIndex(a => a.id === addOn.id)
                if (addOnIndex >= 0) {
                    // Remove add-on
                    return {
                        ...selected,
                        addOns: selected.addOns.filter((_, index) => index !== addOnIndex)
                    }
                } else {
                    // Add add-on
                    return {
                        ...selected,
                        addOns: [...selected.addOns, addOn]
                    }
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
        }).format(price / 100)
    }

    const handleSubmitQuote = async () => {
        if (!quote || !contactInfo.name || !contactInfo.email) {
            toast.error('Please fill in all required fields')
            return
        }

        if (submitting) return

        setSubmitting(true)

        try {
            const response = await fetch('/api/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quote,
                    contactInfo,
                    selectedServices
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${data.error || 'Request failed'}`)
            }

            if (data.success) {
                toast.success(data.message || 'Quote request submitted successfully!')
                router.push('/dashboard?tab=projects&success=true')
            } else {
                throw new Error(data.error || 'Failed to submit quote request')
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to submit quote request'
            toast.error(errorMessage)
        } finally {
            setSubmitting(false)
        }
    }

    const getCategoryIcon = (categoryName: string) => {
        if (categoryName.toLowerCase().includes('website')) return <Globe className="w-5 h-5" />
        if (categoryName.toLowerCase().includes('hosting')) return <Building className="w-5 h-5" />
        if (categoryName.toLowerCase().includes('analytics') || categoryName.toLowerCase().includes('data')) return <TrendingUp className="w-5 h-5" />
        return <Search className="w-5 h-5" />
    }

    const isServiceSelected = (serviceId: string) => {
        return selectedServices.some(s => s.service.id === serviceId)
    }

    const isAddOnSelected = (serviceId: string, addOnId: string) => {
        const selected = selectedServices.find(s => s.service.id === serviceId)
        return selected?.addOns.some(a => a.id === addOnId) || false
    }

    const getSelectedService = (serviceId: string) => {
        return selectedServices.find(s => s.service.id === serviceId)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Services
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Select from our available services and customize with add-ons. Get a detailed quote and start your project today.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                1
                            </div>
                            <span className="ml-2 font-medium">Select Services</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                            <span className="ml-2 font-medium">Contact Info</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                                3
                            </div>
                            <span className="ml-2 font-medium">Review & Submit</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Service Selection */}
                {currentStep === 1 && (
                    <div className="space-y-8">
                        {/* Category Tabs */}
                        {categories.length > 1 && (
                            <div className="flex flex-wrap gap-2 justify-center mb-6">
                                <Button
                                    variant={selectedCategory === null ? 'default' : 'outline'}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    All Services
                                </Button>
                                {categories.map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={selectedCategory === category.name ? 'default' : 'outline'}
                                        onClick={() => setSelectedCategory(category.name)}
                                    >
                                        {getCategoryIcon(category.name)}
                                        <span className="ml-2">{category.name}</span>
                                    </Button>
                                ))}
                            </div>
                        )}

                        {/* Services by Category */}
                        {Object.entries(servicesByCategory).map(([categoryName, { category, services: categoryServices }]) => {
                            // Filter by selected category
                            if (selectedCategory !== null && categoryName !== selectedCategory) {
                                return null
                            }

                            return (
                                <div key={categoryName} className="space-y-4">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getCategoryIcon(categoryName)}
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {categoryName}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryServices.map((service) => {
                                            const isSelected = isServiceSelected(service.id)
                                            const selectedService = getSelectedService(service.id)
                                            const features = Array.isArray(service.features) ? service.features as string[] : []

                                            return (
                                                <Card
                                                    key={service.id}
                                                    className={`relative cursor-pointer hover:shadow-lg transition-shadow ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                                >
                                                    {isSelected && (
                                                        <div className="absolute -top-3 right-3">
                                                            <Badge className="bg-blue-500 text-white">Selected</Badge>
                                                        </div>
                                                    )}
                                                    <CardHeader>
                                                        <CardTitle className="text-xl">{service.name}</CardTitle>
                                                        <CardDescription>{service.description}</CardDescription>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="text-center">
                                                            <div className="text-3xl font-bold text-blue-600">
                                                                {formatPrice(service.basePrice)}
                                                            </div>
                                                            {service.priceType === 'RECURRING' && service.billingInterval && (
                                                                <div className="text-sm text-gray-500">
                                                                    per {service.billingInterval}
                                                                </div>
                                                            )}
                                                            {service.priceType === 'ONE_TIME' && (
                                                                <div className="text-sm text-gray-500">
                                                                    one-time
                                                                </div>
                                                            )}
                                                        </div>

                                                        {features.length > 0 && (
                                                            <div className="space-y-2">
                                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                                    Includes:
                                                                </h4>
                                                                {features.slice(0, 5).map((feature, index) => (
                                                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                                                        <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                                        <span>{feature}</span>
                                                                    </div>
                                                                ))}
                                                                {features.length > 5 && (
                                                                    <div className="text-xs text-gray-500">
                                                                        +{features.length - 5} more features
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        <Button
                                                            onClick={() => selectService(service)}
                                                            className="w-full"
                                                            variant={isSelected ? 'default' : 'outline'}
                                                        >
                                                            {isSelected ? 'Deselect' : 'Select Service'}
                                                            <ChevronRight className="w-4 h-4 ml-2" />
                                                        </Button>

                                                        {/* Show Add-ons if service is selected */}
                                                        {isSelected && service.addOns.length > 0 && (
                                                            <div className="mt-4 pt-4 border-t">
                                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                                                                    Available Add-ons:
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {service.addOns.map((addOn) => {
                                                                        const addOnIsSelected = isAddOnSelected(service.id, addOn.id)
                                                                        const addOnPrice = addOn.priceType === 'FIXED'
                                                                            ? (addOn.price || 0)
                                                                            : Math.round(service.basePrice * (addOn.percentage || 0) / 100)

                                                                        return (
                                                                            <div
                                                                                key={addOn.id}
                                                                                className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${addOnIsSelected
                                                                                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                                                                                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                                                                                    }`}
                                                                                onClick={() => toggleAddOn(service.id, addOn)}
                                                                            >
                                                                                <div className="flex-1">
                                                                                    <div className="font-medium text-sm">{addOn.name}</div>
                                                                                    <div className="text-xs text-gray-500">{addOn.description}</div>
                                                                                </div>
                                                                                <div className="text-sm font-semibold">
                                                                                    {addOn.priceType === 'PERCENTAGE'
                                                                                        ? `${addOn.percentage}%`
                                                                                        : formatPrice(addOnPrice)
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Continue Button */}
                        {selectedServices.length > 0 && (
                            <div className="text-center pt-6">
                                <Button
                                    onClick={() => setCurrentStep(2)}
                                    size="lg"
                                >
                                    Continue with {selectedServices.length} {selectedServices.length === 1 ? 'Service' : 'Services'}
                                    <ChevronRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                    <div className="max-w-2xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Tell us about yourself and your project requirements
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Full Name *
                                        </label>
                                        <Input
                                            id="name"
                                            value={contactInfo.name}
                                            onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email Address *
                                        </label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={contactInfo.email}
                                            onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone Number
                                        </label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={contactInfo.phone}
                                            onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                            placeholder="+1 (555) 123-4567"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Company Name
                                        </label>
                                        <Input
                                            id="company"
                                            value={contactInfo.company}
                                            onChange={(e) => setContactInfo({ ...contactInfo, company: e.target.value })}
                                            placeholder="Your Company"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Project Requirements
                                    </label>
                                    <Textarea
                                        id="requirements"
                                        value={contactInfo.requirements}
                                        onChange={(e) => setContactInfo({ ...contactInfo, requirements: e.target.value })}
                                        placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                                        rows={4}
                                    />
                                </div>

                                <div className="flex justify-between pt-4">
                                    <Button
                                        onClick={() => setCurrentStep(1)}
                                        variant="outline"
                                    >
                                        Back to Services
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!contactInfo.name || !contactInfo.email}
                                    >
                                        Review Quote
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && quote && (
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Quote Details */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Search className="w-5 h-5" />
                                        Quote Summary
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {quote.breakdown.services.map(({ service, price, addOns }) => (
                                        <div key={service.id} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{service.name}</span>
                                                <span>{formatPrice(price)}</span>
                                            </div>
                                            {addOns.map(({ addOn, price: addonPrice }) => (
                                                <div key={addOn.id} className="flex justify-between items-center text-sm text-gray-600 ml-4">
                                                    <span>+ {addOn.name}</span>
                                                    <span>{formatPrice(addonPrice)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}

                                    <Separator />

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
                                                {formatPrice(quote.oneTimeTotal + (quote.recurringTotal * 12))}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contact Info */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                                        <p className="text-gray-900 dark:text-white">{contactInfo.name}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-700 dark:text-gray-300">Email:</span>
                                        <p className="text-gray-900 dark:text-white">{contactInfo.email}</p>
                                    </div>
                                    {contactInfo.phone && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                                            <p className="text-gray-900 dark:text-white">{contactInfo.phone}</p>
                                        </div>
                                    )}
                                    {contactInfo.company && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Company:</span>
                                            <p className="text-gray-900 dark:text-white">{contactInfo.company}</p>
                                        </div>
                                    )}
                                    {contactInfo.requirements && (
                                        <div>
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Requirements:</span>
                                            <p className="text-gray-900 dark:text-white">{contactInfo.requirements}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Submit Section */}
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <div className="text-center space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Ready to Get Started?
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Submit your quote request and we&apos;ll get back to you within 24 hours with a detailed proposal.
                                    </p>
                                    <div className="flex justify-center gap-4">
                                        <Button
                                            onClick={() => setCurrentStep(2)}
                                            variant="outline"
                                        >
                                            Edit Information
                                        </Button>
                                        <Button
                                            onClick={handleSubmitQuote}
                                            disabled={submitting}
                                            size="lg"
                                        >
                                            {submitting ? 'Submitting...' : 'Submit Quote Request'}
                                            <ChevronRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    )
}
