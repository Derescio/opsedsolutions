"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, BarChart3, Code, Database, TrendingUp, Users, ShoppingCart, Calendar, LucideIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"

interface ProjectMetrics {
  [key: string]: string
}

interface Project {
  name: string
  description: string
  technologies: string[]
  github: string
  demo: string
  category: string
  icon: LucideIcon
  metrics: ProjectMetrics
  image: string
}

const webProjects: Project[] = [
  {
    name: "The Kumo - Japanese Restaurant",
    description: "Modern Japanese restaurant website featuring elegant design, online reservations, interactive menu, chef profiles, and customer review system with seamless user experience.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion", "Vercel"],
    github: "#",
    demo: "https://thekumhoapp.vercel.app/",
    category: "Restaurant",
    icon: Calendar,
    metrics: {
      design: "Modern Japanese aesthetic",
      features: "Online reservations & menu",
      performance: "Fast loading & responsive"
    },
    image: "/images/Restaurant.png"
  },
  {
    name: "SmartClock - Time Tracking SaaS",
    description: "Enterprise-grade time tracking platform with GPS verification, real-time analytics, team management, and comprehensive workforce management tools for modern teams.",
    technologies: ["Next.js", "React", "TypeScript", "GPS Integration", "Real-time Analytics", "Enterprise Security"],
    github: "#",
    demo: "https://clockwizard.vercel.app/",
    category: "SaaS Platform",
    icon: Users,
    metrics: {
      accuracy: "GPS-verified clock-ins",
      features: "Real-time tracking & analytics",
      security: "Enterprise-grade security"
    },
    image: "/images/SmartClock.png"
  },
  {
    name: "Shop-DW - Luxury Ecommerce",
    description: "Premium jewelry ecommerce platform with elegant product showcases, shopping cart, blog integration, and comprehensive product management for luxury retail.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Content Management", "SEO Optimization"],
    github: "#",
    demo: "https://www.shop-dw.com/",
    category: "E-Commerce",
    icon: ShoppingCart,
    metrics: {
      products: "Premium jewelry collection",
      features: "Full ecommerce functionality",
      design: "Luxury brand aesthetic"
    },
    image: "/images/Shop.png"
  },
]

const dataProjects: Project[] = [
  {
    name: "Predictive Sales Analytics Platform",
    description: "Machine learning-powered sales forecasting system with interactive dashboards, providing 90% accuracy in quarterly predictions.",
    technologies: ["Python", "TensorFlow", "Pandas", "Plotly", "PostgreSQL", "Docker", "Airflow"],
    github: "#",
    demo: "#",
    category: "Predictive Analytics",
    icon: TrendingUp,
    metrics: {
      accuracy: "90% prediction accuracy",
      revenue: "$2M+ revenue impact",
      efficiency: "75% faster forecasting"
    },

    image: "/images/maxim-tolchinskiy-NBhIaEGgK48-unsplash.jpg"
  },
  {
    name: "Customer Intelligence Dashboard",
    description: "Advanced customer segmentation and behavior analysis platform with real-time insights and automated marketing recommendations.",
    technologies: ["Python", "Scikit-learn", "Tableau", "Apache Spark", "AWS", "Snowflake"],
    github: "#",
    demo: "#",
    category: "Business Intelligence",
    icon: BarChart3,
    metrics: {
      segments: "15+ customer segments",
      engagement: "35% increase in engagement",
      retention: "20% improvement in retention"
    },
    image: "/images/carlos-muza-hpjSkU2UYSU-unsplash.jpg"
  },
  {
    name: "Financial Risk Assessment Engine",
    description: "AI-powered risk assessment system for loan approvals with ensemble learning models and real-time decision making capabilities.",
    technologies: ["Python", "XGBoost", "Apache Kafka", "PostgreSQL", "Docker", "Kubernetes"],
    github: "#",
    demo: "#",
    category: "Financial Analytics",
    icon: Database,
    metrics: {
      accuracy: "95% risk prediction accuracy",
      speed: "Sub-second decisions",
      reduction: "40% default rate reduction"
    },
    image: "/images/kaleidico-3V8xo5Gbusk-unsplash.jpg"
  },
]

function ProjectCard({ project, categoryColor }: { project: Project, categoryColor: string }) {
  const Icon = project.icon

  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-700 group overflow-hidden bg-white dark:bg-gray-800"
    >
      {/* Project Image/Visual */}
      <div className="relative md:h-48 h-40 overflow-hidden rounded-t-lg -mt-6">
        <Image
          src={project.image}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute top-4 left-4">
          <Badge
            className="text-white border-0"
            style={{ backgroundColor: categoryColor }}
          >
            {project.category}
          </Badge>
        </div>
        <div className="absolute bottom-4 right-4">
          <Icon className="w-8 h-8 text-white opacity-80" />
        </div>
      </div>

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl text-gray-900 dark:text-white mb-2 group-hover:text-[#0376aa] transition-colors">
              {project.name}
            </CardTitle>
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

        {/* Action Button */}
        <div className="pt-4">
          <Button
            size="sm"
            className="w-full text-white transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: categoryColor }}
            onClick={() => window.open(project.demo, '_blank')}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View Live Project
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState<'all' | 'web' | 'data'>('all')

  const tabs = [
    { id: 'all', label: 'All Projects', count: webProjects.length + dataProjects.length },
    { id: 'web', label: 'Web Development', count: webProjects.length },
    { id: 'data', label: 'Data Analytics', count: dataProjects.length },
  ]

  return (
    <section id="projects" className="py-20 px-4 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[#0da1e5] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
            <Code className="w-4 h-4 mr-2" />
            Portfolio Showcase
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Featured <span className="text-[#0376aa]">Projects</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Live applications showcasing expertise in modern web development, from restaurant management
            to SaaS platforms and ecommerce solutions
          </p>
        </div>

        {/* Project Filter Tabs */}
        <div className="flex justify-center mb-12 px-2">
          <div className="inline-flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-full max-w-2xl overflow-x-auto">
            <div className="flex w-full min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'all' | 'web' | 'data')}
                  className={`flex-1 min-w-0 px-3 sm:px-6 py-3 rounded-md font-medium transition-all duration-300 text-sm sm:text-base whitespace-nowrap ${activeTab === tab.id
                    ? 'bg-white dark:bg-gray-800 text-[#0376aa] shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === 'all' ? 'All' : tab.id === 'web' ? 'Web' : 'Data'}
                  </span>
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-70">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="space-y-16">
          {/* Web Development Projects */}
          {(activeTab === 'all' || activeTab === 'web') && (
            <div>
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#0376aa]/10 rounded-lg">
                    <Code className="w-6 h-6 sm:w-8 sm:h-8 text-[#0376aa]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0376aa] text-center">
                    Full-Stack Development
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {webProjects.map((project) => (
                  <ProjectCard key={project.name} project={project} categoryColor="#0376aa" />
                ))}
              </div>
            </div>
          )}

          {/* Data Analytics Projects */}
          {(activeTab === 'all' || activeTab === 'data') && (
            <div>
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-[#32cf37]/10 rounded-lg">
                    <Database className="w-6 h-6 sm:w-8 sm:h-8 text-[#32cf37]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#32cf37] text-center">
                    Data Analytics & Intelligence
                  </h3>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {dataProjects.map((project) => (
                  <ProjectCard key={project.name} project={project} categoryColor="#32cf37" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-600">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Build Something Amazing?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
              Let&apos;s discuss your project requirements and create a solution that drives real business results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-6 sm:px-8 py-3"
                //onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Start Your Project
                </Button>
              </Link>
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-6 sm:px-8 py-3 dark:border-[#32cf37] dark:text-[#32cf37]"
                >
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
