'use client'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MessageCircle, User, Calendar, Heart } from "lucide-react"
import { toast } from "sonner"

interface Comment {
    id: string
    name: string
    email: string
    content: string
    createdAt: string
    likes: number
}

interface BlogCommentsProps {
    postTitle: string
}

export default function BlogComments({ postTitle }: BlogCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([
        // Sample comments for demonstration
        {
            id: '1',
            name: 'Alex Chen',
            email: 'alex@example.com',
            content: 'Great article! This really helped me understand the concepts better. Looking forward to more content like this.',
            createdAt: '2024-01-10T10:00:00Z',
            likes: 5,
        },
        {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            content: 'The code examples are very clear. Would love to see a follow-up article on advanced patterns.',
            createdAt: '2024-01-09T15:30:00Z',
            likes: 3,
        },
    ])

    const [newComment, setNewComment] = useState({
        name: '',
        email: '',
        content: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!newComment.name || !newComment.email || !newComment.content) {
            toast.error('Please fill in all fields')
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newComment.email)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        try {
            // Here you would send the comment to your backend
            // For now, we'll simulate adding it locally
            await new Promise(resolve => setTimeout(resolve, 1000))

            const comment: Comment = {
                id: Date.now().toString(),
                ...newComment,
                createdAt: new Date().toISOString(),
                likes: 0,
            }

            setComments(prev => [comment, ...prev])
            setNewComment({ name: '', email: '', content: '' })
            toast.success('Comment posted successfully!')

        } catch {
            toast.error('Failed to post comment. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleLike = async (commentId: string) => {
        // Here you would update likes in your backend
        setComments(prev => prev.map(comment =>
            comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
        ))
        toast.success('Thanks for your reaction!')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="space-y-8">
            {/* Comments Header */}
            <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-[#0376aa]" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Comments ({comments.length})
                </h3>
            </div>

            {/* Comment Form */}
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Share your thoughts
                    </h4>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                type="text"
                                placeholder="Your name"
                                value={newComment.name}
                                onChange={(e) => setNewComment(prev => ({ ...prev, name: e.target.value }))}
                                disabled={isSubmitting}
                                className="bg-gray-50 dark:bg-gray-700"
                            />
                            <Input
                                type="email"
                                placeholder="Your email (won't be published)"
                                value={newComment.email}
                                onChange={(e) => setNewComment(prev => ({ ...prev, email: e.target.value }))}
                                disabled={isSubmitting}
                                className="bg-gray-50 dark:bg-gray-700"
                            />
                        </div>
                        <Textarea
                            placeholder="Write your comment..."
                            value={newComment.content}
                            onChange={(e) => setNewComment(prev => ({ ...prev, content: e.target.value }))}
                            disabled={isSubmitting}
                            rows={4}
                            className="bg-gray-50 dark:bg-gray-700"
                        />
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Your email won&apos;t be published. All fields are required.
                            </p>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-[#0376aa] hover:bg-[#0376aa]/90 text-white"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <Card className="bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-8 text-center">
                            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                No comments yet
                            </h4>
                            <p className="text-gray-500 dark:text-gray-500">
                                Be the first to share your thoughts on this article!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    comments.map((comment) => (
                        <Card key={comment.id} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#0376aa] rounded-full flex items-center justify-center">
                                            <User className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h5 className="font-semibold text-gray-900 dark:text-white">
                                                {comment.name}
                                            </h5>
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                {formatDate(comment.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                                    {comment.content}
                                </p>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleLike(comment.id)}
                                        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0376aa] transition-colors"
                                    >
                                        <Heart className="w-4 h-4" />
                                        {comment.likes > 0 && <span>{comment.likes}</span>}
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Call to Action */}
            <Card className="bg-gradient-to-r from-[#0376aa]/10 to-[#32cf37]/10 border-[#0376aa]/20 dark:border-[#0376aa]/30">
                <CardContent className="p-6 text-center">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Enjoyed this article?
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Share it with your network and join the discussion above!
                    </p>
                    <div className="flex justify-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigator.share && navigator.share({
                                title: postTitle,
                                url: window.location.href
                            })}
                            className="border-[#0376aa] text-[#0376aa] hover:bg-[#0376aa] hover:text-white"
                        >
                            Share Article
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 