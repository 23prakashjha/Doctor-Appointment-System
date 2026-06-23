import React, { useState, useEffect } from 'react'
import {
  Calendar, Search, Filter, Eye, CreditCard, Clock, User, X
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => { fetchAppointments() }, [filterStatus, filterDate, searchQuery])

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, status: filterStatus !== 'all' ? filterStatus : undefined, date: filterDate || undefined }
      const response = await adminService.getAppointments(params)
      setAppointments(response.data.data.appointments)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch appointments') }
    finally { setLoading(false) }
  }

  const getStatusColor = (s) => ({ confirmed: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700', 'no-show': 'bg-gray-100 text-gray-700' }[s] || 'bg-gray-100 text-gray-700')

  const getPaymentStatusColor = (s) => ({ paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700' }[s] || 'bg-gray-100 text-gray-700')

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const formatTime = (t) => new Date(`2000-01-01T${t}`).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Management</h1>
          <p className="text-gray-600">Monitor and manage all platform appointments</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by patient, doctor, or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="input" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Clock, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', label: "Today's", value: appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString()).length },
            { icon: Calendar, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length },
            { icon: Calendar, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Completed', value: appointments.filter(a => a.status === 'completed').length },
            { icon: X, gradient: 'from-red-400 to-pink-500', shadow: 'shadow-red-200/50', label: 'Cancelled', value: appointments.filter(a => a.status === 'cancelled').length }
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
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterStatus !== 'all' || filterDate ? 'Try adjusting filters' : 'No appointments booked yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterDate('') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">#{a._id.slice(-8)}</td>
                      <td className="px-6 py-4"><p className="font-semibold text-gray-900">{a.patientId?.name}</p><p className="text-xs text-gray-500">{a.patientId?.email}</p></td>
                      <td className="px-6 py-4"><p className="font-semibold text-gray-900">Dr. {a.doctorId?.userId?.name}</p></td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{formatDate(a.date)}</div>
                        <div className="text-xs text-gray-500">{formatTime(a.time)}</div>
                      </td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(a.status)}`}>{a.status}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getPaymentStatusColor(a.paymentStatus)}`}>{a.paymentStatus}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => { setSelectedAppointment(a); setShowDetailsModal(true) }} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                          {a.status === 'completed' && (
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><CreditCard className="w-4 h-4" /></button>
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
              <button onClick={() => fetchAppointments(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchAppointments(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchAppointments(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}

        {showDetailsModal && selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Appointment Details</h3>
                  <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Patient</h4>
                    <div><p className="text-xs text-gray-500">Name</p><p className="font-semibold text-gray-900">{selectedAppointment.patientId?.name}</p></div>
                    <div><p className="text-xs text-gray-500">Email</p><p className="font-semibold text-gray-900">{selectedAppointment.patientId?.email}</p></div>
                    <div><p className="text-xs text-gray-500">Phone</p><p className="font-semibold text-gray-900">{selectedAppointment.patientId?.phone}</p></div>
                    <div><p className="text-xs text-gray-500">Age</p><p className="font-semibold text-gray-900">{selectedAppointment.patientId?.age} years</p></div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2">Appointment</h4>
                    <div><p className="text-xs text-gray-500">Date & Time</p><p className="font-semibold text-gray-900">{formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}</p></div>
                    <div><p className="text-xs text-gray-500">Status</p><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(selectedAppointment.status)}`}>{selectedAppointment.status}</span></div>
                    <div><p className="text-xs text-gray-500">Payment</p><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getPaymentStatusColor(selectedAppointment.paymentStatus)}`}>{selectedAppointment.paymentStatus}</span></div>
                    <div><p className="text-xs text-gray-500">Fee</p><p className="font-semibold text-gray-900">₹{selectedAppointment.consultationFee}</p></div>
                  </div>
                </div>
                {selectedAppointment.symptoms && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-2">Additional Info</h4>
                    <p className="text-sm text-gray-700"><strong>Symptoms:</strong> {selectedAppointment.symptoms}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminAppointments
