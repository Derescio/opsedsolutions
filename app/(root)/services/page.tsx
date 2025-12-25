import { Metadata } from 'next'
import ServicesPage from '@/components/services-page'

export const metadata: Metadata = {
    title: 'Services | Portfolio',
    description: 'Explore our comprehensive web development, data analytics, and hosting services. Professional solutions tailored to your business needs.',
    keywords: ['web development', 'services', 'website design', 'data analytics', 'hosting', 'business intelligence'],
    openGraph: {
        title: 'Services',
        description: 'Professional web development and business intelligence services',
        type: 'website',
    },
}

export default function ServicesPageComponent() {
    return (
        <div>
            <ServicesPage />
        </div>
    )
}