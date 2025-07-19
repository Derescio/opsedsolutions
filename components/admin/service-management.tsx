'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger
} from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select'
import {
    Plus,
    Edit2,
    Trash2,
    DollarSign,
    Settings,
    Package,
    Users,
    BarChart3,
    Server,
    Globe
} from 'lucide-react'
import { toast } from 'sonner'

interface ServiceCategory {
    id: string
    name: string
    description: string
    isActive: boolean
    sortOrder: number
    _count: {
        services: number
    }
}

interface Service {
    id: string
    name: string
    description: string
    basePrice: number
    priceType: 'ONE_TIME' | 'RECURRING' | 'CUSTOM'
    billingInterval?: string
    features: string[]
    isActive: boolean
    sortOrder: number
    category: {
        id: string
        name: string
    }
    _count: {
        addOns: number
    }
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
    isActive: boolean
    service: {
        id: string
        name: string
    }
}

export default function ServiceManagement() {
    const [activeTab, setActiveTab] = useState('categories')
    const [categories, setCategories] = useState<ServiceCategory[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [addOns, setAddOns] = useState<ServiceAddOn[]>([])
    const [loading, setLoading] = useState(true)

    // Form states
    const [showCategoryForm, setShowCategoryForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [showAddOnForm, setShowAddOnForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<ServiceCategory | null>(null)
    const [editingService, setEditingService] = useState<Service | null>(null)
    const [editingAddOn, setEditingAddOn] = useState<ServiceAddOn | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            // We'll implement these API endpoints next
            const [categoriesRes, servicesRes, addOnsRes] = await Promise.all([
                fetch('/api/admin/service-categories'),
                fetch('/api/admin/services'),
                fetch('/api/admin/service-addons')
            ])

            if (categoriesRes.ok) {
                const categoriesData = await categoriesRes.json()
                setCategories(categoriesData)
            }

            if (servicesRes.ok) {
                const servicesData = await servicesRes.json()
                setServices(servicesData)
            }

            if (addOnsRes.ok) {
                const addOnsData = await addOnsRes.json()
                setAddOns(addOnsData)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load service data')
        } finally {
            setLoading(false)
        }
    }

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(price / 100)
    }

    const getCategoryIcon = (categoryName: string) => {
        if (categoryName.toLowerCase().includes('website')) return <Globe className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('hosting')) return <Server className="w-4 h-4" />
        if (categoryName.toLowerCase().includes('analytics')) return <BarChart3 className="w-4 h-4" />
        return <Package className="w-4 h-4" />
    }

    const getPriceTypeColor = (priceType: string) => {
        switch (priceType) {
            case 'ONE_TIME': return 'bg-green-100 text-green-800'
            case 'RECURRING': return 'bg-blue-100 text-blue-800'
            case 'CUSTOM': return 'bg-purple-100 text-purple-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getAddOnPriceTypeColor = (priceType: string) => {
        switch (priceType) {
            case 'FIXED': return 'bg-green-100 text-green-800'
            case 'PERCENTAGE': return 'bg-orange-100 text-orange-800'
            case 'CUSTOM': return 'bg-purple-100 text-purple-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading service management...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Service Management
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your web agency services, categories, and add-ons
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={() => setShowCategoryForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Category
                    </Button>
                    <Button onClick={() => setShowServiceForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="categories">
                        Categories ({categories.length})
                    </TabsTrigger>
                    <TabsTrigger value="services">
                        Services ({services.length})
                    </TabsTrigger>
                    <TabsTrigger value="addons">
                        Add-ons ({addOns.length})
                    </TabsTrigger>
                </TabsList>

                {/* Categories Tab */}
                <TabsContent value="categories" className="space-y-4">
                    <div className="grid gap-4">
                        {categories.map((category) => (
                            <Card key={category.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        {getCategoryIcon(category.name)}
                                        <CardTitle className="text-lg">{category.name}</CardTitle>
                                        <Badge variant={category.isActive ? "default" : "secondary"}>
                                            {category.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingCategory(category)
                                                setShowCategoryForm(true)
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>Sort Order: {category.sortOrder}</span>
                                        <span>{category._count.services} services</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Services Tab */}
                <TabsContent value="services" className="space-y-4">
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <Card key={service.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <Badge className={getPriceTypeColor(service.priceType)}>
                                            {service.priceType}
                                        </Badge>
                                        <Badge variant={service.isActive ? "default" : "secondary"}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingService(service)
                                                setShowServiceForm(true)
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        {service.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            {formatPrice(service.basePrice)}
                                            {service.billingInterval && `/${service.billingInterval}`}
                                        </span>
                                        <span>Category: {service.category.name}</span>
                                        <span>{service._count.addOns} add-ons</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {service.features.slice(0, 3).map((feature, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {service.features.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{service.features.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Add-ons Tab */}
                <TabsContent value="addons" className="space-y-4">
                    <div className="grid gap-4">
                        {addOns.map((addOn) => (
                            <Card key={addOn.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-lg">{addOn.name}</CardTitle>
                                        <Badge className={getAddOnPriceTypeColor(addOn.priceType)}>
                                            {addOn.priceType}
                                        </Badge>
                                        <Badge variant={addOn.isActive ? "default" : "secondary"}>
                                            {addOn.isActive ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditingAddOn(addOn)
                                                setShowAddOnForm(true)
                                            }}
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                                        {addOn.description}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            {addOn.priceType === 'FIXED' && addOn.price && formatPrice(addOn.price)}
                                            {addOn.priceType === 'PERCENTAGE' && `${addOn.percentage}%`}
                                            {addOn.priceType === 'CUSTOM' && 'Custom'}
                                            {addOn.billingInterval && `/${addOn.billingInterval}`}
                                        </span>
                                        <span>Service: {addOn.service.name}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {addOn.features.slice(0, 3).map((feature, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                                {feature}
                                            </Badge>
                                        ))}
                                        {addOn.features.length > 3 && (
                                            <Badge variant="outline" className="text-xs">
                                                +{addOn.features.length - 3} more
                                            </Badge>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>

            {/* Category Form Dialog */}
            <Dialog open={showCategoryForm} onOpenChange={setShowCategoryForm}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingCategory ? 'Edit Category' : 'Add New Category'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingCategory ? 'Update category details' : 'Create a new service category'}
                        </DialogDescription>
                    </DialogHeader>
                    <CategoryForm
                        category={editingCategory}
                        onClose={() => {
                            setShowCategoryForm(false)
                            setEditingCategory(null)
                        }}
                        onSuccess={() => {
                            fetchData()
                            setShowCategoryForm(false)
                            setEditingCategory(null)
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Service Form Dialog */}
            <Dialog open={showServiceForm} onOpenChange={setShowServiceForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingService ? 'Update service details' : 'Create a new service'}
                        </DialogDescription>
                    </DialogHeader>
                    <ServiceForm
                        service={editingService}
                        categories={categories}
                        onClose={() => {
                            setShowServiceForm(false)
                            setEditingService(null)
                        }}
                        onSuccess={() => {
                            fetchData()
                            setShowServiceForm(false)
                            setEditingService(null)
                        }}
                    />
                </DialogContent>
            </Dialog>

            {/* Add-on Form Dialog */}
            <Dialog open={showAddOnForm} onOpenChange={setShowAddOnForm}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddOn ? 'Edit Add-on' : 'Add New Add-on'}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAddOn ? 'Update add-on details' : 'Create a new service add-on'}
                        </DialogDescription>
                    </DialogHeader>
                    <AddOnForm
                        addOn={editingAddOn}
                        services={services}
                        onClose={() => {
                            setShowAddOnForm(false)
                            setEditingAddOn(null)
                        }}
                        onSuccess={() => {
                            fetchData()
                            setShowAddOnForm(false)
                            setEditingAddOn(null)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}

// Category Form Component
function CategoryForm({
    category,
    onClose,
    onSuccess
}: {
    category: ServiceCategory | null
    onClose: () => void
    onSuccess: () => void
}) {
    const [formData, setFormData] = useState({
        name: category?.name || '',
        description: category?.description || '',
        isActive: category?.isActive ?? true,
        sortOrder: category?.sortOrder || 0
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = category
                ? `/api/admin/service-categories/${category.id}`
                : '/api/admin/service-categories'

            const method = category ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast.success(category ? 'Category updated successfully' : 'Category created successfully')
                onSuccess()
            } else {
                toast.error('Failed to save category')
            }
        } catch (error) {
            console.error('Error saving category:', error)
            toast.error('Failed to save category')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                </label>
                <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Website Development"
                    required
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                </label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this service category"
                    rows={3}
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Sort Order
                    </label>
                    <Input
                        id="sortOrder"
                        type="number"
                        value={formData.sortOrder}
                        onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                        min="0"
                        className="w-24"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Active
                    </label>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : (category ? 'Update' : 'Create')}
                </Button>
            </div>
        </form>
    )
}

// Service Form Component (simplified - you can expand this)
function ServiceForm({
    service,
    categories,
    onClose,
    onSuccess
}: {
    service: Service | null
    categories: ServiceCategory[]
    onClose: () => void
    onSuccess: () => void
}) {
    return (
        <div className="p-4 text-center">
            <p className="text-gray-600">Service form will be implemented next...</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
    )
}

// Add-on Form Component (simplified - you can expand this)
function AddOnForm({
    addOn,
    services,
    onClose,
    onSuccess
}: {
    addOn: ServiceAddOn | null
    services: Service[]
    onClose: () => void
    onSuccess: () => void
}) {
    return (
        <div className="p-4 text-center">
            <p className="text-gray-600">Add-on form will be implemented next...</p>
            <Button onClick={onClose} className="mt-4">Close</Button>
        </div>
    )
} 