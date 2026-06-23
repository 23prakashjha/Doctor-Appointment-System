import React, { useState, useEffect } from 'react'
import {
  UserCheck, Search, Filter, CheckCircle, X, Calendar, Mail, Clock, Eye, AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => { fetchDoctors() }, [filterStatus, filterSpecialization, searchQuery])

  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, status: filterStatus !== 'all' ? filterStatus : undefined, specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined }
      const response = await adminService.getDoctors(params)
      setDoctors(response.data.data.doctors)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch doctors') }
    finally { setLoading(false) }
  }

  const handleApprove = async (doctorId) => {
    try {
      const response = await adminService.approveDoctor(doctorId)
      if (response.data.success) { toast.success('Doctor approved!'); fetchDoctors() }
    } catch (error) { toast.error('Failed to approve doctor') }
  }

  const handleReject = (doctor) => { setSelectedDoctor(doctor); setRejectionReason(''); setShowRejectModal(true) }

  const submitRejection = async () => {
    if (!selectedDoctor || !rejectionReason.trim()) { toast.error('Please provide a reason'); return }
    try {
      const response = await adminService.rejectDoctor(selectedDoctor._id, { reason: rejectionReason })
      if (response.data.success) { toast.success('Doctor rejected!'); setShowRejectModal(false); setSelectedDoctor(null); setRejectionReason(''); fetchDoctors() }
    } catch (error) { toast.error('Failed to reject doctor') }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const specializations = ['Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic', 'Gynecologist', 'Psychiatrist', 'General Physician', 'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist']

  const getStatusColor = (s) => ({ approved: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', rejected: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700')

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Management</h1>
          <p className="text-gray-600">Review and approve doctor applications</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by name, email, or specialization..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option>
                <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
              </select>
              <select value={filterSpecialization} onChange={(e) => setFilterSpecialization(e.target.value)} className="input">
                <option value="all">All Specializations</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Clock, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', label: 'Pending Approval', value: doctors.filter(d => d.status === 'pending').length },
            { icon: CheckCircle, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'Approved', value: doctors.filter(d => d.status === 'approved').length },
            { icon: X, gradient: 'from-red-400 to-pink-500', shadow: 'shadow-red-200/50', label: 'Rejected', value: doctors.filter(d => d.status === 'rejected').length },
            { icon: UserCheck, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Total', value: doctors.length }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadow}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
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
        ) : doctors.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterStatus !== 'all' || filterSpecialization !== 'all' ? 'Try adjusting filters' : 'No doctor applications yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterSpecialization('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Specialization</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Experience</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Applied</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {doctors.map((d) => (
                    <tr key={d._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center">
                            {d.userId?.profilePicture ? <img src={d.userId.profilePicture} alt={d.userId.name} className="w-full h-full rounded-xl object-cover" /> : <span className="text-sm font-bold text-primary-600">{d.userId?.name?.charAt(0)}</span>}
                          </div>
                          <div><p className="font-semibold text-gray-900">Dr. {d.userId?.name}</p><p className="text-sm text-gray-500">{d.userId?.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">{d.specialization}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{d.experience} years</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(d.createdAt)}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(d.approvalStatus)}`}>{d.approvalStatus}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedDoctor(d)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                          {d.approvalStatus === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(d._id)} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                              <button onClick={() => handleReject(d)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><X className="w-4 h-4" /></button>
                            </>
                          )}
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
              <button onClick={() => fetchDoctors(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchDoctors(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchDoctors(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}

        {showRejectModal && selectedDoctor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowRejectModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center"><X className="w-6 h-6 text-white" /></div>
                  <h3 className="text-xl font-bold text-gray-900">Reject Application</h3>
                </div>
                <p className="text-gray-600 mb-2">Doctor: <strong>Dr. {selectedDoctor.userId?.name}</strong></p>
                <p className="text-sm text-gray-500 mb-4">Specialization: {selectedDoctor.specialization}</p>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Rejection Reason *</label>
                  <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} rows={4} className="input resize-none" placeholder="Please provide a reason..." />
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowRejectModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={submitRejection} disabled={!rejectionReason.trim()} className="flex-1 btn-error disabled:opacity-50">Reject Application</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
