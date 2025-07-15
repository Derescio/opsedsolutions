'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react"
import { client } from "@/lib/sanity"
import { POSTS_QUERY } from "@/lib/queries"
import { BlogPost } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

export default function Blog() {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchPosts() {
            try {
                const data = await client.fetch(POSTS_QUERY)
                setPosts(data.slice(0, 3)) // Show only 3 recent posts
            } catch (error) {
                console.error('Error fetching posts:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <section id="blog" className="py-20 px-4 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Blog & Insights
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                            Latest <span className="text-[#0376aa]">Articles</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((n) => (
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
            </section>
        )
    }

    return (
        <section id="blog" className="py-20 px-4 bg-white dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-full text-[#0376aa] font-medium mb-6 border border-[#0376aa]/20 shadow-sm">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Blog & Insights
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Latest <span className="text-[#0376aa]">Articles</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Sharing insights on full-stack development, data analytics, and the latest tech trends
                    </p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            No blog posts yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500">
                            Check back soon for fresh content and insights!
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link href={`/blog/${post.slug.current}`} key={post._id}>
                                <Card className="h-full hover:shadow-lg transition-shadow duration-300 group cursor-pointer bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                    {post.mainImage && (
                                        <div className="relative h-48 overflow-hidden rounded-t-lg">
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
                                            <div className="flex flex-wrap gap-2">
                                                {post.categories?.slice(0, 2).map((category) => (
                                                    <Badge
                                                        key={category._id}
                                                        variant="secondary"
                                                        className="text-xs bg-[#0376aa]/10 text-[#0376aa] hover:bg-[#0376aa]/20"
                                                    >
                                                        {category.title}
                                                    </Badge>
                                                ))}
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-[#0376aa] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {posts.length > 0 && (
                    <div className="text-center mt-12">
                        <Link href="/blog">
                            <button className="bg-[#0376aa] text-white hover:bg-[#0376aa]/90 px-8 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                                View All Articles
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
} 