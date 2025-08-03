"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Scale, DollarSign, Clock, AlertTriangle, Shield, Users, Globe, Code, Database, Gavel, RefreshCw } from "lucide-react"

const sections = [
    {
        id: "services-description",
        title: "Services Description",
        icon: Code,
        content: [
            {
                subtitle: "Web Development Services",
                text: "We provide custom web application development, e-commerce solutions, API development, and related technical services using modern frameworks and technologies."
            },
            {
                subtitle: "Data Analytics Services",
                text: "We offer data analysis, business intelligence dashboards, predictive analytics, data visualization, and consulting services to help businesses make data-driven decisions."
            },
            {
                subtitle: "Consulting Services",
                text: "We provide technology consulting, architecture planning, code reviews, and strategic guidance for digital transformation projects."
            }
        ]
    },
    {
        id: "acceptance-terms",
        title: "Acceptance of Terms",
        icon: FileText,
        content: [
            {
                subtitle: "Agreement to Terms",
                text: "By accessing our website, using our services, or entering into a service agreement with us, you agree to be bound by these Terms of Service and all applicable laws and regulations."
            },
            {
                subtitle: "Capacity to Contract",
                text: "You represent that you are at least 18 years old and have the legal capacity to enter into this agreement. If you are acting on behalf of a company, you represent that you have the authority to bind that entity."
            },
            {
                subtitle: "Modifications",
                text: "We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Your continued use of our services constitutes acceptance of any modifications."
            }
        ]
    },
    {
        id: "client-responsibilities",
        title: "Client Responsibilities",
        icon: Users,
        content: [
            {
                subtitle: "Information Accuracy",
                text: "You are responsible for providing accurate, complete, and timely information necessary for us to perform our services. Delays caused by incomplete or inaccurate information may result in additional charges."
            },
            {
                subtitle: "Content and Materials",
                text: "You are responsible for providing all content, materials, and data needed for your project. You warrant that you have the right to use all provided materials and that they do not infringe on any third-party rights."
            },
            {
                subtitle: "Feedback and Approvals",
                text: "You agree to provide timely feedback and approvals as requested. Failure to respond within specified timeframes may result in project delays and additional costs."
            }
        ]
    },
    {
        id: "payment-terms",
        title: "Payment Terms",
        icon: DollarSign,
        content: [
            {
                subtitle: "Pricing and Estimates",
                text: "All pricing is based on initial project scope. Fixed-price quotes are valid for 30 days. Hourly rates apply to additional work beyond the original scope."
            },
            {
                subtitle: "Payment Schedule",
                text: "Projects typically require a 50% deposit to begin work, with the remainder due upon completion. Monthly retainer services are billed in advance. Invoices are due within 30 days of receipt."
            },
            {
                subtitle: "Late Payments",
                text: "Late payments may be subject to a 1.5% monthly service charge. We reserve the right to suspend services for accounts more than 30 days overdue."
            }
        ]
    },
    {
        id: "intellectual-property",
        title: "Intellectual Property",
        icon: Shield,
        content: [
            {
                subtitle: "Client Ownership",
                text: "Upon full payment, you will own the final deliverables created specifically for your project, including custom code, designs, and documentation."
            },
            {
                subtitle: "Our Intellectual Property",
                text: "We retain ownership of our methodologies, tools, templates, and any pre-existing intellectual property used in delivering services."
            },
            {
                subtitle: "Third-Party Components",
                text: "Projects may include third-party libraries, frameworks, or components subject to their respective licenses. We will inform you of any licensing requirements."
            }
        ]
    },
    {
        id: "confidentiality",
        title: "Confidentiality",
        icon: Database,
        content: [
            {
                subtitle: "Mutual Confidentiality",
                text: "Both parties agree to maintain the confidentiality of sensitive information shared during the course of the business relationship."
            },
            {
                subtitle: "Data Security",
                text: "We implement industry-standard security measures to protect your data and will only access your information as necessary to provide services."
            },
            {
                subtitle: "Non-Disclosure",
                text: "We will not disclose your confidential information to third parties without your explicit consent, except as required by law."
            }
        ]
    },
    {
        id: "limitations-liability",
        title: "Limitations of Liability",
        icon: Scale,
        content: [
            {
                subtitle: "Limitation of Damages",
                text: "Our total liability for any claim arising from our services shall not exceed the amount paid by you for the specific services giving rise to the claim."
            },
            {
                subtitle: "No Consequential Damages",
                text: "We shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits or business interruption."
            },
            {
                subtitle: "Time Limitations",
                text: "Any claim must be brought within one year after the cause of action arises or be forever barred."
            }
        ]
    },
    {
        id: "warranties-disclaimers",
        title: "Warranties and Disclaimers",
        icon: AlertTriangle,
        content: [
            {
                subtitle: "Service Warranty",
                text: "We warrant that our services will be performed in a professional manner consistent with industry standards. We will correct any material defects in our work at no additional charge."
            },
            {
                subtitle: "Disclaimer of Other Warranties",
                text: "Except as expressly stated, all services are provided \"as is\" without warranties of any kind, express or implied, including warranties of merchantability or fitness for a particular purpose."
            },
            {
                subtitle: "Third-Party Services",
                text: "We disclaim any warranties regarding third-party services, hosting providers, or external integrations that may be part of your solution."
            }
        ]
    },
    {
        id: "termination",
        title: "Termination",
        icon: RefreshCw,
        content: [
            {
                subtitle: "Termination by Either Party",
                text: "Either party may terminate the service agreement with 30 days written notice. Client remains responsible for payment of all work completed prior to termination."
            },
            {
                subtitle: "Immediate Termination",
                text: "We may immediately terminate services if you breach these terms, fail to make required payments, or engage in activities that could harm our business or reputation."
            },
            {
                subtitle: "Effect of Termination",
                text: "Upon termination, we will deliver all completed work and transfer ownership of paid deliverables. Confidentiality obligations survive termination."
            }
        ]
    }
]

const quickLinks = [
    { title: "Services", href: "#services-description" },
    { title: "Terms Acceptance", href: "#acceptance-terms" },
    { title: "Your Responsibilities", href: "#client-responsibilities" },
    { title: "Payment", href: "#payment-terms" },
    { title: "Intellectual Property", href: "#intellectual-property" },
    { title: "Confidentiality", href: "#confidentiality" },
    { title: "Liability", href: "#limitations-liability" },
    { title: "Warranties", href: "#warranties-disclaimers" },
    { title: "Termination", href: "#termination" }
]

export default function TermsOfServicePage() {
    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <Gavel className="w-4 h-4 mr-2" />
                        Legal Agreement
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        Terms of <span className="text-[#0376aa]">Service</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                        These terms govern the use of our web development and data analytics services.
                        Please read them carefully as they contain important information about your rights and obligations.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Badge className="bg-green-500 text-white px-4 py-2">
                            <Clock className="w-4 h-4 mr-2" />
                            Effective: January 2025
                        </Badge>
                        <Badge className="bg-blue-500 text-white px-4 py-2">
                            <Globe className="w-4 h-4 mr-2" />
                            International Services
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
                        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-3">
                                    <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                                            Legal Agreement
                                        </h3>
                                        <p className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed">
                                            By using our services, you enter into a legally binding agreement. Please read these terms
                                            carefully and contact us if you have any questions before proceeding with our services.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Terms Sections */}
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

                        {/* Additional Legal Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <Globe className="w-5 h-5 text-[#32cf37]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Governing Law</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        These terms are governed by and construed in accordance with applicable local laws.
                                        Any disputes will be resolved through binding arbitration or in courts of competent jurisdiction.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <RefreshCw className="w-5 h-5 text-[#8b5cf6]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Force Majeure</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        Neither party will be liable for delays or failures in performance due to circumstances beyond
                                        their reasonable control, including natural disasters, government actions, or other unforeseeable events.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <Scale className="w-5 h-5 text-[#f59e0b]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Severability</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        If any provision of these terms is found to be unenforceable, the remaining provisions will
                                        continue in full force and effect. Invalid provisions will be replaced with enforceable equivalents.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardHeader>
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-[#ef4444]" />
                                        <CardTitle className="text-lg text-gray-900 dark:text-white">Entire Agreement</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                        These terms, together with any signed service agreement, constitute the entire agreement between
                                        the parties and supersede all prior negotiations, representations, or agreements.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Contact Information */}
                        <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white border-0">
                            <CardContent className="p-8">
                                <div className="text-center">
                                    <Gavel className="w-12 h-12 mx-auto mb-4 opacity-90" />
                                    <h3 className="text-2xl font-bold mb-4">Questions About These Terms?</h3>
                                    <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
                                        If you have any questions about these terms of service or need clarification
                                        on any provisions, please contact us before using our services.
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm opacity-90">
                                        <div>
                                            <strong className="block">Legal Inquiries</strong>
                                            legal@yourportfolio.com
                                        </div>
                                        <div>
                                            <strong className="block">Contract Questions</strong>
                                            contracts@yourportfolio.com
                                        </div>
                                        <div>
                                            <strong className="block">General Contact</strong>
                                            hello@yourportfolio.com
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Disclaimer */}
                        <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                        Legal Disclaimer
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        These terms are provided for informational purposes and constitute a binding legal agreement.
                                        They do not constitute legal advice. If you need legal advice regarding these terms or your
                                        specific situation, please consult with a qualified attorney.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    )
}