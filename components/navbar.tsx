'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from 'react'
import { ModeToggle } from "@/components/mode-toggle"
import AuthButton from "@/components/auth-button"

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()
    const isHomepage = pathname === '/'

    // Smart navigation: anchor links on homepage, page links elsewhere
    const getNavItems = () => [
        { name: 'Home', href: '/' },
        {
            name: 'Projects',
            href: isHomepage ? '#projects' : '/projects'
        },
        {
            name: 'Services',
            href: isHomepage ? '#services' : '/services'
        },
        {
            name: 'About',
            href: isHomepage ? '#about' : '/about'
        },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Blog', href: '/blog' },
        // { name: 'Studio', href: '/studio' },
        {
            name: 'Contact',
            href: isHomepage ? '#contact' : '/#contact'
        },
    ]

    const navItems = getNavItems()

    return (
        <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50 shadow-sm ">
            <div className='container mx-auto flex justify-between items-center px-4 py-3'>
                {/* Logo */}
                <Link href="/" >
                    {/* Light mode logo (for light backgrounds) */}
                    <Image
                        src="/images/Logo_new_1.png"
                        alt="Opsed Solutions - Smarter Web Platforms"
                        width={200}
                        height={50}
                        className="h-10 w-auto dark:hidden"
                    />
                    {/* Dark mode logo (for dark backgrounds) */}
                    <Image
                        src="/images/Logo_new_1_white.png"
                        alt="Opsed Solutions - Smarter Web Platforms"
                        width={200}
                        height={50}
                        className="h-10 w-auto hidden dark:block"
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Auth & Controls */}
                <div className="hidden md:flex items-center space-x-4">
                    <ModeToggle />
                    <AuthButton />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center space-x-2">
                    <ModeToggle />
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </Button>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-4 space-y-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                            <AuthButton />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    )
}

export default Navbar