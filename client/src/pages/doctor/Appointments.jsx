import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, User, Star, CreditCard, CheckCircle, X, MessageSquare, Filter, Search, FileText
} from 'lucide-react'
import { doctorService, appointmentService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const DoctorAppointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [prescription, setPrescription] = useState({ diagnosis: '', medicines: '', instructions: '', followUpDate: '' })

  useEffect(() => { fetchAppointments() }, [filterStatus, searchQuery, selectedDate])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = { status: filterStatus !== 'all' ? filterStatus : undefined, search: searchQuery || undefined, date: selectedDate || undefined }
      const response = await doctorService.getDoctorAppointments(params)
      setAppointments(response.data.data.appointments)
    } catch (error) { toast.error('Failed to fetch appointments') }
    finally { setLoading(false) }
  }

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const response = await doctorService.updateAppointmentStatus(appointmentId, { status })
      if (response.data.success) { toast.success(`Appointment ${status}!`); fetchAppointments() }
    } catch (error) { toast.error('Failed to update status') }
  }

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment)
    setPrescription({ diagnosis: '', medicines: '', instructions: '', followUpDate: '' })
    setShowPrescriptionModal(true)
  }

  const handleSubmitPrescription = async () => {
    if (!selectedAppointment) return
    try {
      await appointmentService.addPrescription(selectedAppointment._id, prescription)
      toast.success('Prescription added!')
      setShowPrescriptionModal(false); setSelectedAppointment(null)
      setPrescription({ diagnosis: '', medicines: '', instructions: '', followUpDate: '' })
      fetchAppointments()
    } catch (error) { toast.error('Failed to add prescription') }
  }

  const getStatusColor = (status) => {
    const colors = { confirmed: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700', 'no-show': 'bg-gray-100 text-gray-700' }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })
  const isToday = (dateString) => new Date(dateString).toDateString() === new Date().toDateString()
  const todayAppointments = appointments.filter(apt => isToday(apt.date))
  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your patient appointments and consultations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50"><Calendar className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Today</p><p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50"><CheckCircle className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Confirmed</p><p className="text-2xl font-bold text-gray-900">{appointments.filter(apt => apt.status === 'confirmed').length}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200/50"><Clock className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Completed</p><p className="text-2xl font-bold text-gray-900">{completedAppointments.length}</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50"><X className="w-5 h-5 text-white" /></div>
              <div><p className="text-sm text-gray-500">Cancelled</p><p className="text-2xl font-bold text-gray-900">{appointments.filter(apt => apt.status === 'cancelled').length}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by patient name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-4">{searchQuery || filterStatus !== 'all' || selectedDate ? 'Try adjusting your search or filters' : 'No appointments yet'}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt._id} className="bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-lg font-bold text-primary-600">{apt.patientId?.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{apt.patientId?.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{apt.patientId?.age} years • {apt.patientId?.gender}</p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-2">
                        <span className="inline-flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(apt.date)}</span>
                        <span className="inline-flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{apt.time}</span>
                        <span className="inline-flex items-center"><Phone className="w-3.5 h-3.5 mr-1" />{apt.patientId?.phone}</span>
                      </div>
                      {apt.disease && <p className="text-sm text-gray-600 mb-1"><strong>Reason:</strong> {apt.disease}</p>}
                      {apt.symptoms && <p className="text-sm text-gray-600 mb-1"><strong>Symptoms:</strong> {apt.symptoms}</p>}
                      <div className="flex items-center mt-2 gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(apt.status)}`}>{apt.status}</span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${apt.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{apt.paymentStatus}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                    {apt.status === 'confirmed' && (
                      <div className="flex gap-2">
                        <button onClick={() => handleStatusUpdate(apt._id, 'completed')} className="btn-primary btn-sm"><CheckCircle className="w-3.5 h-3.5 mr-1" />Complete</button>
                        <button onClick={() => handleStatusUpdate(apt._id, 'cancelled')} className="btn-error btn-sm"><X className="w-3.5 h-3.5 mr-1" />Cancel</button>
                      </div>
                    )}
                    {apt.status === 'completed' && !apt.prescription && (
                      <button onClick={() => handleAddPrescription(apt)} className="btn-primary btn-sm"><FileText className="w-3.5 h-3.5 mr-1" />Add Prescription</button>
 )}
                    {apt.status === 'completed' && apt.prescription && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-green-50 text-green-700 rounded-xl text-xs font-semibold"><FileText className="w-3.5 h-3.5 mr-1" />Prescribed</span>
                    )}
                    <Link to={`/dashboard/admin/chat/${apt.patientId?._id}`} className="btn-outline btn-sm"><MessageSquare className="w-3.5 h-3.5 mr-1" />Chat</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showPrescriptionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowPrescriptionModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Add Prescription</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Diagnosis</label>
                    <textarea value={prescription.diagnosis} onChange={(e) => setPrescription(p => ({ ...p, diagnosis: e.target.value }))} rows={3} className="input resize-none" placeholder="Enter diagnosis..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Medicines</label>
                    <textarea value={prescription.medicines} onChange={(e) => setPrescription(p => ({ ...p, medicines: e.target.value }))} rows={4} className="input resize-none" placeholder="List prescribed medicines with dosage..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Instructions</label>
                    <textarea value={prescription.instructions} onChange={(e) => setPrescription(p => ({ ...p, instructions: e.target.value }))} rows={3} className="input resize-none" placeholder="Usage instructions and precautions..." />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Follow-up Date</label>
                    <input type="date" value={prescription.followUpDate} onChange={(e) => setPrescription(p => ({ ...p, followUpDate: e.target.value }))} className="input" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowPrescriptionModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={handleSubmitPrescription} className="flex-1 btn-primary">Save Prescription</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorAppointments
