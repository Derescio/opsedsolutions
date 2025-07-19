'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import {
    Check,

    ChevronRight,
    ArrowLeft,
    Star,
    Globe,

    Search,

    TrendingUp,

    Building,

    User
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// TypeScript interfaces for quote and breakdown structures
interface Service {
    id: string
    name: string
    description: string
    basePrice: number
    category?: {
        id: string
        name: string
        icon?: string
    }
}

interface AddOn {
    id: string
    name: string
    description: string
    priceType: 'FIXED' | 'PERCENTAGE'
    price?: number
    percentage?: number
}

interface SelectedService {
    service: Service
    addOns: AddOn[]
}

interface ServiceBreakdown {
    service: Service
    price: number
    addOns: Array<{
        addOn: AddOn
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

const PRESET_PACKAGES = [
    {
        id: 'starter',
        name: 'Starter Package',
        description: 'Perfect for small businesses and personal websites',
        price: { oneTime: 1500, recurring: 20 },
        services: ['website-basic'],
        addOns: [],
        features: [
            'Responsive Website Design',
            'Basic SEO Setup',
            '5 Pages Maximum',
            '1 Month Support',
            'Basic Hosting Included',
            'Contact Forms'
        ],
        popular: false,
        gradient: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'professional',
        name: 'Professional Package',
        description: 'Ideal for growing businesses with advanced needs',
        price: { oneTime: 2800, recurring: 45 },
        services: ['website-professional'],
        addOns: [],
        features: [
            'Advanced Website Design',
            'Complete SEO Optimization',
            '10 Pages Maximum',
            '3 Months Support',
            'Professional Hosting',
            'E-commerce Ready',
            'Analytics Integration',
            'Social Media Integration'
        ],
        popular: true,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        id: 'enterprise',
        name: 'Enterprise Package',
        description: 'Complete solution for large organizations',
        price: { oneTime: 12500, recurring: 150 },
        services: ['website-enterprise'],
        addOns: [],
        features: [
            'Custom Enterprise Solution',
            'Advanced SEO & Marketing',
            'Unlimited Pages',
            '12 Months Premium Support',
            'Enterprise Hosting',
            'Custom Integrations',
            'Advanced Analytics',
            'Priority Support',
            'Custom Features'
        ],
        popular: false,
        gradient: 'from-amber-500 to-orange-500'
    }
]

export default function ServiceSelector() {
    const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
    const [availableServices, setAvailableServices] = useState<Service[]>([])
    const [availableAddOns, setAvailableAddOns] = useState<AddOn[]>([])
    const [currentStep, setCurrentStep] = useState(1)
    const [contactInfo, setContactInfo] = useState<ContactInfo>({
        name: '',
        email: '',
        phone: '',
        company: '',
        requirements: ''
    })
    const [quote, setQuote] = useState<Quote | null>(null)
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const router = useRouter()

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

            if (!response.ok) {
                throw new Error('Failed to fetch services')
            }

            const data = await response.json()

            if (data.success) {
                setAvailableServices(data.services || [])
                setAvailableAddOns(data.addOns || [])
            } else {
                throw new Error(data.error || 'Failed to fetch services')
            }
        } catch (error) {
            console.error('Error fetching services:', error)
            toast.error('Failed to load services. Please refresh the page.')
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
        const recurringTotal = 0
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

            const totalServicePrice = servicePrice + serviceAddOns.reduce((sum, { price }) => sum + price, 0)

            breakdown.services.push({
                service,
                price: totalServicePrice,
                addOns: serviceAddOns
            })

            oneTimeTotal += totalServicePrice
        })

        setQuote({
            oneTimeTotal,
            recurringTotal,
            breakdown
        })
    }

    const selectPackage = (packageId: string) => {
        const pkg = PRESET_PACKAGES.find(p => p.id === packageId)
        if (!pkg) return

        const packageServices: SelectedService[] = []

        // Add main services
        pkg.services.forEach(serviceId => {
            const service = availableServices.find(s => s.id === serviceId)
            if (service) {
                // Don't auto-add add-ons, let user choose
                packageServices.push({
                    service,
                    addOns: [] // Start with no add-ons selected
                })
            }
        })

        setSelectedServices(packageServices)
        setCurrentStep(2) // Move to contact info step
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

        // Prevent double submission
        if (submitting) return

        setSubmitting(true)

        try {
            // In a real application, you would send this data to your backend
            // For demonstration, we'll just show a success message
            toast.success('Quote request submitted successfully!')
            router.push('/dashboard?tab=projects&success=true')
        } catch (error) {
            console.error('Error submitting quote:', error)
            toast.error('Failed to submit quote request')
        } finally {
            setSubmitting(false)
        }
    }

    const getCategoryIcon = (categoryName: string) => {
        if (categoryName.toLowerCase().includes('website')) return <Globe className="w-5 h-5" />
        if (categoryName.toLowerCase().includes('hosting')) return <Building className="w-5 h-5" />
        if (categoryName.toLowerCase().includes('analytics')) return <TrendingUp className="w-5 h-5" />
        return <Search className="w-5 h-5" />
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading services...</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Choose Your Perfect Package
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Select a pre-built package or customize your own solution. Get a detailed quote and start your project today.
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-4">
                        <div className={`flex items-center ${currentStep === 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}>
                                1
                            </div>
                            <span className="ml-2 font-medium">Select Package</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center ${currentStep === 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}>
                                2
                            </div>
                            <span className="ml-2 font-medium">Contact Info</span>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <div className={`flex items-center ${currentStep === 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                }`}>
                                3
                            </div>
                            <span className="ml-2 font-medium">Review & Submit</span>
                        </div>
                    </div>
                </div>

                {/* Step 1: Package Selection */}
                {currentStep === 1 && (
                    <div className="space-y-8">
                        {/* Pre-built Packages */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Pre-Built Packages
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PRESET_PACKAGES.map((pkg) => (
                                    <Card key={pkg.id} className={`relative cursor-pointer hover:shadow-lg transition-shadow ${pkg.popular ? 'ring-2 ring-blue-500' : ''
                                        }`}>
                                        {pkg.popular && (
                                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                                <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                                            </div>
                                        )}
                                        <CardHeader className="text-center">
                                            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${pkg.gradient} mb-4`}>
                                                <Star className="w-6 h-6 text-white" />
                                            </div>
                                            <CardTitle className="text-xl">{pkg.name}</CardTitle>
                                            <CardDescription>{pkg.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="text-center">
                                                <div className="text-3xl font-bold text-blue-600">
                                                    {formatPrice(pkg.price.oneTime)}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    + {formatPrice(pkg.price.recurring)}/month
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                                                    Includes:
                                                </h4>
                                                {pkg.features.map((feature, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-600">
                                                        <Check className="w-4 h-4 text-green-500 mr-2" />
                                                        {feature}
                                                    </div>
                                                ))}
                                                {pkg.addOns.map((addOn, index) => (
                                                    <div key={index} className="flex items-center text-sm text-gray-500">
                                                        <Star className="w-4 h-4 text-orange-400 mr-2" />
                                                        <span className="italic">Recommended: {addOn}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button
                                                onClick={() => selectPackage(pkg.id)}
                                                className="w-full"
                                                variant={pkg.popular ? 'default' : 'outline'}
                                            >
                                                Select {pkg.name}
                                                <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Custom Package Option */}
                        <div className="text-center">
                            <Separator className="my-8" />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                Need Something Custom?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Build your own package with our interactive pricing calculator
                            </p>
                            <Button
                                onClick={() => setCurrentStep(2)} // Move to contact info step
                                variant="outline"
                                size="lg"
                            >
                                <Search className="w-5 h-5 mr-2" />
                                Build Custom Package
                            </Button>
                        </div>
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
                                        onClick={() => setCurrentStep(1)} // Back to package selection
                                        variant="outline"
                                    >
                                        Back to Packages
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentStep(3)} // Move to review step
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
                                    {quote.breakdown.services.map(({ service, price, addOns }: ServiceBreakdown) => (
                                        <div key={service.id} className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{service.name}</span>
                                                <span>{formatPrice(price)}</span>
                                            </div>
                                            {addOns.map(({ addOn, price: addonPrice }: { addOn: AddOn, price: number }) => (
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
                                            onClick={() => setCurrentStep(2)} // Back to contact info step
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

                {/* Custom Package Builder (placeholder) */}
                {currentStep === 2 && (
                    <div className="text-center py-16">
                        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Custom Package Builder
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Advanced pricing calculator will be implemented here
                        </p>
                        <Button onClick={() => setCurrentStep(1)}>
                            Back to Packages
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
} 