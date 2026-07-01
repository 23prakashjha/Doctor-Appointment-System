import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Search, Filter, Calendar, Phone, Mail, MapPin, Clock, Star, MessageSquare, FileText, Heart
} from 'lucide-react'
import { doctorService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Patients = () => {
  const { user } = useAuth()
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => { fetchPatients() }, [filterStatus, searchQuery])

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 12, search: searchQuery || undefined, status: filterStatus !== 'all' ? filterStatus : undefined }
      const response = await doctorService.getDoctorAppointments(params)
      const uniquePatients = response.data.data.appointments.reduce((acc, apt) => {
        if (apt.patientId && !acc.find(p => p._id === apt.patientId._id)) {
          acc.push({ ...apt.patientId, lastAppointment: apt, totalAppointments: response.data.data.appointments.filter(a => a.patientId?._id === apt.patientId._id).length, averageRating: 4.5 })
        }
        return acc
      }, [])
      setPatients(uniquePatients)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch patients') }
    finally { setLoading(false) }
  }

  const getStatusColor = (status) => {
    const colors = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-700' }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const totalPatients = patients.length
  const activePatients = patients.filter(p => p.status === 'active').length
  const newPatientsThisMonth = patients.filter(p => { const jd = new Date(p.createdAt); const tm = new Date(); return jd.getMonth() === tm.getMonth() && jd.getFullYear() === tm.getFullYear() }).length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">Manage your patient records and consultation history</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50"><Users className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Total Patients</p><p className="text-2xl font-bold text-gray-900">{totalPatients}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50"><Heart className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Active</p><p className="text-2xl font-bold text-gray-900">{activePatients}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50"><Calendar className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">New This Month</p><p className="text-2xl font-bold text-gray-900">{newPatientsThisMonth}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-200/50"><Star className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Avg Rating</p><p className="text-2xl font-bold text-gray-900">4.5</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by patient name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'No patients yet'}
            </p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      {patient.profilePicture ? (
                        <img src={patient.profilePicture} alt={patient.name} className="w-full h-full rounded-2xl object-cover" />
                      ) : (
                        <span className="text-lg font-bold text-primary-600">{patient.name?.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 truncate">{patient.name}</h3>
                      <p className="text-sm text-gray-500">{patient.age} years • {patient.gender}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold mt-1 ${getStatusColor(patient.status || 'active')}`}>{patient.status || 'Active'}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{patient.email}</div>
                    <div className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{patient.phone}</div>
                    <div className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-2 flex-shrink-0" />{patient.address || 'N/A'}</div>
                  </div>
                  {patient.lastAppointment && (
                    <div className="border-t border-gray-100 pt-4 mt-4">
                      <p className="text-sm font-semibold text-gray-900 mb-2">Last Visit</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 inline-flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(patient.lastAppointment.date)}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(patient.lastAppointment.status)}`}>{patient.lastAppointment.status}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center"><Star className="w-3.5 h-3.5 text-yellow-400 mr-1" />{patient.averageRating || '4.5'}</div>
                      <div className="flex items-center mt-0.5"><FileText className="w-3.5 h-3.5 mr-1" />{patient.totalAppointments || 0} visits</div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/dashboard/admin/chat/${patient._id}`} className="btn-primary btn-sm"><MessageSquare className="w-3.5 h-3.5 mr-1" />Chat</Link>
                      <button className="btn-outline btn-sm">Details</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button onClick={() => fetchPatients(pagination.current - 1)} disabled={pagination.current === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return (
                  <button key={page} onClick={() => fetchPatients(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}>{page}</button>
                )
              })}
              <button onClick={() => fetchPatients(pagination.current + 1)} disabled={pagination.current === pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Patients
