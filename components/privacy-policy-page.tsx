"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Mail, Clock, Globe, Database, Users, Lock, Eye, FileText, AlertTriangle } from "lucide-react"

const sections = [
    {
        id: "information-collection",
        title: "Information We Collect",
        icon: Database,
        content: [
            {
                subtitle: "Personal Information",
                text: "We collect information you provide directly to us, such as when you create an account, contact us, or use our services. This may include your name, email address, phone number, company information, and project requirements."
            },
            {
                subtitle: "Technical Information",
                text: "We automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages visited."
            },
            {
                subtitle: "Project Data",
                text: "When providing development or analytics services, we may have access to your business data, analytics information, and technical specifications as necessary to deliver our services."
            }
        ]
    },
    {
        id: "information-use",
        title: "How We Use Your Information",
        icon: Eye,
        content: [
            {
                subtitle: "Service Delivery",
                text: "We use your information to provide, maintain, and improve our web development and data analytics services, communicate with you about projects, and process payments."
            },
            {
                subtitle: "Business Operations",
                text: "We may use your information for legitimate business purposes including project management, customer support, invoicing, and business analysis."
            },
            {
                subtitle: "Legal Compliance",
                text: "We may use and disclose your information as required by law, to enforce our terms, or to protect the rights, property, or safety of our business and users."
            }
        ]
    },
    {
        id: "information-sharing",
        title: "Information Sharing and Disclosure",
        icon: Users,
        content: [
            {
                subtitle: "Service Providers",
                text: "We may share your information with trusted third-party service providers who assist us in operating our business, such as payment processors, cloud hosting services, and communication tools."
            },
            {
                subtitle: "Business Transfers",
                text: "In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction."
            },
            {
                subtitle: "Legal Requirements",
                text: "We may disclose your information if required to do so by law or in response to valid requests by public authorities."
            }
        ]
    },
    {
        id: "data-security",
        title: "Data Security",
        icon: Lock,
        content: [
            {
                subtitle: "Security Measures",
                text: "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction."
            },
            {
                subtitle: "Data Encryption",
                text: "We use industry-standard encryption for data transmission and storage. All sensitive data is encrypted both in transit and at rest."
            },
            {
                subtitle: "Access Controls",
                text: "We maintain strict access controls and regularly review who has access to personal information within our organization."
            }
        ]
    },
    {
        id: "user-rights",
        title: "Your Rights and Choices",
        icon: Shield,
        content: [
            {
                subtitle: "Access and Portability",
                text: "You have the right to access your personal information and request a copy of the data we hold about you in a portable format."
            },
            {
                subtitle: "Correction and Deletion",
                text: "You can request that we correct inaccurate information or delete your personal information, subject to certain legal limitations."
            },
            {
                subtitle: "Opt-Out Rights",
                text: "You may opt out of certain communications from us and can request restrictions on how we process your information."
            }
        ]
    },
    {
        id: "cookies-tracking",
        title: "Cookies and Tracking Technologies",
        icon: Globe,
        content: [
            {
                subtitle: "Essential Cookies",
                text: "We use cookies and similar technologies to provide essential website functionality, remember your preferences, and improve your user experience."
            },
            {
                subtitle: "Analytics Cookies",
                text: "We may use analytics tools to understand how visitors interact with our website to improve our services and user experience."
            },
            {
                subtitle: "Cookie Management",
                text: "You can control cookie settings through your browser preferences. Note that disabling certain cookies may limit website functionality."
            }
        ]
    }
]

const quickLinks = [
    { title: "Data Collection", href: "#information-collection" },
    { title: "How We Use Data", href: "#information-use" },
    { title: "Data Sharing", href: "#information-sharing" },
    { title: "Security", href: "#data-security" },
    { title: "Your Rights", href: "#user-rights" },
    { title: "Cookies", href: "#cookies-tracking" }
]

export default function PrivacyPolicyPage() {
    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Legal Information
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Privacy <span className="text-[#0376aa]">Policy</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                        We are committed to protecting your privacy and ensuring the security of your personal information.
                        This policy explains how we collect, use, and safeguard your data.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Badge className="bg-green-500 text-white px-4 py-2">
                            <Clock className="w-4 h-4 mr-2" />
                            Last Updated: January 2025
                        </Badge>
                        <Badge className="bg-blue-500 text-white px-4 py-2">
                            <Globe className="w-4 h-4 mr-2" />
                            GDPR & CCPA Compliant
                        </Badge>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Table of Contents */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg text-gray-900 dark:text-white">Quick Navigation</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <nav className="space-y-2">
                                    {quickLinks.map((link) => (
                                        <a
                                            key={link.href}
                                            href={link.href}
                                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:text-[#0376aa] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                                        >
                                            {link.title}
                                        </a>
                                    ))}
                                </nav>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Important Notice */}
                        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                            Important Notice
                                        </h3>
                                        <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                            By using our website and services, you consent to the collection and use of your information
                                            as outlined in this privacy policy. If you do not agree with our policies and practices,
                                            please do not use our services.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Privacy Policy Sections */}
                        {sections.map((section) => {
                            const Icon = section.icon
                            return (
                                <Card key={section.id} id={section.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-[#0376aa]/10 rounded-lg">
                                                <Icon className="w-6 h-6 text-[#0376aa]" />
                                            </div>
                                            <CardTitle className="text-2xl text-gray-900 dark:text-white">
                                                {section.title}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {section.content.map((item, index) => (
                                            <div key={index}>
                                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                                    {item.subtitle}
                                                </h4>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {item.text}
                                                </p>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            )
                        })}

                        {/* Additional Important Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <Clock className="w-5 h-5 text-[#32cf37]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Data Retention</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        We retain personal information only as long as necessary to fulfill the purposes outlined in this policy,
                                        comply with legal obligations, and resolve disputes. Project data is typically retained for 7 years after
                                        project completion unless otherwise requested.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-[#8b5cf6]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">International Transfers</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Your information may be transferred to and processed in countries other than your own.
                                        We ensure appropriate safeguards are in place to protect your information in accordance
                                        with applicable data protection laws.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <Users className="w-5 h-5 text-[#f59e0b]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Children&apos;s Privacy</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Our services are not intended for children under 16 years of age. We do not knowingly collect
                                        personal information from children under 16. If we learn we have collected such information,
                                        we will delete it promptly.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-[#ef4444]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Policy Updates</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        We may update this privacy policy from time to time. We will notify you of any material changes
                                        by posting the new policy on our website and updating the &ldquo;Last Updated&rdquo; date above.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white border-0">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                    <h3 className="text-2xl font-bold mb-4">Privacy Questions?</h3>
                                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                                        If you have any questions about this privacy policy or our data practices,
                                        please don&apos;t hesitate to contact us.
                                    </p>
                                    <div className="space-y-2 text-sm opacity-90">
                                        <p><strong>Email:</strong> privacy@yourportfolio.com</p>
                                        <p><strong>Response Time:</strong> Within 48 hours</p>
                                        <p><strong>Data Protection Officer:</strong> Available upon request</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}