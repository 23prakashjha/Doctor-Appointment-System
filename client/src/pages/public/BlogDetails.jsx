import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  Calendar, User, Heart, MessageSquare, Share2, Clock, Tag, ChevronLeft, Send
} from 'lucide-react'
import { blogService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const BlogDetails = () => {
  const { slug } = useParams()
  const { isAuthenticated, user } = useAuth()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    fetchBlog()
  }, [slug])

  const fetchBlog = async () => {
    try {
      setLoading(true)
      const response = await blogService.getBlogBySlug(slug)
      setBlog(response.data.data.blog)
      document.title = `${response.data.data.blog.title} - DocCare`
    } catch (error) {
      toast.error('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like this post')
      return
    }
    try {
      await blogService.toggleLike(blog._id)
      setIsLiked(!isLiked)
      setBlog(prev => ({ ...prev, likes: isLiked ? prev.likes - 1 : prev.likes + 1 }))
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) { toast.error('Please login to comment'); return }
    if (!comment.trim()) { toast.error('Please enter a comment'); return }
    try {
      setSubmittingComment(true)
      await blogService.addComment(blog._id, { content: comment })
      setBlog(prev => ({
        ...prev, comments: [{
          _id: Date.now().toString(), content: comment,
          user: { name: user.name }, createdAt: new Date().toISOString()
        }, ...prev.comments]
      }))
      setComment('')
      toast.success('Comment added successfully!')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, text: blog.excerpt, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  if (loading) {
    return (
      <div className="pt-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
        <div className="container-custom section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="pt-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
        <div className="container-custom section-padding">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog post not found</h2>
            <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist.</p>
            <Link to="/blogs" className="btn-primary">Back to Blogs</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{blog.title} - DocCare</title>
        <meta name="description" content={blog.excerpt} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt} />
        <meta property="og:image" content={blog.featuredImage} />
      </Helmet>

      <div className="pt-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
        <div className="container-custom section-padding">
          <Link to="/blogs" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium group">
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <article className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                <div className="relative">
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-72 md:h-96 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-24"></div>
                  <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">{blog.category}</span>
                </div>

                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1.5" />
                      {blog.readingTime} min read
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {formatDate(blog.publishedAt)}
                    </div>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">{blog.title}</h1>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-gray-200 mb-8">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mr-4 text-white font-bold text-lg">
                        {blog.author?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{blog.author?.name}</p>
                        <p className="text-sm text-gray-500">{blog.author?.specialization || 'Medical Writer'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={handleLike} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        isLiked ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
                      }`}>
                        <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                        {blog.likes || 0}
                      </button>
                      <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all">
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>

                  <div className="prose prose-lg max-w-none mb-10 text-gray-700 leading-relaxed">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center px-3.5 py-1.5 bg-gray-50 text-gray-700 rounded-xl text-sm border border-gray-200">
                            <Tag className="w-3 h-3 mr-1.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Comments ({blog.comments?.length || 0})
                    </h3>

                    {isAuthenticated ? (
                      <form onSubmit={handleComment} className="mb-8">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your thoughts..." rows={3} className="input resize-none" />
                            <button type="submit" disabled={submittingComment || !comment.trim()} className="mt-2 btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
                              <Send className="w-4 h-4 mr-1.5" />
                              {submittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-5 mb-8 text-center">
                        <p className="text-gray-700">
                          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Login</Link> to join the conversation
                        </p>
                      </div>
                    )}

                    <div className="space-y-5">
                      {blog.comments?.length === 0 ? (
                        <p className="text-gray-500 text-center py-6">No comments yet. Be the first to comment!</p>
                      ) : (
                        blog.comments.map((comment) => (
                          <div key={comment._id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                              {comment.user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-gray-900 text-sm">{comment.user?.name}</p>
                                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-700 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About Author</h3>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl">
                  {blog.author?.name?.charAt(0)}
                </div>
                <h4 className="font-bold text-gray-900">{blog.author?.name}</h4>
                <p className="text-gray-500 text-sm">{blog.author?.specialization || 'Medical Writer'}</p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                <p className="text-gray-500 text-sm">More articles coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetails
