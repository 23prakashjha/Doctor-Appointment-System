import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  FileText,
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  Eye,
  Calendar,
  User,
  Star,
  Heart,
  MessageSquare,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import { adminService, blogService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminBlogs = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft'
  })

  const categories = [
    'Health Tips', 'Medical News', 'Disease Awareness', 'Preventive Care',
    'Mental Health', 'Nutrition', 'Fitness', 'Technology'
  ]

  useEffect(() => {
    fetchBlogs()
  }, [filterStatus, filterCategory, searchQuery])

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined
      }
      
      const response = await adminService.getAdminBlogs(params)
      setBlogs(response.data.data.blogs)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch blogs')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '',
      tags: '',
      featured: false,
      status: 'draft'
    })
    setShowCreateModal(true)
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      category: blog.category,
      tags: blog.tags?.join(', ') || '',
      featured: blog.featured || false,
      status: blog.status
    })
    setShowCreateModal(true)
  }

  const handleDelete = (blog) => {
    setSelectedBlog(blog)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedBlog) return

    try {
      await adminService.deleteBlog(selectedBlog._id)
      toast.success('Blog deleted successfully!')
      setShowDeleteModal(false)
      setSelectedBlog(null)
      fetchBlogs()
    } catch (error) {
      toast.error('Failed to delete blog')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const blogData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        author: user._id
      }

      if (editingBlog) {
        await adminService.updateBlog(editingBlog._id, blogData)
        toast.success('Blog updated successfully!')
      } else {
        await adminService.createBlog(blogData)
        toast.success('Blog created successfully!')
      }
      
      setShowCreateModal(false)
      setEditingBlog(null)
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        category: '',
        tags: '',
        featured: false,
        status: 'draft'
      })
      fetchBlogs()
    } catch (error) {
      toast.error('Failed to save blog')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-success-100 text-success-800'
      case 'draft':
        return 'bg-warning-100 text-warning-800'
      case 'archived':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h1>
            <p className="text-gray-600">
              Create and manage health blog articles
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Blog
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title or content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <FileText className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Blogs</p>
                <p className="text-2xl font-semibold text-gray-900">{blogs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogs.filter(blog => blog.status === 'published').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Draft</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogs.filter(blog => blog.status === 'draft').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-full">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Blogs Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow">
            <div className="animate-pulse">
              <div className="space-y-4 p-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No blogs found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No blogs have been created yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
                setFilterCategory('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blog
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Author
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog) => (
                    <tr key={blog._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {blog.title}
                          </p>
                          <div className="flex items-center text-sm text-gray-600 mt-1">
                            {blog.featured && (
                              <span className="badge-warning mr-2">Featured</span>
                            )}
                            <span className="badge-secondary">
                              {blog.readingTime} min read
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {blog.authorId?.profilePicture ? (
                              <img
                                src={blog.authorId.profilePicture}
                                alt={blog.authorId.name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {blog.authorId?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{blog.authorId?.name}</p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDate(blog.createdAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-secondary">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(blog.status)}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {blog.views || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => window.open(`/blogs/${blog.slug}`, '_blank')}
                            className="text-primary-600 hover:text-primary-700"
                            title="View Blog"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit Blog"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog)}
                            className="text-error-600 hover:text-error-700"
                            title="Delete Blog"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCreateModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingBlog ? 'Edit Blog' : 'Create New Blog'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="input"
                      placeholder="Enter blog title..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Excerpt
                    </label>
                    <textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      rows={3}
                      className="input resize-none"
                      placeholder="Brief description of blog post..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                        className="input"
                      >
                        <option value="">Select category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        className="input"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                      className="input"
                      placeholder="Enter tags separated by commas..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="mr-2"
                      />
                      Featured Post
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      rows={8}
                      className="input resize-none"
                      placeholder="Write your blog content here..."
                    />
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 btn-primary"
                    >
                      {editingBlog ? 'Update Blog' : 'Create Blog'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle className="w-6 h-6 text-error-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Blog</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">
                    Are you sure you want to delete <strong>{selectedBlog.title}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. The blog will be permanently removed.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 btn-error"
                  >
                    Delete Blog
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBlogs
