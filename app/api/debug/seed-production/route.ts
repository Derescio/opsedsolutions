import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@clerk/nextjs/server'

export async function POST() {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return NextResponse.json({ 
        success: false,
        error: 'Authentication required' 
      }, { status: 401 })
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { clerkId: userId }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ 
        success: false,
        error: 'Admin access required' 
      }, { status: 403 })
    }

    console.log('🌱 Starting production database seeding...')

    // Check if services already exist
    const existingServices = await db.service.count()
    if (existingServices > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already seeded with ${existingServices} services`,
        services: existingServices
      })
    }

    // Create Service Categories
    console.log('📂 Creating service categories...')
    const websiteCategory = await db.serviceCategory.create({
      data: {
        name: "Website Development",
        description: "Professional website development services",
        sortOrder: 1,
      },
    })

    const hostingCategory = await db.serviceCategory.create({
      data: {
        name: "Hosting Services", 
        description: "Web hosting and maintenance services",
        sortOrder: 2,
      },
    })

    const analyticsCategory = await db.serviceCategory.create({
      data: {
        name: "Data Analytics",
        description: "Data analysis and business intelligence services", 
        sortOrder: 3,
      },
    })

    // Create Website Development Services
    console.log('🌐 Creating website development services...')
    const smallWebsite = await db.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Small Website",
        description: "Perfect for small businesses and personal projects",
        basePrice: 150000, // $1,500 in cents
        priceType: "ONE_TIME",
        features: [
          "Up to 5 pages",
          "Responsive design", 
          "Basic SEO setup",
          "Contact form",
          "3 rounds of revisions",
          "Mobile optimization",
          "SSL certificate setup",
          "Basic analytics integration",
        ],
        sortOrder: 1,
      },
    })

    const mediumWebsite = await db.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Medium Website",
        description: "Information + E-commerce functionality",
        basePrice: 280000, // $2,800 in cents
        priceType: "ONE_TIME",
        features: [
          "Up to 15 pages",
          "E-commerce functionality",
          "Payment integration (Stripe, PayPal)",
          "Inventory management",
          "Advanced SEO optimization",
          "5 rounds of revisions",
          "Product catalog",
          "Customer accounts",
          "Order management",
          "Analytics dashboard",
        ],
        sortOrder: 2,
      },
    })

    const enterpriseWebsite = await db.service.create({
      data: {
        categoryId: websiteCategory.id,
        name: "Enterprise Website",
        description: "Custom builds with advanced functionality",
        basePrice: 1250000, // $12,500 in cents
        priceType: "CUSTOM",
        features: [
          "Unlimited pages",
          "Custom functionality",
          "Advanced integrations",
          "Enterprise security",
          "Scalable architecture",
          "Unlimited revisions",
          "24/7 priority support",
          "Performance optimization",
          "Custom admin panels",
          "API development",
        ],
        sortOrder: 3,
      },
    })

    // Create Hosting Services
    console.log('🏠 Creating hosting services...')
    const basicHosting = await db.service.create({
      data: {
        categoryId: hostingCategory.id,
        name: "Basic Hosting",
        description: "Perfect for small websites",
        basePrice: 2000, // $20 in cents
        priceType: "RECURRING",
        billingInterval: "month",
        features: [
          "99.9% uptime guarantee",
          "10 GB storage",
          "100 GB bandwidth", 
          "SSL certificate included",
          "Email support",
          "Daily backups",
        ],
        sortOrder: 1,
      },
    })

    const services = await db.service.findMany({
      include: { category: true }
    })

    console.log('✅ Production database seeded successfully!')

    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully!',
      summary: {
        categories: 3,
        services: services.length,
        details: services.map(s => ({
          name: s.name,
          category: s.category.name,
          price: s.basePrice / 100 // Convert to dollars for display
        }))
      }
    })

  } catch (error: any) {
    console.error('Error seeding production database:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Failed to seed database',
      details: error.message 
    }, { status: 500 })
  }
} 