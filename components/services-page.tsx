"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Code,
    BarChart3,
    Zap,
    CheckCircle,
    ArrowRight,
    Settings,
    Globe,
    Search,
    Filter,
    Star,
    MessageCircle,
    Phone,
    Clock,
    DollarSign,
    ShoppingCart,
    Headphones,
    LucideIcon,
    Paintbrush,
    ClipboardList
} from "lucide-react"
import Link from "next/link"
import React, { useState, useMemo } from "react"

interface ServiceFeature {
    name: string
    included: boolean
}

interface ServiceTier {
    name: string
    price: string
    duration: string
    description: string
    features: ServiceFeature[]
    popular?: boolean
}

interface Service {
    id: string
    name: string
    shortDescription: string
    description: string
    category: string
    subcategory: string
    icon: LucideIcon
    features: string[]
    technologies: string[]
    deliverables: string[]
    timeline: string
    tiers: ServiceTier[]
    addOns?: string[]
}

const allServices: Service[] = [
    // Web Development Services
    {
        id: "custom-web-apps",
        name: "Custom Website Development",
        shortDescription: "Scalable, responsive web applications built with modern frameworks.",
        description: "Full-stack web applications tailored to your business needs, built with cutting-edge technologies for optimal performance and user experience.",
        category: "Web Development",
        subcategory: "Full-Stack Development",
        icon: Code,
        features: ["React/Next.js", "TypeScript", "Responsive Design", "Performance Optimization", "SEO Ready", "PWA Support"],
        technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL"],
        deliverables: ["Source Code", "Documentation", "Deployment Guide", "Training Session"],
        timeline: "4-6 weeks",
        tiers: [
            {
                name: "Starter",
                price: "$2,500",
                duration: "4-6 weeks",
                description: "Perfect for small businesses and startups",
                features: [
                    { name: "5-10 Pages", included: true },
                    { name: "Responsive Design", included: true },
                    { name: "Basic SEO", included: true },
                    { name: "Contact Form", included: true },
                    { name: "1 Revision Round", included: true },
                    { name: "Advanced Analytics", included: false },
                    { name: "E-commerce Integration", included: false },
                    { name: "Custom Dashboard", included: false }
                ]
            },
            {
                name: "Professional",
                price: "$5,000",
                duration: "6-8 weeks",
                description: "Ideal for growing businesses with complex needs",
                popular: true,
                features: [
                    { name: "15-25 Pages", included: true },
                    { name: "Responsive Design", included: true },
                    { name: "Advanced SEO", included: true },
                    { name: "Contact Form", included: true },
                    { name: "3 Revision Rounds", included: true },
                    { name: "Advanced Analytics", included: true },
                    { name: "Basic E-commerce", included: true },
                    { name: "Custom Dashboard", included: false }
                ]
            },
            {
                name: "Enterprise",
                price: "Custom",
                duration: "8-12 weeks",
                description: "For large organizations with complex requirements",
                features: [
                    { name: "Unlimited Pages", included: true },
                    { name: "Responsive Design", included: true },
                    { name: "Enterprise SEO", included: true },
                    { name: "Advanced Forms", included: true },
                    { name: "Unlimited Revisions", included: true },
                    { name: "Advanced Analytics", included: true },
                    { name: "Full E-commerce", included: true },
                    { name: "Custom Dashboard", included: true }
                ]
            }
        ],
        addOns: ["Mobile App", "Admin Dashboard", "API Integration", "Third-party Integrations"]
    },
    {
        id: "ecommerce-development",
        name: "E-Commerce Solutions",
        shortDescription: "Complete online stores with payment processing and inventory management",
        description: "Comprehensive e-commerce platforms with secure payment processing, inventory management, and customer relationship tools.",
        category: "Web Development",
        subcategory: "E-Commerce",
        icon: ShoppingCart,
        features: ["Product Management", "Payment Processing", "Inventory Tracking", "Order Management", "Customer Accounts", "Analytics Dashboard"],
        technologies: ["Next.js", "Stripe", "PayPal", "Shopify API", "WooCommerce", "Prisma"],
        deliverables: ["E-commerce Platform", "Admin Dashboard", "Payment Integration", "Documentation"],
        timeline: "6-16 weeks",
        tiers: [
            {
                name: "Basic Store",
                price: "$3,500",
                duration: "6-8 weeks",
                description: "Essential e-commerce features for small businesses",
                features: [
                    { name: "Up to 100 Products", included: true },
                    { name: "Payment Gateway", included: true },
                    { name: "Basic Analytics", included: true },
                    { name: "Order Management", included: true },
                    { name: "Customer Accounts", included: true },
                    { name: "Inventory Management", included: false },
                    { name: "Multi-currency", included: false },
                    { name: "Advanced Reports", included: false }
                ]
            },
            {
                name: "Professional Store",
                price: "$7,500",
                duration: "8-12 weeks",
                description: "Advanced e-commerce with full management features",
                popular: true,
                features: [
                    { name: "Unlimited Products", included: true },
                    { name: "Payment Gateway", included: true },
                    { name: "Advanced Analytics", included: true },
                    { name: "Order Management", included: true },
                    { name: "Customer Accounts", included: true },
                    { name: "Inventory Management", included: true },
                    { name: "Multi-currency", included: true },
                    { name: "Advanced Reports", included: false }
                ]
            },
            {
                name: "Enterprise Store",
                price: "Custom",
                duration: "12-16 weeks",
                description: "Enterprise-grade e-commerce with custom features",
                features: [
                    { name: "Unlimited Products", included: true },
                    { name: "Payment Gateway", included: true },
                    { name: "Enterprise Analytics", included: true },
                    { name: "Advanced Order Management", included: true },
                    { name: "Customer Accounts", included: true },
                    { name: "Full Inventory Management", included: true },
                    { name: "Multi-currency", included: true },
                    { name: "Custom Reports & API", included: true }
                ]
            }
        ]
    },

    // UI Research and Design
    {
        id: "ui-research-design",
        name: "UI Research and Design",
        shortDescription: "Rapid UI research, wireframing, and visual design for websites or apps",
        description: "User-centered design process including research, wireframes, and high-fidelity UI mockups tailored to your brand and product goals.",
        category: "Design",
        subcategory: "UI/UX Design",
        icon: Paintbrush,
        features: [
            "User Research",
            "Wireframes",
            "UI Design",
            "Design Systems",
            "Responsive Layouts",
            "Developer Handoff"
        ],
        technologies: ["Figma", "Miro", "Notion", "Lottie", "Adobe Illustrator"],
        deliverables: ["Wireframes", "UI Mockups", "Design System", "Interaction Guidelines"],
        timeline: "4–7 days",
        tiers: [
            {
                name: "Starter Package",
                price: "$500",
                duration: "4–5 days",
                description: "UI wireframes and basic visual design for small apps or websites",
                features: [
                    { name: "1–2 Screens", included: true },
                    { name: "Basic Research", included: true },
                    { name: "Wireframes", included: true },
                    { name: "Basic UI Design", included: true },
                    { name: "Design Handoff (Figma)", included: true },
                    { name: "Component Library", included: false },
                    { name: "Advanced Prototyping", included: false }
                ]
            },
            {
                name: "Professional Package",
                price: "$1,200",
                duration: "5–6 days",
                description: "Full UI kit and research-based designs for MVPs or corporate sites",
                popular: true,
                features: [
                    { name: "3–6 Screens", included: true },
                    { name: "User Personas", included: true },
                    { name: "Wireframes + UI Design", included: true },
                    { name: "Style Guide", included: true },
                    { name: "Design System", included: true },
                    { name: "Component Library", included: true },
                    { name: "Basic Prototyping", included: true },
                    { name: "Developer Notes", included: true }
                ]
            },
            {
                name: "Enterprise Package",
                price: "Custom",
                duration: "6–7 days",
                description: "End-to-end UI/UX research and design for high-complexity platforms",
                features: [
                    { name: "Unlimited Screens", included: true },
                    { name: "Deep User Research", included: true },
                    { name: "UX Strategy Documentation", included: true },
                    { name: "Component Library", included: true },
                    { name: "Full Design System", included: true },
                    { name: "Motion Prototypes", included: true },
                    { name: "Dev-ready Exports", included: true },
                    { name: "Follow-up Revisions", included: true }
                ]
            }
        ]
    },
    // UX Research and Design
    {
        id: "ux-research-design",
        name: "UX Research & Design",
        shortDescription: "Rapid UX research, wireframing, and usability testing for product clarity and user flow optimization.",
        description: "A focused UX sprint including stakeholder discovery, usability testing plans, wireframes, and high-fidelity UI design to improve digital experiences. Ideal for MVPs, redesigns, or new features.",
        category: "Design & Strategy",
        subcategory: "UX Design",
        icon: ClipboardList,
        features: [
            "Stakeholder Discovery",
            "UX Audit & Competitive Analysis",
            "Usability Testing Plan",
            "Wireframes & UI Design",
            "User Personas & Journeys",
            "Developer Handoff Documentation"
        ],
        technologies: ["Figma", "Notion", "Maze", "Miro", "Google Forms"],
        deliverables: [
            "Usability Test Plan",
            "Interview Notes",
            "Wireframes",
            "UI Mockups",
            "Design System",
            "Developer Handoff Guide"
        ],
        timeline: "4–7 days",
        tiers: [
            {
                name: "Rapid UX Sprint",
                price: "$500",
                duration: "4 days",
                description: "Quick UX analysis and UI concept for early-stage validation",
                features: [
                    { name: "1 Stakeholder Interview", included: true },
                    { name: "Mini UX Audit", included: true },
                    { name: "Usability Test Plan (Basic)", included: true },
                    { name: "2–3 Wireframes", included: true },
                    { name: "Basic UI Styling", included: true },
                    { name: "Prototype Link", included: false },
                    { name: "Design System", included: false },
                    { name: "User Journey Map", included: false }
                ]
            },
            {
                name: "Standard UX Package",
                price: "$1,000",
                duration: "5–6 days",
                description: "In-depth UX testing, UI design, and user journey optimization",
                popular: true,
                features: [
                    { name: "2–3 Stakeholder Interviews", included: true },
                    { name: "UX Audit + Heuristic Evaluation", included: true },
                    { name: "Usability Test Plan & Task Script", included: true },
                    { name: "5–7 Wireframes", included: true },
                    { name: "High-Fidelity UI Designs", included: true },
                    { name: "Developer Handoff Docs", included: true },
                    { name: "Design System (Lite)", included: true },
                    { name: "User Personas + Journey Maps", included: false }
                ]
            },
            {
                name: "UX Strategy & Design System",
                price: "Custom",
                duration: "6–7 days",
                description: "Full research, UX testing, and atomic design system for scalable design",
                features: [
                    { name: "Unlimited Interviews & Research", included: true },
                    { name: "Full UX Audit & Competitive Benchmarking", included: true },
                    { name: "Advanced Usability Testing Framework", included: true },
                    { name: "UI + UX Strategy Deck", included: true },
                    { name: "Component-Based Design System", included: true },
                    { name: "Design Tokens & Figma Libraries", included: true },
                    { name: "Journey Mapping & Behavioral Segments", included: true },
                    { name: "Post-launch Test Plan", included: true }
                ]
            }
        ]
    },
    // Data Analytics Services
    {
        id: "business-intelligence",
        name: "Business Intelligence Dashboards",
        shortDescription: "Interactive dashboards and real-time analytics for data-driven decisions",
        description: "Transform your raw data into actionable insights with custom dashboards, automated reporting, and real-time analytics.",
        category: "Data Analytics",
        subcategory: "Business Intelligence",
        icon: BarChart3,
        features: ["Real-time Analytics", "Custom Dashboards", "KPI Tracking", "Automated Reports", "Data Visualization", "Predictive Analytics"],
        technologies: ["Python", "Tableau", "Power BI", "D3.js", "PostgreSQL", "MongoDB"],
        deliverables: ["Dashboard Platform", "Data Models", "Reports", "Training Materials"],
        timeline: "6-14 weeks",
        tiers: [
            {
                name: "Basic Dashboard",
                price: "$4,000",
                duration: "6-8 weeks",
                description: "Essential analytics for small to medium businesses",
                features: [
                    { name: "5-10 Key Metrics", included: true },
                    { name: "Basic Visualizations", included: true },
                    { name: "Weekly Reports", included: true },
                    { name: "Data Integration (2 sources)", included: true },
                    { name: "User Access Control", included: true },
                    { name: "Real-time Updates", included: false },
                    { name: "Predictive Analytics", included: false },
                    { name: "Advanced Automation", included: false }
                ]
            },
            {
                name: "Advanced Analytics",
                price: "$8,500",
                duration: "8-12 weeks",
                description: "Comprehensive analytics with advanced features",
                popular: true,
                features: [
                    { name: "15-25 Key Metrics", included: true },
                    { name: "Advanced Visualizations", included: true },
                    { name: "Daily Automated Reports", included: true },
                    { name: "Data Integration (5+ sources)", included: true },
                    { name: "Role-based Access", included: true },
                    { name: "Real-time Updates", included: true },
                    { name: "Basic Predictive Analytics", included: true },
                    { name: "Advanced Automation", included: false }
                ]
            },
            {
                name: "Enterprise Analytics",
                price: "Custom",
                duration: "12-14 weeks",
                description: "Enterprise-grade analytics with AI/ML integration",
                features: [
                    { name: "Unlimited Metrics", included: true },
                    { name: "Custom Visualizations", included: true },
                    { name: "Real-time Reports", included: true },
                    { name: "Unlimited Data Sources", included: true },
                    { name: "Enterprise Security", included: true },
                    { name: "Real-time Streaming", included: true },
                    { name: "Advanced AI/ML Analytics", included: true },
                    { name: "Full Process Automation", included: true }
                ]
            }
        ]
    },



    // Maintenance & Support
    {
        id: "maintenance-support",
        name: "Website Maintenance & Support",
        shortDescription: "Ongoing maintenance, updates, and technical support services",
        description: "Comprehensive maintenance packages to keep your applications running smoothly with regular updates and support.",
        category: "Maintenance & Support",
        subcategory: "Ongoing Services",
        icon: Headphones,
        features: ["Regular Updates", "Security Monitoring", "Performance Optimization", "Bug Fixes", "Content Updates", "24/7 Support"],
        technologies: ["Various based on existing stack", "Monitoring Tools", "Security Tools", "Performance Tools"],
        deliverables: ["Monthly Reports", "Update Logs", "Performance Reports", "Security Audits"],
        timeline: "Ongoing",
        tiers: [
            {
                name: "Basic Support",
                price: "$20/month",
                duration: "Monthly",
                description: "Essential maintenance for small websites",
                features: [
                    { name: "Monthly Updates", included: true },
                    { name: "Basic Security Monitoring", included: true },
                    { name: "Performance Checks", included: true },
                    { name: "Bug Fixes (2 hours/month)", included: true },
                    { name: "Email Support", included: true },
                    { name: "Priority Support", included: false },
                    { name: "Content Updates", included: false },
                    { name: "Advanced Monitoring", included: false }
                ]
            },
            {
                name: "Professional Support",
                price: "$50/month",
                duration: "Monthly",
                description: "Comprehensive support for business applications",
                popular: true,
                features: [
                    { name: "Weekly Updates", included: true },
                    { name: "Advanced Security Monitoring", included: true },
                    { name: "Performance Optimization", included: true },
                    { name: "Bug Fixes (5 hours/month)", included: true },
                    { name: "Priority Email Support", included: true },
                    { name: "Phone Support", included: true },
                    { name: "Content Updates (2 hours/month)", included: true },
                    { name: "Advanced Monitoring", included: false }
                ]
            },
            {
                name: "Enterprise Support",
                price: "$100/month",
                duration: "Monthly",
                description: "Enterprise-level support with dedicated attention",
                features: [
                    { name: "Real-time Updates", included: true },
                    { name: "Enterprise Security", included: true },
                    { name: "Continuous Optimization", included: true },
                    { name: "Unlimited Bug Fixes", included: true },
                    { name: "24/7 Priority Support", included: true },
                    { name: "Dedicated Support Manager", included: true },
                    { name: "Unlimited Content Updates", included: true },
                    { name: "Full System Monitoring", included: true }
                ]
            }
        ]
    }
]

// const testimonials = [
//     {
//         name: "Sarah Johnson",
//         company: "TechStart Inc.",
//         role: "CEO",
//         content: "The custom web application exceeded our expectations. The team delivered on time and the solution has significantly improved our business operations.",
//         rating: 5,
//         service: "Custom Web Applications"
//     },
//     {
//         name: "Michael Chen",
//         company: "DataFlow Analytics",
//         role: "CTO",
//         content: "Outstanding data analytics dashboard. The insights we're getting are invaluable for our decision-making process. Highly recommend their services.",
//         rating: 5,
//         service: "Business Intelligence"
//     },
//     {
//         name: "Emily Rodriguez",
//         company: "GreenLeaf Retail",
//         role: "Operations Manager",
//         content: "Our e-commerce platform has transformed our business. Sales have increased by 40% since launch. Professional and responsive team.",
//         rating: 5,
//         service: "E-Commerce Solutions"
//     }
// ]

const faqs = [
    {
        question: "How do you handle project communication?",
        answer: "We provide regular updates through weekly progress reports, dedicated project channels, and scheduled check-in meetings. You'll always know the status of your project."
    },
    {
        question: "What's included in the maintenance packages?",
        answer: "Our maintenance packages include regular updates, security monitoring, performance optimization, bug fixes, and technical support based on your chosen tier."
    },
    {
        question: "Can you work with our existing technology stack?",
        answer: "Yes, we're experienced with a wide range of technologies and can work with your existing stack or recommend the best solutions for your needs."
    },
    {
        question: "Do you provide training for our team?",
        answer: "Absolutely! We include training sessions with most of our packages and offer additional training services to ensure your team can effectively use the solutions we build."
    },
    {
        question: "What happens if we need changes after the project is complete?",
        answer: "We offer post-launch support and can make adjustments as needed. For ongoing changes, we recommend our maintenance packages or can quote additional development work."
    },
    {
        question: "How do you ensure project security?",
        answer: "We follow industry best practices for security, including secure coding standards, regular security audits, encrypted communications, and compliance with relevant regulations."
    }
]

const categoryColors = {
    "Web Development": "#0376aa",
    "Mobile Development": "#8b5cf6",
    "Data Analytics": "#32cf37",
    "Design & Strategy": "#f59e0b",
    "Design": "#f59e0b",
    "Maintenance & Support": "#32cf37"
}

function ServiceCard({ service }: { service: Service }) {
    const categoryColor = categoryColors[service.category as keyof typeof categoryColors] || "#6b7280"
    const Icon = service.icon

    return (
        <Card className="h-full hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-700 group overflow-hidden bg-white dark:bg-gray-800">
            <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-3">
                    <div
                        className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
                        style={{ backgroundColor: `${categoryColor}15` }}
                    >
                        <Icon
                            className="w-6 h-6"
                            style={{ color: categoryColor }}
                        />
                    </div>
                    <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-[#0376aa] transition-colors">
                            {service.name}
                        </CardTitle>
                        <Badge
                            className="text-white border-0 mt-1"
                            style={{ backgroundColor: categoryColor }}
                        >
                            {service.subcategory}
                        </Badge>
                    </div>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {service.shortDescription}
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Key Features */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Key Features</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {service.features.slice(0, 4).map((feature) => (
                            <div key={feature} className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                <span className="text-xs text-gray-700 dark:text-gray-300">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline and Starting Price */}
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-center">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-300" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Timeline</span>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{service.timeline}</div>
                    </div>
                    <div className="text-center">
                        <DollarSign className="w-4 h-4 mx-auto mb-1 text-gray-600 dark:text-gray-300" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Starting at</span>
                        <div className="text-sm font-semibold" style={{ color: categoryColor }}>
                            {service.tiers[0].price}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                    <Link href="/contact">
                        <Button
                            size="sm"
                            className="w-full text-white transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: categoryColor }}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Get Quote
                        </Button>
                    </Link>
                    {/* <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                    >
                        View Details
                    </Button> */}
                </div>
            </CardContent>
        </Card>
    )
}

function ServiceDetail({ service }: { service: Service }) {
    const categoryColor = categoryColors[service.category as keyof typeof categoryColors] || "#6b7280"

    return (
        <div className="space-y-8">
            {/* Service Header */}
            <div className="text-center">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{service.name}</h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{service.description}</p>
            </div>

            {/* Service Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {service.tiers.map((tier) => (
                    <Card key={tier.name} className={`relative ${tier.popular ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900' : ''} bg-white dark:bg-gray-800`} style={tier.popular ? { '--tw-ring-color': categoryColor } as React.CSSProperties : {}}>
                        {tier.popular && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <Badge className="text-white border-0" style={{ backgroundColor: categoryColor }}>
                                    Most Popular
                                </Badge>
                            </div>
                        )}
                        <CardHeader className="text-center pb-4">
                            <CardTitle className="text-xl text-gray-900 dark:text-white">{tier.name}</CardTitle>
                            <div className="text-3xl font-bold mb-2" style={{ color: categoryColor }}>
                                {tier.price}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{tier.duration}</p>
                            <CardDescription className="mt-2">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {tier.features.map((feature) => (
                                    <div key={feature.name} className="flex items-center space-x-2">
                                        <CheckCircle className={`w-4 h-4 flex-shrink-0 ${feature.included ? 'text-green-500' : 'text-gray-300 dark:text-gray-600'}`} />
                                        <span className={`text-sm ${feature.included ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                            {feature.name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <Button
                                className="w-full mt-6 text-white"
                                style={{ backgroundColor: categoryColor }}
                            >
                                Choose {tier.name}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Deliverables</h4>
                    <div className="space-y-2">
                        {service.deliverables.map((deliverable) => (
                            <div key={deliverable} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{deliverable}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ServicesPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [priceRange, setPriceRange] = useState<string>("all")
    const [selectedService, setSelectedService] = useState<Service | null>(null)

    const categories = Array.from(new Set(allServices.map(s => s.category)))

    const filteredServices = useMemo(() => {
        return allServices.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                service.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCategory = selectedCategory === "all" || service.category === selectedCategory

            const matchesPrice = priceRange === "all" ||
                (priceRange === "under-5k" && service.tiers.some(tier => tier.price !== "Custom" && parseInt(tier.price.replace(/[$,]/g, '')) < 5000)) ||
                (priceRange === "5k-10k" && service.tiers.some(tier => tier.price !== "Custom" && parseInt(tier.price.replace(/[$,]/g, '')) >= 5000 && parseInt(tier.price.replace(/[$,]/g, '')) <= 10000)) ||
                (priceRange === "over-10k" && service.tiers.some(tier => tier.price !== "Custom" && parseInt(tier.price.replace(/[$,]/g, '')) > 10000)) ||
                (priceRange === "custom" && service.tiers.some(tier => tier.price === "Custom"))

            return matchesSearch && matchesCategory && matchesPrice
        })
    }, [searchQuery, selectedCategory, priceRange])

    const serviceStats = {
        total: allServices.length,
        categories: categories.length,
        avgDelivery: "6-12 weeks",
        satisfaction: "98%"
    }

    if (selectedService) {
        return (
            <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    <Button
                        onClick={() => setSelectedService(null)}
                        variant="outline"
                        className="mb-8"
                    >
                        ← Back to Services
                    </Button>
                    <ServiceDetail service={selectedService} />
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0da1e5] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <Settings className="w-4 h-4 mr-2" />
                        Professional Services
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Our <span className="text-[#0376aa]">Services</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                        Comprehensive technology solutions from web development to AI integration.
                        We help businesses transform ideas into powerful digital experiences.
                    </p>

                    {/* Stats */}
                    {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-[#0376aa]">{serviceStats.total}+</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Services Offered</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-[#32cf37]">{serviceStats.categories}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Categories</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-[#8b5cf6]">{serviceStats.avgDelivery}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Avg Delivery</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-[#f59e0b]">{serviceStats.satisfaction}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction</div>
                        </div>
                    </div> */}
                </div>

                {/* Filters and Search */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search services by name, description, or features..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-3 text-lg"
                        />
                    </div>

                    {/* Filter Controls */}
                    <div className="flex flex-wrap gap-4 justify-center items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Filters:</span>
                        </div>

                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                    <SelectItem key={category} value={category}>{category}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={priceRange} onValueChange={setPriceRange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Price Range" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Prices</SelectItem>
                                <SelectItem value="under-5k">Under $5,000</SelectItem>
                                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                                <SelectItem value="over-10k">Over $10,000</SelectItem>
                                <SelectItem value="custom">Custom Pricing</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
                        <TabsTrigger value="overview">Services</TabsTrigger>
                        <TabsTrigger value="process">Process</TabsTrigger>
                        {/* <TabsTrigger value="testimonials">Reviews</TabsTrigger> */}
                        <TabsTrigger value="faq">FAQ</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        {/* Results Count */}
                        <div className="text-center mb-8">
                            <p className="text-gray-600 dark:text-gray-300">
                                Showing <span className="font-semibold text-[#0376aa]">{filteredServices.length}</span> of {allServices.length} services
                            </p>
                        </div>

                        {/* Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                            {filteredServices.map((service) => (
                                <div key={service.id} onClick={() => setSelectedService(service)} className="cursor-pointer">
                                    <ServiceCard service={service} />
                                </div>
                            ))}
                        </div>

                        {/* No Results */}
                        {filteredServices.length === 0 && (
                            <div className="text-center py-16">
                                <div className="text-gray-400 mb-4">
                                    <Search className="w-16 h-16 mx-auto" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No services found</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                    Try adjusting your search criteria or filters to find what you&apos;re looking for.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("all")
                                        setPriceRange("all")
                                    }}
                                    variant="outline"
                                >
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="process" className="space-y-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Process</h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                A proven methodology that ensures successful project delivery and measurable results
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                {
                                    step: "01",
                                    title: "Discovery & Analysis",
                                    description: "Understanding your business needs, technical requirements, and success metrics",
                                    icon: Search
                                },
                                {
                                    step: "02",
                                    title: "Architecture & Planning",
                                    description: "Designing scalable solutions with detailed project roadmaps and timelines",
                                    icon: Settings
                                },
                                {
                                    step: "03",
                                    title: "Development & Testing",
                                    description: "Agile development with continuous testing and quality assurance",
                                    icon: Code
                                },
                                {
                                    step: "04",
                                    title: "Deployment & Optimization",
                                    description: "Seamless deployment with performance monitoring and ongoing optimization",
                                    icon: Zap
                                }
                            ].map((step, index) => {
                                const StepIcon = step.icon
                                return (
                                    <div key={step.step} className="relative">
                                        <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                            <div className="mb-4">
                                                <div className="w-16 h-16 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                                    {step.step}
                                                </div>
                                                <StepIcon className="w-8 h-8 mx-auto mb-4 text-[#0376aa]" />
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                                            </div>
                                        </Card>

                                        {/* Connector Arrow */}
                                        {index < 3 && (
                                            <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                                <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </TabsContent>

                    {/* <TabsContent value="testimonials" className="space-y-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Client Testimonials</h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                See what our clients say about working with us
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <div className="flex items-center space-x-1 mb-2">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <Badge variant="secondary" className="w-fit">
                                            {testimonial.service}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                                            &ldquo;{testimonial.content}&rdquo;
                                        </p>
                                        <div>
                                            <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                                            <div className="text-sm text-gray-600 dark:text-gray-300">{testimonial.role}, {testimonial.company}</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent> */}

                    <TabsContent value="faq" className="space-y-8">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Get answers to common questions about our services
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-4">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{faq.question}</h4>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="text-gray-600 dark:text-gray-300 mb-4">
                                Don&apos;t see your question answered?
                            </p>
                            <Link href="/contact">
                                <Button className="bg-[#0376aa] hover:bg-[#025a8a] text-white">
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Bottom CTA */}
                {/* <div className="mt-16 text-center">
                    <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white p-8">
                        <CardContent className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold">Ready to Get Started?</h3>
                            <p className="text-lg opacity-90 max-w-2xl mx-auto">
                                Let&apos;s discuss your project requirements and create a solution that drives real business results.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                                <Link href="/contact">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="bg-white text-[#0376aa] hover:bg-gray-100 px-8 py-3"
                                    >
                                        <Phone className="mr-2 h-4 w-4" />
                                        Get Free Consultation
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-[#0376aa] px-8 py-3"
                                    >
                                        <Globe className="mr-2 h-4 w-4" />
                                        View Our Work
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div> */}
            </div>
        </section>
    )
}