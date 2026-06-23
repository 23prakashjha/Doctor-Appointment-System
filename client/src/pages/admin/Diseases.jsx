import React, { useState, useEffect } from 'react'
import {
  Activity, Search, Filter, Edit, Trash2, Plus, TrendingUp, AlertTriangle, X
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDiseases = () => {
  const [diseases, setDiseases] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedDisease, setSelectedDisease] = useState(null)
  const [editingDisease, setEditingDisease] = useState(null)
  const [formData, setFormData] = useState({ name: '', category: '', description: '', symptoms: '', commonSpecializations: '', severity: 'mild', contagious: false, active: true })

  const categories = ['Infectious Diseases', 'Chronic Conditions', 'Mental Health', 'Respiratory', 'Cardiovascular', 'Gastrointestinal', 'Musculoskeletal', 'Neurological', 'Endocrine', 'Dermatological', 'Pediatric', 'Geriatric']
  const severities = [{ value: 'mild', label: 'Mild' }, { value: 'moderate', label: 'Moderate' }, { value: 'severe', label: 'Severe' }, { value: 'critical', label: 'Critical' }]

  useEffect(() => { fetchDiseases() }, [filterCategory, filterStatus, searchQuery])

  const fetchDiseases = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, category: filterCategory !== 'all' ? filterCategory : undefined, status: filterStatus !== 'all' ? filterStatus : undefined }
      const response = await adminService.getDiseases(params)
      setDiseases(response.data.data.diseases)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch diseases') }
    finally { setLoading(false) }
  }

  const handleCreate = () => { setFormData({ name: '', category: '', description: '', symptoms: '', commonSpecializations: '', severity: 'mild', contagious: false, active: true }); setShowCreateModal(true) }

  const handleEdit = (disease) => {
    setEditingDisease(disease)
    setFormData({ name: disease.name, category: disease.category, description: disease.description, symptoms: disease.symptoms?.join(', ') || '', commonSpecializations: disease.commonSpecializations?.join(', ') || '', severity: disease.severity, contagious: disease.contagious || false, active: disease.active !== false })
    setShowCreateModal(true)
  }

  const handleDelete = (disease) => { setSelectedDisease(disease); setShowDeleteModal(true) }

  const confirmDelete = async () => {
    if (!selectedDisease) return
    try { await adminService.deleteDisease(selectedDisease._id); toast.success('Disease deleted!'); setShowDeleteModal(false); setSelectedDisease(null); fetchDiseases() }
    catch (error) { toast.error('Failed to delete disease') }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const diseaseData = { ...formData, commonSpecializations: formData.commonSpecializations.split(',').map(s => s.trim()).filter(Boolean), symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean) }
      if (editingDisease) { await adminService.updateDisease(editingDisease._id, diseaseData); toast.success('Disease updated!') }
      else { await adminService.createDisease(diseaseData); toast.success('Disease created!') }
      setShowCreateModal(false); setEditingDisease(null); fetchDiseases()
    } catch (error) { toast.error('Failed to save disease') }
  }

  const getSeverityColor = (s) => ({ mild: 'bg-blue-100 text-blue-700', moderate: 'bg-yellow-100 text-yellow-700', severe: 'bg-orange-100 text-orange-700', critical: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700')

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div><h1 className="text-2xl font-bold text-gray-900 mb-2">Disease Management</h1><p className="text-gray-600">Manage disease database and medical conditions</p></div>
          <button onClick={handleCreate} className="btn-primary"><Plus className="w-4 h-4 mr-2" />Add Disease</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Activity, gradient: 'from-primary-500 to-purple-600', shadow: 'shadow-primary-200/50', label: 'Total Diseases', value: diseases.length },
            { icon: Activity, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'Active', value: diseases.filter(d => d.active !== false).length },
            { icon: AlertTriangle, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', label: 'Categories', value: new Set(diseases.map(d => d.category)).size },
            { icon: TrendingUp, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Most Searched', value: diseases.reduce((max, d) => Math.max(max, d.searchCount || 0), 0) }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadow}`}><card.icon className="w-5 h-5 text-white" /></div>
                <div><p className="text-sm text-gray-500">{card.label}</p><p className="text-2xl font-bold text-gray-900">{card.value}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by disease name or symptoms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="input">
                <option value="all">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option><option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
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
        ) : diseases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No diseases found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterCategory !== 'all' || filterStatus !== 'all' ? 'Try adjusting filters' : 'No diseases added yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterCategory('all'); setFilterStatus('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Disease</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Severity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Contagious</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Searches</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {diseases.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-gray-900">{d.name}</td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">{d.category}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getSeverityColor(d.severity)}`}>{d.severity}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${d.contagious ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{d.contagious ? 'Yes' : 'No'}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${d.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{d.active ? 'Active' : 'Inactive'}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{d.searchCount || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEdit(d)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(d)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
              <button onClick={() => fetchDiseases(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchDiseases(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchDiseases(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{editingDisease ? 'Edit Disease' : 'Create Disease'}</h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="input" placeholder="e.g., Diabetes" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category *</label>
                      <select value={formData.category} onChange={(e) => setFormData(p => ({ ...p, category: e.target.value }))} className="input">
                        <option value="">Select</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} rows={3} className="input resize-none" placeholder="Describe the disease..." />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Symptoms</label>
                      <textarea value={formData.symptoms} onChange={(e) => setFormData(p => ({ ...p, symptoms: e.target.value }))} rows={3} className="input resize-none" placeholder="Comma-separated" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specializations</label>
                      <textarea value={formData.commonSpecializations} onChange={(e) => setFormData(p => ({ ...p, commonSpecializations: e.target.value }))} rows={3} className="input resize-none" placeholder="Comma-separated" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Severity</label>
                      <select value={formData.severity} onChange={(e) => setFormData(p => ({ ...p, severity: e.target.value }))} className="input">
                        {severities.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={formData.contagious} onChange={(e) => setFormData(p => ({ ...p, contagious: e.target.checked }))} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        Contagious
                      </label>
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <input type="checkbox" checked={formData.active} onChange={(e) => setFormData(p => ({ ...p, active: e.target.checked }))} className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button type="button" onClick={() => setShowCreateModal(false)} className="flex-1 btn-outline">Cancel</button>
                    <button type="submit" className="flex-1 btn-primary">{editingDisease ? 'Update' : 'Create'}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && selectedDisease && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-white" /></div>
                  <h3 className="text-xl font-bold text-gray-900">Delete Disease</h3>
                </div>
                <p className="text-gray-600 mb-2">Are you sure you want to delete <strong>{selectedDisease.name}</strong>?</p>
                <p className="text-sm text-gray-500 mb-6">This will permanently remove the disease from the database.</p>
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

export default AdminDiseases
