import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search,
  Calendar,
  User,
  Clock,
  Heart,
  MessageSquare,
  ChevronRight,
  Filter
} from 'lucide-react'
import { blogService } from '../../services/api'
import toast from 'react-hot-toast'

const Blogs = () => {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [categories, setCategories] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    fetchBlogs()
    fetchCategories()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchBlogs()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedCategory])

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 9,
        search: searchQuery,
        category: selectedCategory
      }
      
      const response = await blogService.getAllBlogs(params)
      setBlogs(response.data.data.blogs)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await blogService.getBlogCategories()
      setCategories(response.data.data.categories)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Health Blogs
          </h1>
          <p className="text-gray-600">
            Stay informed with the latest health tips and medical insights
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearch}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  !selectedCategory
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
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
              <div key={i} className="card animate-pulse">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
                </div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <article key={blog._id} className="card hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={blog.featuredImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="badge-primary mr-2">{blog.category}</span>
                    <span>{blog.readingTime} min read</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {blog.author?.name}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(blog.publishedAt)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {blog.likes || 0}
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {blog.comments?.length || 0}
                      </div>
                    </div>
                    <Link
                      to={`/blogs/${blog.slug}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                    >
                      Read More
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchBlogs(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1
                return (
                  <button
                    key={page}
                    onClick={() => fetchBlogs(page)}
                    className={`px-3 py-2 border rounded-md ${
                      page === pagination.current
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => fetchBlogs(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
