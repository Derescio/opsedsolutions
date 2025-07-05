'use client'
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, ArrowUp } from "lucide-react"

const footerLinks = {
    services: [
        { name: "Web Development", href: "#services" },
        { name: "Data Analytics", href: "#services" },
        { name: "System Optimization", href: "#services" },
        { name: "Technical Consulting", href: "#services" }
    ],
    company: [
        { name: "About", href: "#about" },
        { name: "Projects", href: "#projects" },
        { name: "Contact", href: "#contact" },
        { name: "Blog", href: "#" }
    ],
    resources: [
        { name: "Case Studies", href: "#projects" },
        { name: "Tech Stack", href: "#about" },
        { name: "Privacy Policy", href: "#" },
        { name: "Terms of Service", href: "#" }
    ]
}

const socialLinks = [
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/in/yourprofile", color: "#0077B5" },
    { name: "GitHub", icon: Github, href: "https://github.com/yourprofile", color: "#333" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/yourprofile", color: "#1DA1F2" }
]

export default function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <footer className="bg-gray-900 dark:bg-gray-950 text-white">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                    {/* Company Info */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block mb-6">
                            <Image
                                src="/images/Logo_new_1_white_new.png"
                                alt="Opsed Solutions"
                                width={400}
                                height={400}
                                className="h-16 w-auto"
                            />
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                            Optimizing systems for enterprise development. We combine full-stack development expertise
                            with advanced data analytics to create solutions that drive real business growth.
                        </p>

                        {/* Contact Info */}
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                                <Mail className="w-4 h-4 text-[#0376aa]" />
                                <a href="mailto:hello@opsedsolutions.com" className="text-gray-300 hover:text-white transition-colors">
                                    hello@opsedsolutions.com
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-4 h-4 text-[#32cf37]" />
                                <a href="tel:+15551234567" className="text-gray-300 hover:text-white transition-colors">
                                    +1 (555) 123-4567
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-4 h-4 text-[#0376aa]" />
                                <span className="text-gray-300">Remote & On-site Available</span>
                            </div>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white">Services</h3>
                        <ul className="space-y-3">
                            {footerLinks.services.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-[#0376aa] transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white">Company</h3>
                        <ul className="space-y-3">
                            {footerLinks.company.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-[#32cf37] transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-6 text-white">Resources</h3>
                        <ul className="space-y-3">
                            {footerLinks.resources.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        className="text-gray-300 hover:text-[#0376aa] transition-colors duration-200"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Signup */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="max-w-md">
                        <h3 className="text-lg font-semibold mb-4 text-white">Stay Updated</h3>
                        <p className="text-gray-300 mb-4">
                            Get the latest insights on web development and data analytics delivered to your inbox.
                        </p>
                        <div className="flex space-x-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0376aa] focus:border-transparent"
                            />
                            <button className="px-6 py-2 bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white rounded-lg hover:opacity-90 transition-opacity font-medium">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800 bg-gray-950 dark:bg-black">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Opsed Solutions. All rights reserved.
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-6">
                            <span className="text-gray-400 text-sm">Follow us:</span>
                            <div className="flex space-x-4">
                                {socialLinks.map((social) => {
                                    const Icon = social.icon
                                    return (
                                        <a
                                            key={social.name}
                                            href={social.href}
                                            className="text-gray-400 hover:text-white transition-colors duration-200"
                                            aria-label={social.name}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Back to Top */}
                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-gray-400 hover:text-[#0376aa] transition-colors duration-200 group"
                            aria-label="Back to top"
                        >
                            <span className="text-sm">Back to top</span>
                            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Floating Action Button for Mobile */}
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 md:hidden bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40"
                aria-label="Back to top"
            >
                <ArrowUp className="w-5 h-5" />
            </button>
        </footer>
    )
} 