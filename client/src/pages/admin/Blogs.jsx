import React, { useState, useEffect } from 'react'
import {
  FileText, Search, Filter, Edit, Trash2, Plus, Eye, Calendar, AlertTriangle, CheckCircle, X
} from 'lucide-react'
import { adminService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const AdminBlogs = () => {
  const { user } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null)
  const [formData, setFormData] = useState({ title: '', content: '', excerpt: '', category: '', tags: '', featured: false, status: 'draft' })

  const categories = ['Health Tips', 'Medical News', 'Disease Awareness', 'Preventive Care', 'Mental Health', 'Nutrition', 'Fitness', 'Technology']

  useEffect(() => { fetchBlogs() }, [filterStatus, filterCategory, searchQuery])

  const fetchBlogs = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, status: filterStatus !== 'all' ? filterStatus : undefined, category: filterCategory !== 'all' ? filterCategory : undefined }
      const response = await adminService.getAdminBlogs(params)
      setBlogs(response.data.data.blogs)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch blogs') }
    finally { setLoading(false) }
  }

  const handleCreate = () => { setFormData({ title: '', content: '', excerpt: '', category: '', tags: '', featured: false, status: 'draft' }); setShowCreateModal(true) }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    setFormData({ title: blog.title, content: blog.content, excerpt: blog.excerpt, category: blog.category, tags: blog.tags?.join(', ') || '', featured: blog.featured || false, status: blog.status })
    setShowCreateModal(true)
  }

  const handleDelete = (blog) => { setSelectedBlog(blog); setShowDeleteModal(true) }

  const confirmDelete = async () => {
    if (!selectedBlog) return
    try { await adminService.deleteBlog(selectedBlog._id); toast.success('Blog deleted!'); setShowDeleteModal(false); setSelectedBlog(null); fetchBlogs() }
    catch (error) { toast.error('Failed to delete blog') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const blogData = { ...formData, tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean), author: user._id }
      if (editingBlog) { await adminService.updateBlog(editingBlog._id, blogData); toast.success('Blog updated!') }
      else { await adminService.createBlog(blogData); toast.success('Blog created!') }
      setShowCreateModal(false); setEditingBlog(null); fetchBlogs()
    } catch (error) { toast.error('Failed to save blog') }
  }

  const getStatusColor = (s) => ({ published: 'bg-green-100 text-green-700', draft: 'bg-amber-100 text-amber-700', archived: 'bg-gray-100 text-gray-700' }[s] || 'bg-gray-100 text-gray-700')
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Blog Management</h1><p className="text-gray-600">Create and manage health blog articles</p></div>
          <button onClick={handleCreate} className="btn-primary"><Plus className="w-4 h-4 mr-2" />New Blog</button>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by title or content..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option>
                <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
              </select>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input">
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: FileText, gradient: 'from-primary-500 to-purple-600', shadow: 'shadow-primary-200/50', label: 'Total Blogs', value: blogs.length },
            { icon: CheckCircle, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'Published', value: blogs.filter(b => b.status === 'published').length },
            { icon: AlertTriangle, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', label: 'Drafts', value: blogs.filter(b => b.status === 'draft').length },
            { icon: Eye, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Total Views', value: blogs.reduce((s, b) => s + (b.views || 0), 0) }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadow}`}><card.icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm text-gray-500">{card.label}</p><p className="text-2xl font-bold text-gray-900">{card.value}</p></div>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No blogs found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterStatus !== 'all' || filterCategory !== 'all' ? 'Try adjusting filters' : 'No blogs created yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterCategory('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Blog</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Author</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Views</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {blogs.map((b) => (
                    <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900 line-clamp-2">{b.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {b.featured && <span className="inline-flex items-center px-2 py-0.5 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold">Featured</span>}
                            <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-700 rounded-lg text-xs">{b.readingTime} min</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-600">{b.authorId?.name?.charAt(0)}</span>
                          </div>
                          <div><p className="font-semibold text-gray-900 text-sm">{b.authorId?.name}</p><p className="text-xs text-gray-500">{formatDate(b.createdAt)}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">{b.category}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(b.status)}`}>{b.status}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{b.views || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => window.open(`/blogs/${b.slug}`, '_blank')} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => handleEdit(b)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(b)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button onClick={() => fetchBlogs(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchBlogs(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchBlogs(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{editingBlog ? 'Edit Blog' : 'Create Blog'}</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} className="input" placeholder="Enter blog title..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Excerpt</label>
                    <textarea value={formData.excerpt} onChange={(e) => setFormData(p => ({ ...p, excerpt: e.target.value }))} rows={3} className="input resize-none" placeholder="Brief description..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                      <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="input">
                        <option value="">Select</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Status</label>
                      <select value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} className="input">
                        <option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags</label>
                    <input type="text" value={formData.tags} onChange={(e) => setFormData(p => ({ ...p, tags: e.target.value }))} className="input" placeholder="Comma-separated" />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData(p => ({ ...p, featured: e.target.checked }))} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                      Featured Post
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Content *</label>
                    <textarea value={formData.content} onChange={(e) => setFormData(p => ({ ...p, content: e.target.value }))} rows={8} className="input resize-none" placeholder="Write your blog content..." />
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-outline">Cancel</button>
                    <button type="submit" className="flex-1 btn-primary">{editingBlog ? 'Update Blog' : 'Create Blog'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedBlog && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-white" /></div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Blog</h3>
                </div>
                <p className="text-gray-600 mb-2">Are you sure you want to delete <strong>{selectedBlog.title}</strong>?</p>
                <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={confirmDelete} className="flex-1 btn-error">Delete</button>
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
