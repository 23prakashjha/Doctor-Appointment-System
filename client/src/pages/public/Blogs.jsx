import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search, Calendar, User, Clock, Heart, MessageSquare, ChevronRight
} from 'lucide-react'
import { blogService } from '../../services/api'
import toast from 'react-hot-toast'

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => { fetchBlogs(); fetchCategories() }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => fetchBlogs(), 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory])

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 9, search: searchQuery, category: selectedCategory }
      const response = await blogService.getAllBlogs(params)
      setBlogs(response.data.data.blogs)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    } finally { setLoading(false) }
  }

  const fetchCategories = async () => {
    try {
      const response = await blogService.getBlogCategories()
      setCategories(response.data.data.categories)
    } catch (error) { console.error('Failed to fetch categories:', error) }
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })

  return (
    <div className="pt-16 bg-gradient-to-br from-purple-50 via-white to-blue-50 min-h-screen">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">Health Blogs</h1>
          <p className="text-lg text-gray-600">Stay informed with the latest health tips and medical insights</p>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search blogs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setSelectedCategory('')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}>
                All
              </button>
              {categories.map((category) => (
                <button key={category} onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category ? 'bg-primary-100 text-primary-700 border border-primary-200 shadow-sm' : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}>
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-52 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setSelectedCategory('') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog._id} className="group bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative overflow-hidden">
                  <img src={blog.featuredImage} alt={blog.title} className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">{blog.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {blog.readingTime} min read
                    <span className="mx-2">•</span>
                    {formatDate(blog.publishedAt)}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">{blog.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm">{blog.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center"><Heart className="w-4 h-4 mr-1" />{blog.likes || 0}</div>
                      <div className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" />{blog.comments?.length || 0}</div>
                    </div>
                    <Link to={`/blogs/${blog.slug}`} className="inline-flex items-center text-primary-600 font-semibold text-sm group/link">
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <button onClick={() => fetchBlogs(pagination.current - 1)} disabled={pagination.current === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                Previous
              </button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return (
                  <button key={page} onClick={() => fetchBlogs(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === pagination.current
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}>
                    {page}
                  </button>
                )
              })}
              <button onClick={() => fetchBlogs(pagination.current + 1)} disabled={pagination.current === pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Blogs
