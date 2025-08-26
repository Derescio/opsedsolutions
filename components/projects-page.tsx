"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, BarChart3, Code, Database, TrendingUp, Users, ShoppingCart, Calendar, LucideIcon, Smartphone, Brain, Search, Filter, Github } from "lucide-react"
import Image from "next/image"
import { useState, useMemo } from "react"
import Link from "next/link"

interface ProjectMetrics {
    [key: string]: string
}

interface Project {
    id: string
    name: string
    description: string
    technologies: string[]
    github: string
    demo: string
    category: string
    subcategory: string
    icon: LucideIcon
    metrics: ProjectMetrics
    image: string
    status: 'live' | 'development' | 'archived'
    featured: boolean
    year: number
}

const allProjects: Project[] = [
    // Restaurant & Food
    {
        id: "kumo-restaurant",
        name: "The Kumo - Japanese Restaurant",
        description: "Modern Japanese restaurant website featuring elegant design, online reservations, interactive menu, chef profiles, and customer review system with seamless user experience.",
        technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
        github: "#",
        demo: "https://thekumhoapp.vercel.app/",
        category: "Web Development",
        subcategory: "Restaurant",
        icon: Calendar,
        metrics: {
            design: "Modern Japanese aesthetic",
            features: "Online reservations & menu",
            performance: "Fast loading & responsive"
        },
        image: "/images/Restaurant.png",
        status: "live",
        featured: true,
        year: 2024
    },
    {
        id: "torontosaunaco",
        name: "Sauna and Wellness Web App",
        description: "Full-stack sauna and wellness application with real-time booking, payment integration, user profiles, and service management.",
        technologies: ["Node.js", "Express", "MongoDB", "Google Tag Manager"],
        github: "#",
        demo: "https://www.thetorontosaunaco.com/",
        category: "Web Development",
        subcategory: "Health & Wellness",
        icon: ShoppingCart,
        metrics: {
            orders: "100+",
            users: "50+ active users",
            delivery: "Quick turnaround time"
        },
        image: "/images/TorontoSaunaCo.png",
        status: "live",
        featured: true,
        year: 2024
    },

    // SaaS & Business
    {
        id: "smartclock-saas",
        name: "SmartClock - Time Tracking SaaS",
        description: "Enterprise-grade time tracking platform with GPS verification, real-time analytics, team management, and comprehensive workforce management tools for modern teams.",
        technologies: ["Next.js", "React", "TypeScript", "GPS Integration", "Real-time Analytics", "Enterprise Security"],
        github: "#",
        demo: "https://clockwizard.vercel.app/",
        category: "Web Development",
        subcategory: "SaaS Platform",
        icon: Users,
        metrics: {
            accuracy: "GPS-verified clock-ins",
            features: "Real-time tracking & analytics",
            security: "Enterprise-grade security"
        },
        image: "/images/SmartClock.png",
        status: "development",
        featured: true,
        year: 2024
    },
    // {
    //     id: "project-management-tool",
    //     name: "TaskMaster Pro - Project Management",
    //     description: "Comprehensive project management solution with Kanban boards, Gantt charts, team collaboration, time tracking, and advanced reporting capabilities.",
    //     technologies: ["Vue.js", "Laravel", "MySQL", "Redis", "WebSocket", "Docker"],
    //     github: "#",
    //     demo: "#",
    //     category: "Web Development",
    //     subcategory: "Business Tools",
    //     icon: BarChart3,
    //     metrics: {
    //         projects: "1000+ active projects",
    //         users: "5000+ registered users",
    //         efficiency: "40% productivity increase"
    //     },
    //     image: "/images/kaleidico-3V8xo5Gbusk-unsplash.jpg",
    //     status: "live",
    //     featured: false,
    //     year: 2023
    // },

    // E-Commerce
    {
        id: "shop-dw-luxury",
        name: "Shop-DW - Luxury Ecommerce",
        description: "Premium jewelry ecommerce platform with elegant product showcases, shopping cart, blog integration, and comprehensive product management for luxury retail.",
        technologies: ["React", "Node.js", "MongoDB", "Stripe", "Content Management", "SEO Optimization"],
        github: "#",
        demo: "https://www.shop-dw.com/",
        category: "Web Development",
        subcategory: "E-Commerce",
        icon: ShoppingCart,
        metrics: {
            products: "Premium jewelry collection",
            features: "Full ecommerce functionality",
            design: "Luxury brand aesthetic"
        },
        image: "/images/Shop.png",
        status: "live",
        featured: true,
        year: 2024
    },
    {
        id: "movie-streaming-platform",
        name: "CineMagic - Movie Streaming Platform",
        description: "Subscription-based movie streaming platform with personalized recommendations, offline viewing, and multi-device support.",
        technologies: ["JS", "HTML", "CSS", "AXIOS", "API"],
        github: "#",
        demo: "https://whimsical-smakager-78ff41.netlify.app/",
        category: "Web Development",
        subcategory: "Streaming",
        icon: Users,
        metrics: {
            vendors: "200+ active vendors",
            products: "10,000+ movie and tv shows",

        },
        image: "/images/Movie_App.png",
        status: "live",
        featured: false,
        year: 2023
    },

    // Data Analytics
    // {
    //     id: "predictive-sales-analytics",
    //     name: "Predictive Sales Analytics Platform",
    //     description: "Machine learning-powered sales forecasting system with interactive dashboards, providing 90% accuracy in quarterly predictions.",
    //     technologies: ["Python", "TensorFlow", "Pandas", "Plotly", "PostgreSQL", "Docker", "Airflow"],
    //     github: "#",
    //     demo: "#",
    //     category: "Data Analytics",
    //     subcategory: "Predictive Analytics",
    //     icon: TrendingUp,
    //     metrics: {
    //         accuracy: "90% prediction accuracy",
    //         revenue: "$2M+ revenue impact",
    //         efficiency: "75% faster forecasting"
    //     },
    //     image: "/images/maxim-tolchinskiy-NBhIaEGgK48-unsplash.jpg",
    //     status: "live",
    //     featured: true,
    //     year: 2024
    // },
    // {
    //     id: "customer-intelligence",
    //     name: "Customer Intelligence Dashboard",
    //     description: "Advanced customer segmentation and behavior analysis platform with real-time insights and automated marketing recommendations.",
    //     technologies: ["Python", "Scikit-learn", "Tableau", "Apache Spark", "AWS", "Snowflake"],
    //     github: "#",
    //     demo: "#",
    //     category: "Data Analytics",
    //     subcategory: "Business Intelligence",
    //     icon: BarChart3,
    //     metrics: {
    //         segments: "15+ customer segments",
    //         engagement: "35% increase in engagement",
    //         retention: "20% improvement in retention"
    //     },
    //     image: "/images/carlos-muza-hpjSkU2UYSU-unsplash.jpg",
    //     status: "live",
    //     featured: true,
    //     year: 2024
    // },
    // {
    //     id: "financial-risk-assessment",
    //     name: "Financial Risk Assessment Engine",
    //     description: "AI-powered risk assessment system for loan approvals with ensemble learning models and real-time decision making capabilities.",
    //     technologies: ["Python", "XGBoost", "Apache Kafka", "PostgreSQL", "Docker", "Kubernetes"],
    //     github: "#",
    //     demo: "#",
    //     category: "Data Analytics",
    //     subcategory: "Financial Analytics",
    //     icon: Database,
    //     metrics: {
    //         accuracy: "95% risk prediction accuracy",
    //         speed: "Sub-second decisions",
    //         reduction: "40% default rate reduction"
    //     },
    //     image: "/images/kaleidico-3V8xo5Gbusk-unsplash.jpg",
    //     status: "live",
    //     featured: true,
    //     year: 2024
    // },

    // API & Backend
    // {
    //     id: "api-gateway-platform",
    //     name: "CloudAPI - Gateway Platform",
    //     description: "Scalable API gateway with authentication, rate limiting, analytics, and microservices orchestration for enterprise applications.",
    //     technologies: ["Node.js", "GraphQL", "Redis", "Docker", "Kubernetes", "JWT", "OpenAPI"],
    //     github: "#",
    //     demo: "#",
    //     category: "Backend Development",
    //     subcategory: "API Services",
    //     icon: Database,
    //     metrics: {
    //         requests: "1M+ requests/day",
    //         uptime: "99.9% availability",
    //         latency: "< 50ms response time"
    //     },
    //     image: "/images/pawel-czerwinski-Eru5-VMQZT8-unsplash.jpg",
    //     status: "live",
    //     featured: false,
    //     year: 2023
    // },

    // AI & Machine Learning
    // {
    //     id: "chatbot-platform",
    //     name: "IntelliChat - AI Customer Service",
    //     description: "Advanced conversational AI platform with natural language processing, multi-language support, and seamless human handoff capabilities.",
    //     technologies: ["Python", "OpenAI GPT", "FastAPI", "WebSocket", "React", "Redis", "PostgreSQL"],
    //     github: "#",
    //     demo: "#",
    //     category: "AI & Machine Learning",
    //     subcategory: "Conversational AI",
    //     icon: Brain,
    //     metrics: {
    //         accuracy: "95% intent recognition",
    //         languages: "12 languages supported",
    //         resolution: "80% automated resolution"
    //     },
    //     image: "/images/milad-fakurian-h2OGkmktW5k-unsplash.jpg",
    //     status: "development",
    //     featured: true,
    //     year: 2024
    // },

    // Mobile Apps
    // {
    //     id: "fitness-tracker-app",
    //     name: "FitTrack - Personal Fitness",
    //     description: "Comprehensive fitness tracking mobile app with workout plans, nutrition tracking, progress analytics, and social features.",
    //     technologies: ["React Native", "Firebase", "Redux", "Chart.js", "Health Kit", "Google Fit"],
    //     github: "#",
    //     demo: "#",
    //     category: "Mobile Development",
    //     subcategory: "Health & Fitness",
    //     icon: Smartphone,
    //     metrics: {
    //         users: "10,000+ active users",
    //         workouts: "50,000+ completed workouts",
    //         retention: "70% monthly retention"
    //     },
    //     image: "/images/andrei-castanha-TDXqGd7JI2o-unsplash (1).jpg",
    //     status: "live",
    //     featured: false,
    //     year: 2023
    // }
]

const categoryColors = {
    "Web Development": "#0376aa",
    "Mobile Development": "#8b5cf6",
    "Data Analytics": "#32cf37",
    "Backend Development": "#f59e0b",
    "AI & Machine Learning": "#ef4444",
}

function ProjectCard({ project }: { project: Project }) {
    const categoryColor = categoryColors[project.category as keyof typeof categoryColors] || "#6b7280"
    const Icon = project.icon

    return (
        <Card className="h-full hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-700 group overflow-hidden bg-white dark:bg-gray-800">
            {/* Project Image/Visual */}
            <div className="relative h-48 overflow-hidden rounded-t-lg -mt-6">
                <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                    <Badge
                        className={`text-white border-0 ${project.status === 'live' ? 'bg-green-500' :
                            project.status === 'development' ? 'bg-yellow-500' : 'bg-gray-500'
                            }`}
                    >
                        {project.status === 'live' ? 'Live' : project.status === 'development' ? 'In Development' : 'Archived'}
                    </Badge>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                    <div className="absolute top-4 right-4">
                        <Badge className="bg-purple-500 text-white border-0">
                            Featured
                        </Badge>
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                    <Badge
                        className="text-white border-0"
                        style={{ backgroundColor: categoryColor }}
                    >
                        {project.subcategory}
                    </Badge>
                </div>

                <div className="absolute bottom-4 right-4">
                    <Icon className="w-8 h-8 text-white opacity-80" />
                </div>
            </div>

            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl text-gray-900 dark:text-white group-hover:text-[#0376aa] transition-colors">
                                {project.name}
                            </CardTitle>
                            <span className="text-sm text-gray-500 dark:text-gray-400">({project.year})</span>
                        </div>
                        <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                            {project.description}
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Metrics */}
                <div className="grid grid-cols-1 gap-3">
                    {Object.entries(project.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 capitalize">{key}</span>
                            <span className="text-xs font-bold" style={{ color: categoryColor }}>{value}</span>
                        </div>
                    ))}
                </div>

                {/* Technologies */}
                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                            <Badge key={tech} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs">
                                {tech}
                            </Badge>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 space-y-2">
                    {project.demo !== "#" && (
                        <Button
                            size="sm"
                            className="w-full text-white transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: categoryColor }}
                            onClick={() => window.open(project.demo, '_blank')}
                        >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Live Project
                        </Button>
                    )}
                    {project.github !== "#" && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="w-full"
                            onClick={() => window.open(project.github, '_blank')}
                        >
                            <Github className="mr-2 h-4 w-4" />
                            View Source Code
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("all")
    const [selectedStatus, setSelectedStatus] = useState<string>("all")
    const [selectedYear, setSelectedYear] = useState<string>("all")
    const [sortBy, setSortBy] = useState<string>("year-desc")
    const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

    const categories = Array.from(new Set(allProjects.map(p => p.category)))
    const years = Array.from(new Set(allProjects.map(p => p.year))).sort((a, b) => b - a)

    const filteredAndSortedProjects = useMemo(() => {
        const filtered = allProjects.filter(project => {
            const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))

            const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
            const matchesStatus = selectedStatus === "all" || project.status === selectedStatus
            const matchesYear = selectedYear === "all" || project.year.toString() === selectedYear
            const matchesFeatured = !showFeaturedOnly || project.featured

            return matchesSearch && matchesCategory && matchesStatus && matchesYear && matchesFeatured
        })

        // Sort projects
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "year-desc":
                    return b.year - a.year
                case "year-asc":
                    return a.year - b.year
                case "name-asc":
                    return a.name.localeCompare(b.name)
                case "name-desc":
                    return b.name.localeCompare(a.name)
                case "featured":
                    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
                default:
                    return 0
            }
        })

        return filtered
    }, [searchQuery, selectedCategory, selectedStatus, selectedYear, sortBy, showFeaturedOnly])

    const projectStats = {
        total: allProjects.length,
        live: allProjects.filter(p => p.status === 'live').length,
        development: allProjects.filter(p => p.status === 'development').length,
        featured: allProjects.filter(p => p.featured).length
    }

    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0da1e5] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <Code className="w-4 h-4 mr-2" />
                        Complete Portfolio
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        My <span className="text-[#0376aa]">Project</span> Portfolio
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto mb-8">
                        Explore my comprehensive collection of web applications, mobile apps, data analytics projects,
                        and AI-powered solutions that solve real-world problems.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-[#0376aa]">{projectStats.total}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Total Projects</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-green-500">{projectStats.live}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Live Projects</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-yellow-500">{projectStats.development}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">In Development</div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                            <div className="text-2xl font-bold text-purple-500">{projectStats.featured}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Featured</div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="mb-12 space-y-6">
                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search projects by name, description, or technology..."
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

                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-36">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="live">Live</SelectItem>
                                <SelectItem value="development">In Development</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Years</SelectItem>
                                {years.map(year => (
                                    <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="year-desc">Newest First</SelectItem>
                                <SelectItem value="year-asc">Oldest First</SelectItem>
                                <SelectItem value="name-asc">Name A-Z</SelectItem>
                                <SelectItem value="name-desc">Name Z-A</SelectItem>
                                <SelectItem value="featured">Featured First</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button
                            variant={showFeaturedOnly ? "default" : "outline"}
                            size="sm"
                            onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                            className={showFeaturedOnly ? "bg-purple-500 hover:bg-purple-600" : ""}
                        >
                            Featured Only
                        </Button>
                    </div>
                </div>

                {/* Results Count */}
                <div className="text-center mb-8">
                    <p className="text-gray-600 dark:text-gray-300">
                        Showing <span className="font-semibold text-[#0376aa]">{filteredAndSortedProjects.length}</span> of {allProjects.length} projects
                    </p>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {filteredAndSortedProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>

                {/* No Results */}
                {filteredAndSortedProjects.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <Search className="w-16 h-16 mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Try adjusting your search criteria or filters to find what you&apos;re looking for.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchQuery("")
                                setSelectedCategory("all")
                                setSelectedStatus("all")
                                setSelectedYear("all")
                                setShowFeaturedOnly(false)
                            }}
                            variant="outline"
                        >
                            Clear All Filters
                        </Button>
                    </div>
                )}

                {/* Bottom CTA */}
                <div className="mt-16 text-center">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Let&apos;s Build Your Next Project Together
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            Ready to bring your vision to life? I specialize in creating custom solutions
                            that drive results and exceed expectations.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <Button
                                    size="lg"
                                    className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-8 py-3"
                                >
                                    Start Your Project
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-8 py-3"
                                >
                                    View Services
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}