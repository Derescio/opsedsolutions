'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
//import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { client } from "@/lib/sanity"
import { POSTS_QUERY, CATEGORIES_QUERY } from "@/lib/queries"
import { BlogPost, Category } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"
//import NewsletterSignup from "@/components/newsletter-signup"

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')

    useEffect(() => {
        async function fetchData() {
            try {
                const [postsData, categoriesData] = await Promise.all([
                    client.fetch(POSTS_QUERY),
                    client.fetch(CATEGORIES_QUERY)
                ])
                setPosts(postsData)
                setFilteredPosts(postsData)
                setCategories(categoriesData)
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        let filtered = posts

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        // Filter by category
        if (selectedCategory) {
            filtered = filtered.filter(post =>
                post.categories.some(cat => cat._id === selectedCategory)
            )
        }

        setFilteredPosts(filtered)
    }, [posts, searchTerm, selectedCategory])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-40 px-4 mt-10">
                <div className="max-w-7xl mx-auto">
                    {/* <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Blogs & <span className="text-[#0376aa]">Insights</span>
                        </h1>
                    </div> */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <Card key={n} className="animate-pulse">
                                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                                <CardContent className="p-6">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto ">
                {/* Header */}
                <div className="text-center mb-12 ">
                    <div className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        {/* <BookOpen className="w-4 h-4 mr-2" />
                        Blog & Insights */}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Blog & <span className="text-[#0376aa]">Insights</span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Deep dives into full-stack development, data analytics, and emerging tech trends
                    </p>
                </div>

                {/* Filters */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-white dark:bg-gray-800"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="md:w-64">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                            >
                                <option value="">All Categories</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Posts Grid */}
                {filteredPosts.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            {posts.length === 0 ? 'No blog posts yet' : 'No posts match your search'}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            {posts.length === 0
                                ? 'Check back soon for fresh content and insights!'
                                : 'Try adjusting your search terms or category filter'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.map((post) => (
                            <Link href={`/blog/${post.slug.current}`} key={post._id}>
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    {post.mainImage && (
                                        <div className="relative h-60 overflow-hidden rounded-t-lg mt-[-1.5rem]">
                                            <Image
                                                src={post.mainImage.asset?.url || '/placeholder-blog.jpg'}
                                                alt={post.mainImage.alt || post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {formatDate(post.publishedAt)}
                                            </div>
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-1" />
                                                {post.estimatedReadingTime} min read
                                            </div>
                                        </div>

                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#0376aa] transition-colors">
                                            {post.title}
                                        </h3>

                                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center justify-between">
                                            {/* <div className="flex flex-wrap gap-2 mt-10">
                                                {post.categories?.slice(0, 2).map((category) => (
                                                    <Badge
                                                        key={category._id}
                                                        variant="secondary"
                                                        className="text-xs bg-[#0376aa]/10 text-[#0376aa] hover:bg-[#0376aa]/20"
                                                    >
                                                        {category.title}
                                                    </Badge>
                                                ))}
                                            </div> */}
                                            <ArrowRight className="w-4 h-4 text-[#0376aa] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {/* Newsletter Signup */}
                {/* {filteredPosts.length > 0 && (
                    <div className="mt-16">
                        <NewsletterSignup variant="compact" />
                    </div>
                )} */}

                {/* Pagination could be added here for large numbers of posts */}
            </div>
        </div>
    )
}