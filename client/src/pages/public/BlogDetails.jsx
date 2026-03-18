import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
  Calendar,
  User,
  Heart,
  MessageSquare,
  Share2,
  Clock,
  Tag,
  ChevronLeft,
  Send
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
      
      // Update document title
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
      setBlog(prev => ({
        ...prev,
        likes: isLiked ? prev.likes - 1 : prev.likes + 1
      }))
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }

    if (!comment.trim()) {
      toast.error('Please enter a comment')
      return
    }

    try {
      setSubmittingComment(true)
      await blogService.addComment(blog._id, { content: comment })
      
      setBlog(prev => ({
        ...prev,
        comments: [
          {
            _id: Date.now().toString(),
            content: comment,
            user: { name: user.name },
            createdAt: new Date().toISOString()
          },
          ...prev.comments
        ]
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
      navigator.share({
        title: blog.title,
        text: blog.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="container-custom section-padding">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
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
      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="container-custom section-padding">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Blog post not found</h2>
            <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
            <Link to="/blogs" className="btn-primary">
              Back to Blogs
            </Link>
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

      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="container-custom section-padding">
          {/* Back Button */}
          <Link
            to="/blogs"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Blogs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Featured Image */}
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-64 md:h-96 object-cover"
                />

                <div className="p-6 md:p-8">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span className="badge-primary mr-3">{blog.category}</span>
                      <div className="flex items-center mr-4">
                        <Clock className="w-4 h-4 mr-1" />
                        {blog.readingTime} min read
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(blog.publishedAt)}
                      </div>
                    </div>
                    
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {blog.title}
                    </h1>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                          {blog.author?.profilePicture ? (
                            <img
                              src={blog.author.profilePicture}
                              alt={blog.author.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {blog.author?.name?.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{blog.author?.name}</p>
                          <p className="text-sm text-gray-600">
                            {blog.author?.specialization || 'Medical Writer'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={handleLike}
                          className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                            isLiked
                              ? 'bg-red-100 text-red-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                          <span>{blog.likes || 0}</span>
                        </button>
                        
                        <button
                          onClick={handleShare}
                          className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none mb-8">
                    <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="border-t border-gray-200 pt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Comments ({blog.comments?.length || 0})
                    </h3>

                    {/* Comment Form */}
                    {isAuthenticated && (
                      <form onSubmit={handleComment} className="mb-8">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-medium">
                              {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1">
                            <textarea
                              value={comment}
                              onChange={(e) => setComment(e.target.value)}
                              placeholder="Share your thoughts..."
                              rows={3}
                              className="input resize-none"
                            />
                            <button
                              type="submit"
                              disabled={submittingComment || !comment.trim()}
                              className="mt-2 btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              {submittingComment ? 'Posting...' : 'Post Comment'}
                            </button>
                          </div>
                        </div>
                      </form>
                    )}

                    {!isAuthenticated && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-gray-600 text-center">
                          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Login
                          </Link>
                          {' '}to join the conversation
                        </p>
                      </div>
                    )}

                    {/* Comments List */}
                    <div className="space-y-4">
                      {blog.comments?.length === 0 ? (
                        <p className="text-gray-600 text-center py-4">
                          No comments yet. Be the first to comment!
                        </p>
                      ) : (
                        blog.comments.map((comment) => (
                          <div key={comment._id} className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                              {comment.user?.profilePicture ? (
                                <img
                                  src={comment.user.profilePicture}
                                  alt={comment.user.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-600">
                                  {comment.user?.name?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <p className="font-medium text-gray-900">
                                  {comment.user?.name}
                                </p>
                                <span className="text-sm text-gray-500">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Author Info */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About Author</h3>
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    {blog.author?.profilePicture ? (
                      <img
                        src={blog.author.profilePicture}
                        alt={blog.author.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-medium text-gray-600">
                        {blog.author?.name?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900">{blog.author?.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {blog.author?.specialization || 'Medical Writer'}
                  </p>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-3">
                  {/* This would typically fetch recent posts */}
                  <p className="text-gray-600 text-sm">
                    More articles coming soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetails
