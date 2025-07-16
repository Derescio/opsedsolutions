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
                        width={280}
                        height={280}
                        className="h-18 md:h-20 w-auto dark:hidden"
                        priority
                    />
                    {/* Dark mode logo (for dark backgrounds) */}
                    <Image
                        src="/images/Logo_new_1_white_new.png"
                        alt="Opsed Solutions - Smarter Web Platforms"
                        width={580}
                        height={580}
                        className="h-20 md:h-20 w-auto hidden dark:block"
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-gray-700 dark:text-gray-300 hover:text-[#0376aa] dark:hover:text-[#0376aa] transition-colors duration-200 font-medium"
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="flex items-center space-x-3">
                        <ModeToggle />
                        <AuthButton />
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center space-x-2 mr-10">
                    <button
                        className="mr-1 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 shadow-sm"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle mobile menu"
                        type="button"
                    >
                        {isMenuOpen ? (
                            <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation - Side Drawer */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />

                    {/* Side Drawer */}
                    <div className="fixed top-0 left-0 h-screen w-80 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
                        <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                                    {/* Light mode logo */}
                                    <Image
                                        src="/images/Logo_new_1.png"
                                        alt="Opsed Solutions"
                                        width={200}
                                        height={200}
                                        className="h-16 w-auto dark:hidden"
                                    />
                                    {/* Dark mode logo */}
                                    <Image
                                        src="/images/Logo_new_1_white.png"
                                        alt="Opsed Solutions"
                                        width={200}
                                        height={200}
                                        className="h-16 w-auto hidden dark:block"
                                    />
                                </Link>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex-1 px-4 py-6 space-y-4 overflow-y-auto">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="block text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-[#0376aa] dark:hover:text-[#0376aa] transition-colors duration-200 py-3 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}

                                {/* Theme Toggle in Drawer */}
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between py-3 px-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
                                        <ModeToggle />
                                    </div>
                                </div>

                                {/* Authentication Button */}
                                <div className="pt-4">
                                    <div onClick={() => setIsMenuOpen(false)}>
                                        <AuthButton />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}

export default Navbar