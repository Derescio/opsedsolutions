'use client'
import { usePathname } from 'next/navigation'
import Footer from './footer'

const PAGES_WITHOUT_FOOTER = ['/studio']

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Don't show footer on studio pages
    const shouldHideFooter = PAGES_WITHOUT_FOOTER.some(path =>
        pathname.startsWith(path)
    )

    if (shouldHideFooter) {
        return null
    }

    return <Footer />
} 