'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowLeft, User, Share2 } from "lucide-react"
import { PortableText, PortableTextComponents } from '@portabletext/react'
import { client } from "@/lib/sanity"
import { POST_QUERY } from "@/lib/queries"
import { BlogPost, ImageBlock, CodeBlock, CalloutBlock } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import RelatedPosts from "@/components/related-posts"
import BlogComments from "@/components/blog-comments"

// Portable Text components for rich content rendering
const portableTextComponents: PortableTextComponents = {
    types: {
        image: ({ value }: { value: ImageBlock }) => (
            <div className="my-8">
                <Image
                    src={value.asset?.url || '/placeholder-blog.jpg'}
                    alt={value.alt || 'Blog image'}
                    width={800}
                    height={400}
                    className="rounded-lg w-full h-auto"
                />
                {value.caption && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
                        {value.caption}
                    </p>
                )}
            </div>
        ),
        codeBlock: ({ value }: { value: CodeBlock }) => (
            <div className="my-6">
                {value.filename && (
                    <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-700">
                        {value.filename}
                    </div>
                )}
                <pre className={`${value.filename ? 'rounded-t-none' : ''} rounded-lg bg-gray-900 text-gray-100 p-4 overflow-x-auto`}>
                    <code className={`language-${value.language || 'text'}`}>
                        {value.code}
                    </code>
                </pre>
            </div>
        ),
        callout: ({ value }: { value: CalloutBlock }) => {
            const bgColors = {
                info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
                warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
                error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
                success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
            }
            const textColors = {
                info: 'text-blue-900 dark:text-blue-100',
                warning: 'text-yellow-900 dark:text-yellow-100',
                error: 'text-red-900 dark:text-red-100',
                success: 'text-green-900 dark:text-green-100',
            }

            return (
                <div className={`my-6 p-4 rounded-lg border ${bgColors[value.type]} ${textColors[value.type]}`}>
                    {value.title && (
                        <h4 className="font-semibold mb-2">{value.title}</h4>
                    )}
                    {value.content && (
                        <p className="text-sm">{value.content}</p>
                    )}
                </div>
            )
        },
    },
    block: {
        h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 mt-8">
                {children}
            </h1>
        ),
        h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6">
                {children}
            </h2>
        ),
        h3: ({ children }) => (
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-4">
                {children}
            </h3>
        ),
        normal: ({ children }) => (
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                {children}
            </p>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#0376aa] pl-6 my-6 italic text-gray-700 dark:text-gray-300">
                {children}
            </blockquote>
        ),
    },
    marks: {
        strong: ({ children }) => (
            <strong className="font-semibold text-gray-900 dark:text-white">
                {children}
            </strong>
        ),
        em: ({ children }) => (
            <em className="italic">{children}</em>
        ),
        link: ({ value, children }) => (
            <a
                href={value?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#0376aa] hover:underline"
            >
                {children}
            </a>
        ),
        code: ({ children }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">
                {children}
            </code>
        ),
    },
    list: {
        bullet: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                {children}
            </ul>
        ),
        number: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                {children}
            </ol>
        ),
    },
}

export default function BlogPostPage() {
    const params = useParams()
    const [post, setPost] = useState<BlogPost | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchPost() {
            try {
                if (!params.slug) return

                const data = await client.fetch(POST_QUERY, { slug: params.slug })

                if (!data) {
                    setError('Post not found')
                    return
                }

                setPost(data)
            } catch {
                console.error('Error fetching post')
                setError('Failed to load post')
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [params.slug])

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const handleShare = async () => {
        if (navigator.share && post) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                })
            } catch {
                // Fallback to copying URL
                navigator.clipboard.writeText(window.location.href)
            }
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-32"></div>
                        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/2"></div>
                        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((n) => (
                                <div key={n} className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !post) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {error || 'Post Not Found'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                    <Link href="/blog">
                        <button className="bg-[#0376aa] text-white hover:bg-[#0376aa]/90 px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Back Button */}
                <Link href="/blog">
                    <button className="inline-flex items-center text-[#0376aa] hover:text-[#0376aa]/80 transition-colors mb-8">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Blog
                    </button>
                </Link>

                {/* Article Header */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
                    <CardContent className="p-8">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.categories.map((category) => (
                                <Badge
                                    key={category._id}
                                    variant="secondary"
                                    className="bg-[#0376aa]/10 text-[#0376aa] hover:bg-[#0376aa]/20"
                                >
                                    {category.title}
                                </Badge>
                            ))}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {post.title}
                        </h1>

                        {/* Excerpt */}
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                            {post.excerpt}
                        </p>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center">
                                <User className="w-4 h-4 mr-2" />
                                {post.author.name}
                            </div>
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(post.publishedAt)}
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {post.estimatedReadingTime} min read
                            </div>
                            <button
                                onClick={handleShare}
                                className="flex items-center hover:text-[#0376aa] transition-colors"
                            >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {/* Featured Image */}
                {post.mainImage && (
                    <div className="relative h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                        <Image
                            src={post.mainImage.asset?.url || '/placeholder-blog.jpg'}
                            alt={post.mainImage.alt || post.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                {/* Article Content */}
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardContent className="p-8">
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <PortableText
                                value={post.body}
                                components={portableTextComponents}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Author Bio */}
                {post.author.bio && (
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mt-8">
                        <CardContent className="p-8">
                            <div className="flex items-start gap-4">
                                {post.author.image && (
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={post.author.image.asset?.url || '/placeholder-avatar.jpg'}
                                            alt={post.author.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                        Author: {post.author.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {post.author.bio}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Related Posts */}
                <div className="mt-12">
                    <RelatedPosts
                        currentPostId={post._id}
                        categories={post.categories.map(cat => cat._id)}
                    />
                </div>

                {/* Comments Section */}
                <div className="mt-12">
                    <BlogComments
                        postTitle={post.title}
                    />
                </div>
            </div>
        </div>
    )
} 