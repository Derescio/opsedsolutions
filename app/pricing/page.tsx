import { Metadata } from 'next'
import ServiceSelector from '@/components/client/service-selector'
import { getServicesWithCategories } from '@/lib/queries/services'

export const metadata: Metadata = {
    title: 'Pricing & Services | Portfolio',
    description: 'Choose from our website development, data analytics, and hosting services. Get a custom quote today.',
    keywords: ['web development', 'pricing', 'services', 'website design', 'data analytics', 'hosting'],
    openGraph: {
        title: 'Pricing & Services',
        description: 'Professional web development services with transparent pricing',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Pricing & Services',
        description: 'Professional web development services',
    }
}

export default async function PricingPage() {
    const { services, servicesByCategory, categories } = await getServicesWithCategories()

    // Generate structured data for SEO
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Web Development Services',
        'description': 'Professional website development, data analytics, and hosting services',
        'provider': {
            '@type': 'Organization',
            'name': 'Portfolio',
        },
        'areaServed': 'Worldwide',
        'serviceType': categories.map(cat => cat.name),
        'offers': services.map(service => ({
            '@type': 'Offer',
            'name': service.name,
            'description': service.description,
            'price': service.basePrice / 100,
            'priceCurrency': 'USD',
            'availability': service.isActive ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        }))
    }

    return (
        <div className="min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <ServiceSelector
                services={services}
                servicesByCategory={servicesByCategory}
                categories={categories}
            />
        </div>
    )
} 