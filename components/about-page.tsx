"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Code,
    Database,
    TrendingUp,
    Users,
    Award,
    Coffee,
    Calendar,
    BookOpen,
    Heart,
    Target,
    Lightbulb,
    Zap,
    Brain,
    Clock,
    MapPin,
    CheckCircle,
    ArrowRight,
    Github,
    Linkedin,
    Mail
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const journey = [
    {
        year: "2019",
        title: "The Beginning",
        description: "Started my self-taught journey into web development, driven by curiosity and passion for creating digital solutions.",
        icon: BookOpen,
        color: "#0376aa"
    },
    {
        year: "2020",
        title: "Life Changes",
        description: "In August 2020, I became disabled. Instead of letting this define my limits, I used it as motivation to expand my skills and adapt my approach.",
        icon: Heart,
        color: "#ef4444"
    },
    {
        year: "2021-2022",
        title: "Continuous Growth",
        description: "Deepened my full-stack development expertise while discovering a passion for data analytics and business intelligence.",
        icon: TrendingUp,
        color: "#32cf37"
    },
    {
        year: "2023-Present",
        title: "Dual Expertise",
        description: "Now combining 5+ years of development experience with advanced data analytics to deliver comprehensive solutions.",
        icon: Zap,
        color: "#8b5cf6"
    }
]

const skills = [
    {
        name: "Full-Stack Development",
        category: "Web Development",
        icon: Code,
        color: "#0376aa",
        description: "5+ years building scalable web applications"
    },
    {
        name: "Data Analytics",
        category: "Analytics",
        icon: Database,
        color: "#32cf37",
        description: "Transforming data into actionable insights"
    },
    {
        name: "Self-Directed Learning",
        category: "Personal Growth",
        icon: Brain,
        color: "#8b5cf6",
        description: "Mastering new technologies independently"
    },
    {
        name: "Problem Solving",
        category: "Core Skill",
        icon: Lightbulb,
        color: "#f59e0b",
        description: "Creative solutions to complex challenges"
    },
    {
        name: "Resilience & Adaptability",
        category: "Personal Strength",
        icon: Target,
        color: "#ef4444",
        description: "Thriving through challenges and change"
    },
    {
        name: "Business Intelligence",
        category: "Strategy",
        icon: Coffee,
        color: "#06b6d4",
        description: "Connecting data to business outcomes"
    }
]

const technologies = [
    { name: "React", category: "Frontend", level: "Expert" },
    { name: "Next.js", category: "Framework", level: "Expert" },
    { name: "TypeScript", category: "Language", level: "Advanced" },
    { name: "Node.js", category: "Backend", level: "Advanced" },
    { name: "Python", category: "Language", level: "Advanced" },
    { name: "PostgreSQL", category: "Database", level: "Advanced" },
    { name: "MongoDB", category: "Database", level: "Intermediate" },
    { name: "Pandas", category: "Data Science", level: "Advanced" },
    { name: "Tableau", category: "Visualization", level: "Advanced" },
    { name: "AWS", category: "Cloud", level: "Intermediate" },
    { name: "Docker", category: "DevOps", level: "Intermediate" },
    { name: "TensorFlow", category: "ML/AI", level: "Intermediate" }
]

const achievements = [
    { metric: "5+", label: "Years Self-Taught", icon: Clock },
    { metric: "50+", label: "Projects Built", icon: Code },
    { metric: "2", label: "Core Specialties", icon: Target },
    { metric: "100%", label: "Self-Motivated", icon: Heart }
]

const values = [
    {
        title: "Continuous Learning",
        description: "Every challenge is an opportunity to grow and master new skills.",
        icon: BookOpen
    },
    {
        title: "Accessibility First",
        description: "Building inclusive solutions that work for everyone, regardless of ability.",
        icon: Users
    },
    {
        title: "Data-Driven Decisions",
        description: "Using analytics and insights to guide development and business strategy.",
        icon: Database
    },
    {
        title: "Resilient Problem Solving",
        description: "Finding creative solutions even when faced with significant obstacles.",
        icon: Lightbulb
    }
]

export default function AboutPage() {
    return (
        <section className="py-20 px-4 bg-white dark:bg-gray-900 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
                        {/* Profile Image */}
                        <div className="lg:col-span-2 flex justify-center">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#0376aa] to-[#32cf37] rounded-2xl rotate-3"></div>
                                <div className="relative bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-2xl">
                                    <Image
                                        src="/images/NEW_LOOK.jpg"
                                        alt="Professional portrait"
                                        width={400}
                                        height={500}
                                        className="rounded-xl object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0376aa] font-medium border border-[#0376aa]/20 shadow-sm">
                                <Users className="w-4 h-4 mr-2" />
                                Full-Stack Developer & Data Analyst
                            </div>

                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                                Hi, I&apos;m <span className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] bg-clip-text text-transparent">Your Developer</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                A self-taught full-stack developer with 5+ years of experience, who discovered the power of data analytics
                                after navigating life&apos;s challenges. I combine technical expertise with resilience to build solutions that matter.
                            </p>

                            <div className="flex flex-wrap gap-3">
                                <Badge className="bg-[#0376aa] text-white px-4 py-2">
                                    <Code className="w-4 h-4 mr-2" />
                                    5+ Years Development
                                </Badge>
                                <Badge className="bg-[#32cf37] text-white px-4 py-2">
                                    <Database className="w-4 h-4 mr-2" />
                                    Data Analytics Expert
                                </Badge>
                                <Badge className="bg-[#8b5cf6] text-white px-4 py-2">
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    Self-Taught
                                </Badge>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Link href="/contact">
                                    <Button size="lg" className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-8">
                                        <Mail className="mr-2 h-5 w-5" />
                                        Let&apos;s Work Together
                                    </Button>
                                </Link>
                                <Link href="/projects">
                                    <Button size="lg" variant="outline" className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-8">
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        View My Work
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Journey Timeline */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            My <span className="text-[#0376aa]">Journey</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            From curiosity-driven learning to overcoming challenges, here&apos;s how I became the developer I am today.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {journey.map((step, index) => {
                            const Icon = step.icon
                            return (
                                <Card key={step.year} className="relative overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                                    <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: step.color }}></div>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div
                                                className="p-3 rounded-lg"
                                                style={{ backgroundColor: `${step.color}15` }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: step.color }} />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg text-gray-900 dark:text-white">{step.title}</CardTitle>
                                                <Badge variant="secondary" className="mt-1">{step.year}</Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Skills & Expertise */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            Skills & <span className="text-[#32cf37]">Expertise</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            A unique blend of technical skills and personal strengths, developed through years of dedicated learning and real-world challenges.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {skills.map((skill) => {
                            const Icon = skill.icon
                            return (
                                <Card key={skill.name} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div
                                                className="p-3 rounded-lg group-hover:scale-110 transition-transform"
                                                style={{ backgroundColor: `${skill.color}15` }}
                                            >
                                                <Icon className="w-6 h-6" style={{ color: skill.color }} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {skill.name}
                                                </h3>
                                                <Badge variant="secondary" className="mb-3 text-xs">
                                                    {skill.category}
                                                </Badge>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                                    {skill.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>

                    {/* Technologies */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl text-gray-900 dark:text-white">
                                Technologies & Tools
                            </CardTitle>
                            <CardDescription>
                                Technologies I&apos;ve mastered through hands-on learning and real-world projects
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {technologies.map((tech) => (
                                    <div key={tech.name} className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="text-white font-bold text-lg">{tech.name.charAt(0)}</span>
                                        </div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{tech.name}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tech.level}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Values & Approach */}
                <div className="mb-20">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            My <span className="text-[#8b5cf6]">Values</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            The principles that guide my work and the approach I bring to every project.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value) => {
                            const Icon = value.icon
                            return (
                                <Card key={value.title} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
                                    <CardContent className="p-8">
                                        <div className="flex items-start space-x-4">
                                            <div className="p-3 bg-gradient-to-br from-[#0376aa] to-[#32cf37] rounded-lg">
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                                                    {value.title}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                                    {value.description}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </div>

                {/* Achievements */}
                <div className="mb-20">
                    <Card className="bg-gradient-to-r from-[#0376aa] to-[#32cf37] text-white border-0">
                        <CardContent className="p-12">
                            <div className="text-center mb-8">
                                <h3 className="text-3xl font-bold mb-4">By the Numbers</h3>
                                <p className="text-lg opacity-90">
                                    Metrics that reflect my journey of continuous growth and dedication
                                </p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                {achievements.map((achievement) => {
                                    const Icon = achievement.icon
                                    return (
                                        <div key={achievement.label} className="text-center">
                                            <Icon className="w-8 h-8 mx-auto mb-4 opacity-80" />
                                            <div className="text-4xl font-bold mb-2">{achievement.metric}</div>
                                            <div className="text-sm opacity-90 font-medium">{achievement.label}</div>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Personal Note */}
                <div className="mb-20">
                    <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-8 md:p-12">
                            <div className="max-w-4xl mx-auto text-center">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    Why I Do What I Do
                                </h3>
                                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <p>
                                        My journey hasn&apos;t been conventional. Becoming disabled in 2020 could have been a setback,
                                        but instead, it became a catalyst for growth. It taught me that limitations are often just
                                        opportunities to find new paths.
                                    </p>
                                    <p>
                                        Every line of code I write and every data insight I uncover is driven by the belief that
                                        technology should empower everyone. Whether it&apos;s building accessible web applications or
                                        creating data visualizations that make complex information understandable, I&apos;m passionate
                                        about using my skills to make a meaningful impact.
                                    </p>
                                    <p className="text-xl font-semibold text-[#0376aa]">
                                        &ldquo;Challenges don&apos;t define us – how we respond to them does.&rdquo;
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section */}
                <div className="text-center">
                    <Card className="bg-white dark:bg-gray-800 border-2 border-[#0376aa]/20">
                        <CardContent className="p-12">
                            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Let&apos;s Build Something Amazing Together
                            </h3>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Whether you need a robust web application, insightful data analytics, or someone who brings
                                both technical expertise and a unique perspective to your team.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/contact">
                                    <Button size="lg" className="bg-[#0376aa] hover:bg-[#025a8a] text-white px-8 py-4">
                                        <Mail className="mr-2 h-5 w-5" />
                                        Start a Conversation
                                    </Button>
                                </Link>
                                <Link href="/services">
                                    <Button size="lg" variant="outline" className="border-[#32cf37] text-[#32cf37] hover:bg-[#32cf37] hover:text-white px-8 py-4">
                                        <ArrowRight className="mr-2 h-5 w-5" />
                                        Explore Services
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