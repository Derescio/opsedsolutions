import { db } from '@/lib/db'

// Types matching Prisma schema
export interface ServiceCategory {
  id: string
  name: string
  description: string
  isActive: boolean
  sortOrder: number
}

export interface ServiceAddOn {
  id: string
  name: string
  description: string
  priceType: 'FIXED' | 'PERCENTAGE' | 'CUSTOM'
  price: number | null
  percentage: number | null
  billingInterval: string | null
  features: unknown // JSON field
  isActive: boolean
  sortOrder: number
}

export interface Service {
  id: string
  categoryId: string
  name: string
  description: string
  basePrice: number
  priceType: 'ONE_TIME' | 'RECURRING' | 'CUSTOM'
  billingInterval: string | null
  features: unknown // JSON field
  isActive: boolean
  sortOrder: number
  category: {
    id: string
    name: string
    description: string
  }
  addOns: ServiceAddOn[]
}

export interface ServicesByCategory {
  category: ServiceCategory
  services: Service[]
}

/**
 * Fetch all active services with their categories and add-ons
 * Used for server-side rendering of service pages
 */
export async function getServicesWithCategories(): Promise<{
  services: Service[]
  servicesByCategory: Record<string, ServicesByCategory>
  categories: ServiceCategory[]
}> {
  try {
    const services = await db.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        addOns: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            priceType: true,
            price: true,
            percentage: true,
            billingInterval: true,
            features: true,
            isActive: true,
            sortOrder: true
          }
        }
      }
    })

    // Group services by category for easier rendering
    const servicesByCategory: Record<string, ServicesByCategory> = {}
    const categoriesMap = new Map<string, ServiceCategory>()

    services.forEach((service) => {
      const categoryName = service.category.name
      
      // Store category info
      if (!categoriesMap.has(categoryName)) {
        categoriesMap.set(categoryName, {
          id: service.category.id,
          name: service.category.name,
          description: service.category.description,
          isActive: true,
          sortOrder: 0 // Will be set from category query if needed
        })
      }

      // Group services by category
      if (!servicesByCategory[categoryName]) {
        servicesByCategory[categoryName] = {
          category: categoriesMap.get(categoryName)!,
          services: []
        }
      }
      
      servicesByCategory[categoryName].services.push(service)
    })

    // Get all unique categories
    const categories = Array.from(categoriesMap.values())

    return {
      services,
      servicesByCategory,
      categories
    }
  } catch (error) {
    console.error('Error fetching services with categories:', error)
    throw new Error('Failed to fetch services')
  }
}

/**
 * Fetch a single service by ID with its add-ons
 * Useful for individual service pages (future feature)
 */
export async function getServiceById(serviceId: string): Promise<Service | null> {
  try {
    const service = await db.service.findUnique({
      where: { id: serviceId },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        addOns: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            name: true,
            description: true,
            priceType: true,
            price: true,
            percentage: true,
            billingInterval: true,
            features: true,
            isActive: true,
            sortOrder: true
          }
        }
      }
    })

    return service as Service | null
  } catch (error) {
    console.error('Error fetching service by ID:', error)
    return null
  }
}

/**
 * Fetch all active service categories
 * Useful for navigation or filtering
 */
export async function getCategories(): Promise<ServiceCategory[]> {
  try {
    const categories = await db.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        isActive: true,
        sortOrder: true
      }
    })

    return categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Fetch add-ons for a specific service
 * Useful for dynamic add-on loading
 */
export async function getAddOnsByServiceId(serviceId: string): Promise<ServiceAddOn[]> {
  try {
    const addOns = await db.serviceAddOn.findMany({
      where: {
        serviceId,
        isActive: true
      },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        name: true,
        description: true,
        priceType: true,
        price: true,
        percentage: true,
        billingInterval: true,
        features: true,
        isActive: true,
        sortOrder: true
      }
    })

    return addOns
  } catch (error) {
    console.error('Error fetching add-ons by service ID:', error)
    return []
  }
}

