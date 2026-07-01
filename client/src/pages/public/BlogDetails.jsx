import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, Heart, MessageSquare, Share2, Tag, ChevronLeft, User } from 'lucide-react'
import blogsData from '../../data/blogs.json'
import toast from 'react-hot-toast'

const BlogDetails = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [relatedBlogs, setRelatedBlogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const found = blogsData.blogs.find(b => b.slug === slug)
    if (found) {
      setBlog(found)
      document.title = `${found.title} - DocCare`
      const related = blogsData.blogs
        .filter(b => b.category === found.category && b.id !== found.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
      setRelatedBlogs(related)
    }
    setLoading(false)
  }, [slug])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: blog.title, text: blog.summary, url: window.location.href })
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
      <div className="pt-16 bg-transparent min-h-screen">
        <div className="container-custom section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/[0.06] rounded w-1/4"></div>
            <div className="h-96 bg-white/[0.06] rounded-2xl"></div>
            <div className="space-y-3">
              <div className="h-4 bg-white/[0.06] rounded w-3/4"></div>
              <div className="h-4 bg-white/[0.06] rounded"></div>
              <div className="h-4 bg-white/[0.06] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="pt-16 bg-transparent min-h-screen">
        <div className="container-custom section-padding">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Blog post not found</h2>
            <p className="text-gray-300 mb-6">The blog post you're looking for doesn't exist.</p>
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
        <meta name="description" content={blog.summary} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.summary} />
        <meta property="og:image" content={blog.image} />
      </Helmet>

      <div className="pt-16 bg-transparent min-h-screen">
        <div className="container-custom section-padding">
          <Link to="/blogs" className="inline-flex items-center text-gray-300 hover:text-white mb-6 font-medium group">
            <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back to Blogs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <article className="dark-glass rounded-2xl shadow-xl shadow-gray-200/50 border border-white/[0.06] overflow-hidden">
                <div className="relative">
                  <img src={blog.image} alt={blog.title} className="w-full h-72 md:h-96 object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-24"></div>
                  <span className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm text-primary-700 px-4 py-1.5 rounded-full text-sm font-semibold shadow-lg">{blog.category}</span>
                </div>

                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                    <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5" />{blog.readTime} min read</span>
                    <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5" />{formatDate(blog.date)}</span>
                    <span className="flex items-center"><User className="w-4 h-4 mr-1.5" />{blog.author}</span>
                  </div>

                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">{blog.title}</h1>

                  <div className="flex items-center justify-between gap-4 pb-8 border-b border-white/[0.08] mb-8">
                    <div className="flex items-center gap-3">
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.03] text-gray-300 border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                        <Heart className="w-4 h-4" />{blog.likes}
                      </button>
                      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.03] text-gray-300 border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                        <MessageSquare className="w-4 h-4" />{blog.comments}
                      </button>
                    </div>
                    <button onClick={handleShare} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white/[0.03] text-gray-300 border border-white/[0.08] hover:bg-white/[0.06] transition-all">
                      <Share2 className="w-4 h-4" />Share
                    </button>
                  </div>

                  <div className="prose prose-lg max-w-none mb-10 text-gray-200 leading-relaxed whitespace-pre-line">
                    {blog.content}
                  </div>

                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center px-3.5 py-1.5 bg-white/[0.08] text-gray-300 rounded-xl text-sm border border-white/[0.08]">
                            <Tag className="w-3 h-3 mr-1.5" />{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <div className="dark-glass rounded-2xl shadow-lg shadow-gray-200/50 border border-white/[0.06] p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-4">About Author</h3>
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold text-2xl">
                  {blog.author?.charAt(0)}
                </div>
                <h4 className="font-bold text-white">{blog.author}</h4>
                <p className="text-gray-400 text-sm">Medical Writer</p>
              </div>

              {relatedBlogs.length > 0 && (
                <div className="dark-glass rounded-2xl shadow-lg shadow-gray-200/50 border border-white/[0.06] p-6">
                  <h3 className="text-lg font-bold text-white mb-4">Related Posts</h3>
                  <div className="space-y-4">
                    {relatedBlogs.map((rb) => (
                      <Link key={rb.id} to={`/blogs/${rb.slug}`} className="group flex gap-3">
                        <img src={rb.image} alt={rb.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">{rb.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{rb.readTime} min read</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogDetails
