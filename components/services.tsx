"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Code,
    Database,
    Cloud,
    BarChart3,
    Zap,
    Shield,
    Smartphone,
    TrendingUp,
    CheckCircle,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

const services = [
    {
        category: "Full-Stack Development",
        color: "#0376aa",
        icon: Code,
        description: "End-to-end web application development with modern technologies",
        services: [
            {
                name: "Custom Web Applications",
                description: "Scalable, responsive web applications built with React, Next.js, and modern frameworks",
                features: ["React/Next.js", "TypeScript", "Responsive Design", "Performance Optimization"],
                icon: Code
            },
            {
                name: "API Development & Integration",
                description: "RESTful APIs, GraphQL endpoints, and third-party service integrations",
                features: ["REST APIs", "GraphQL", "Authentication", "Rate Limiting"],
                icon: Cloud
            },
            {
                name: "Mobile-First Development",
                description: "Progressive web apps and mobile-optimized experiences",
                features: ["PWA", "Mobile Optimization", "Cross-Platform", "App Store Ready"],
                icon: Smartphone
            }
        ]
    },
    {
        category: "Data Analytics & Intelligence",
        color: "#32cf37",
        icon: Database,
        description: "Transform your data into actionable business insights",
        services: [
            {
                name: "Business Intelligence Dashboards",
                description: "Interactive dashboards and real-time analytics for data-driven decisions",
                features: ["Real-time Analytics", "Custom Dashboards", "KPI Tracking", "Automated Reports"],
                icon: BarChart3
            },
            {
                name: "Data Pipeline & ETL",
                description: "Automated data processing, cleaning, and transformation workflows",
                features: ["Data Pipelines", "ETL Processes", "Data Validation", "Automated Workflows"],
                icon: TrendingUp
            },
            {
                name: "Predictive Analytics",
                description: "Machine learning models for forecasting and business optimization",
                features: ["ML Models", "Forecasting", "Pattern Recognition", "Business Optimization"],
                icon: Zap
            }
        ]
    }
]

const processSteps = [
    {
        step: "01",
        title: "Discovery & Analysis",
        description: "Understanding your business needs, technical requirements, and success metrics"
    },
    {
        step: "02",
        title: "Architecture & Planning",
        description: "Designing scalable solutions with detailed project roadmaps and timelines"
    },
    {
        step: "03",
        title: "Development & Testing",
        description: "Agile development with continuous testing and quality assurance"
    },
    {
        step: "04",
        title: "Deployment & Optimization",
        description: "Seamless deployment with performance monitoring and ongoing optimization"
    }
]

export default function Services() {
    return (
        <section id="services" className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Enterprise-Grade Solutions
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Our <span className="text-[#0376aa]">Services</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Comprehensive full-stack development and data analytics services designed to optimize your business operations and drive growth
                    </p>
                </div>

                {/* Services Grid */}
                <div className="space-y-16">
                    {services.map((category) => {
                        const CategoryIcon = category.icon
                        return (
                            <div key={category.category} className="space-y-8">
                                {/* Category Header */}
                                <div className="text-center">
                                    <div className="inline-flex items-center space-x-3 mb-4">
                                        <div
                                            className="p-3 rounded-lg"
                                            style={{ backgroundColor: `${category.color}15` }}
                                        >
                                            <CategoryIcon
                                                className="w-8 h-8"
                                                style={{ color: category.color }}
                                            />
                                        </div>
                                        <h3
                                            className="text-2xl md:text-3xl font-bold"
                                            style={{ color: category.color }}
                                        >
                                            {category.category}
                                        </h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{category.description}</p>
                                </div>

                                {/* Services Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {category.services.map((service) => {
                                        const ServiceIcon = service.icon
                                        return (
                                            <Card key={service.name} className="h-full hover:shadow-xl transition-all duration-300 border-gray-200 dark:border-gray-700 group bg-white dark:bg-gray-800">
                                                <CardHeader className="pb-4">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div
                                                            className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300"
                                                            style={{ backgroundColor: `${category.color}15` }}
                                                        >
                                                            <ServiceIcon
                                                                className="w-6 h-6"
                                                                style={{ color: category.color }}
                                                            />
                                                        </div>
                                                        <CardTitle className="text-lg text-gray-900 dark:text-white">{service.name}</CardTitle>
                                                    </div>
                                                    <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                        {service.description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="space-y-3 mb-6">
                                                        {service.features.map((feature) => (
                                                            <div key={feature} className="flex items-center space-x-2">
                                                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full group-hover:bg-gray-50 dark:group-hover:bg-gray-700 transition-colors border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white"
                                                    >
                                                        Learn More
                                                        <ArrowRight className="ml-2 w-4 h-4" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Process Section */}
                <div className="mt-20">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Process</h3>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            A proven methodology that ensures successful project delivery and measurable results
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {processSteps.map((step, index) => (
                            <div key={step.step} className="relative">
                                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <div className="mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                                            {step.step}
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{step.description}</p>
                                    </div>
                                </Card>

                                {/* Connector Arrow */}
                                {index < processSteps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white p-8">
                        <CardContent className="space-y-4">
                            <h3 className="text-2xl md:text-3xl font-bold">Ready to Transform Your Business?</h3>
                            <p className="text-lg opacity-90 max-w-2xl mx-auto">
                                Let&apos;s discuss how our full-stack development and data analytics expertise can drive your next project to success.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
                                <Link href="/contact">
                                    <Button
                                        size="lg"
                                        variant="secondary"
                                        className="bg-white text-[#0376aa] hover:bg-gray-100 px-8 py-3"
                                    //onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                                    >
                                        Start Your Project
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="border-white text-white hover:bg-white hover:text-[#0376aa] px-8 py-3"
                                    //onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
                                    >
                                        View Our Work
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
} 