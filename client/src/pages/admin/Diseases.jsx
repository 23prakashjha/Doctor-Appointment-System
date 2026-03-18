import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Activity,
  Search,
  Filter,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Users,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDiseases = () => {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState(null)
  const [editingDisease, setEditingDisease] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    symptoms: '',
    commonSpecializations: '',
    severity: 'mild',
    contagious: false,
    active: true
  })

  const categories = [
    'Infectious Diseases', 'Chronic Conditions', 'Mental Health',
    'Respiratory', 'Cardiovascular', 'Gastrointestinal',
    'Musculoskeletal', 'Neurological', 'Endocrine',
    'Dermatological', 'Pediatric', 'Geriatric'
  ]

  const severities = [
    { value: 'mild', label: 'Mild' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'severe', label: 'Severe' },
    { value: 'critical', label: 'Critical' }
  ]

  const specializations = [
    'General Physician', 'Cardiologist', 'Neurologist', 'Pediatrician',
    'Dermatologist', 'Orthopedic', 'Gynecologist', 'Psychiatrist',
    'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist'
  ]

  useEffect(() => {
    fetchDiseases()
  }, [filterCategory, filterStatus, searchQuery])

  const fetchDiseases = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        category: filterCategory !== 'all' ? filterCategory : undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      }
      
      const response = await adminService.getDiseases(params)
      setDiseases(response.data.data.diseases)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch diseases')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      symptoms: '',
      commonSpecializations: '',
      severity: 'mild',
      contagious: false,
      active: true
    })
    setShowCreateModal(true)
  }

  const handleEdit = (disease) => {
    setEditingDisease(disease)
    setFormData({
      name: disease.name,
      category: disease.category,
      description: disease.description,
      symptoms: disease.symptoms?.join(', ') || '',
      commonSpecializations: disease.commonSpecializations?.join(', ') || '',
      severity: disease.severity,
      contagious: disease.contagious || false,
      active: disease.active !== false
    })
    setShowCreateModal(true)
  }

  const handleDelete = (disease) => {
    setSelectedDisease(disease)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedDisease) return

    try {
      await adminService.deleteDisease(selectedDisease._id)
      toast.success('Disease deleted successfully!')
      setShowDeleteModal(false)
      setSelectedDisease(null)
      fetchDiseases()
    } catch (error) {
      toast.error('Failed to delete disease')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const diseaseData = {
        ...formData,
        commonSpecializations: formData.commonSpecializations.split(',').map(spec => spec.trim()).filter(spec => spec),
        symptoms: formData.symptoms.split(',').map(symptom => symptom.trim()).filter(symptom => symptom)
      }

      if (editingDisease) {
        await adminService.updateDisease(editingDisease._id, diseaseData)
        toast.success('Disease updated successfully!')
      } else {
        await adminService.createDisease(diseaseData)
        toast.success('Disease created successfully!')
      }
      
      setShowCreateModal(false)
      setEditingDisease(null)
      setFormData({
        name: '',
        category: '',
        description: '',
        symptoms: '',
        commonSpecializations: '',
        severity: 'mild',
        contagious: false,
        active: true
      })
      fetchDiseases()
    } catch (error) {
      toast.error('Failed to save disease')
    }
  }

  const getStatusColor = (active) => {
    switch (active) {
      case true:
        return 'bg-success-100 text-success-800'
      case false:
        return 'bg-error-100 text-error-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild':
        return 'bg-blue-100 text-blue-800'
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800'
      case 'severe':
        return 'bg-orange-100 text-orange-800'
      case 'critical':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Disease Management</h1>
            <p className="text-gray-600">
              Manage disease database and medical conditions
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Disease
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <Activity className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Diseases</p>
                <p className="text-2xl font-semibold text-gray-900">{diseases.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {diseases.filter(d => d.active !== false).length}
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
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {new Set(diseases.map(d => d.category)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Most Searched</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {diseases.reduce((max, disease) => Math.max(max, disease.searchCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by disease name or symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
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
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Diseases Table */}
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
        ) : diseases.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No diseases found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterCategory !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No diseases have been added yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterCategory('all')
                setFilterStatus('all')
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
                      Disease Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contagious
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Search Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {diseases.map((disease) => (
                    <tr key={disease._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {disease.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-secondary">
                          {disease.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getSeverityColor(disease.severity)}`}>
                          {disease.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${disease.contagious ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {disease.contagious ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(disease.active)}`}>
                          {disease.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {disease.searchCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleEdit(disease)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Edit Disease"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(disease)}
                            className="text-error-600 hover:text-error-700"
                            title="Delete Disease"
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
                onClick={() => fetchDiseases(pagination.current - 1)}
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
                    onClick={() => fetchDiseases(page)}
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
                onClick={() => fetchDiseases(pagination.current + 1)}
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
              
              <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingDisease ? 'Edit Disease' : 'Create New Disease'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Disease Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="input"
                        placeholder="e.g., Diabetes, Hypertension"
                      />
                    </div>

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
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      className="input resize-none"
                      placeholder="Describe disease, its causes, and symptoms..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Symptoms
                      </label>
                      <textarea
                        value={formData.symptoms}
                        onChange={(e) => setFormData(prev => ({ ...prev, symptoms: e.target.value }))}
                        rows={3}
                        className="input resize-none"
                        placeholder="List common symptoms separated by commas..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Common Specializations
                      </label>
                      <textarea
                        value={formData.commonSpecializations}
                        onChange={(e) => setFormData(prev => ({ ...prev, commonSpecializations: e.target.value }))}
                        rows={3}
                        className="input resize-none"
                        placeholder="List specializations separated by commas..."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                        className="input"
                      >
                        {severities.map(sev => (
                          <option key={sev.value} value={sev.value}>{sev.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.contagious}
                          onChange={(e) => setFormData(prev => ({ ...prev, contagious: e.target.checked }))}
                          className="mr-2"
                        />
                        Contagious
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                          className="mr-2"
                        />
                        Active
                      </label>
                    </div>
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
                      {editingDisease ? 'Update Disease' : 'Create Disease'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedDisease && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-3">
                    <AlertTriangle className="w-6 h-6 text-error-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Disease</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600">
                    Are you sure you want to delete <strong>{selectedDisease.name}</strong>?
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. The disease will be permanently removed from database.
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
                    Delete Disease
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

export default AdminDiseases
