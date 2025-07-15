'use client'
import { usePathname } from 'next/navigation'
import Navbar from './navbar'

const PAGES_WITHOUT_NAVBAR = ['/studio', '/structure', '/vision']

export default function ConditionalNavbar() {
    const pathname = usePathname()

    // Don't show navbar on studio pages or if path starts with studio
    const shouldHideNavbar = PAGES_WITHOUT_NAVBAR.some(path =>
        pathname.startsWith(path)
    )

    if (shouldHideNavbar) {
        return null
    }

    return <Navbar />
} 