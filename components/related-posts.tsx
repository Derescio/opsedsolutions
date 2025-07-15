'use client'
import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { client } from "@/lib/sanity"
import { BlogPost } from "@/lib/types"
import Link from "next/link"
import Image from "next/image"

interface RelatedPostsProps {
    currentPostId: string
    categories: string[]
    maxPosts?: number
}

export default function RelatedPosts({ currentPostId, categories, maxPosts = 3 }: RelatedPostsProps) {
    const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchRelatedPosts() {
            try {
                const categoryRefs = categories.map(id => `"${id}"`).join(',')

                const query = `*[
          _type == "post" && 
          _id != "${currentPostId}" && 
          count((categories[]._ref)[@ in [${categoryRefs}]]) > 0
        ] | order(publishedAt desc) [0...${maxPosts}] {
          _id,
          title,
          slug,
          excerpt,
          mainImage {
            asset -> {
              _id,
              url
            },
            alt
          },
          publishedAt,
          author -> {
            name,
            image {
              asset -> {
                _id,
                url
              }
            }
          },
          categories[] -> {
            _id,
            title,
            slug
          },
          "estimatedReadingTime": round(length(pt::text(body)) / 5 / 180 )
        }`

                const data = await client.fetch(query)
                setRelatedPosts(data)
            } catch (error) {
                console.error('Error fetching related posts:', error)
            } finally {
                setLoading(false)
            }
        }

        if (categories.length > 0) {
            fetchRelatedPosts()
        } else {
            setLoading(false)
        }
    }, [currentPostId, categories, maxPosts])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <Card key={n} className="animate-pulse">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (relatedPosts.length === 0) {
        return null
    }

    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((post) => (
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

                                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#0376aa] transition-colors line-clamp-2">
                                    {post.title}
                                </h4>

                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm">
                                    {post.excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {post.categories?.slice(0, 1).map((category) => (
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
        </div>
    )
} 