import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar, Clock, User, Star, CreditCard, X, MessageSquare, Phone, MapPin, Filter, Search
} from 'lucide-react'
import { appointmentService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Appointments = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => { fetchAppointments() }, [filterStatus, searchQuery])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = { status: filterStatus !== 'all' ? filterStatus : undefined, search: searchQuery || undefined }
      const response = await appointmentService.getUserAppointments(params)
      setAppointments(response.data.data.appointments)
    } catch (error) { toast.error('Failed to fetch appointments') }
    finally { setLoading(false) }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return
    try {
      setCancelling(true)
      const response = await appointmentService.cancelAppointment(appointmentId, { reason: 'Patient cancelled' })
      if (response.data.success) {
        toast.success('Appointment cancelled successfully')
        fetchAppointments()
      }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to cancel appointment') }
    finally { setCancelling(false) }
  }

  const getStatusColor = (status) => {
    const colors = { confirmed: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', completed: 'bg-blue-100 text-blue-700', cancelled: 'bg-red-100 text-red-700', 'no-show': 'bg-gray-100 text-gray-700' }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getPaymentStatusColor = (status) => {
    const colors = { paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700' }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })

  const isUpcoming = (a) => new Date(a.date) > new Date() && a.status !== 'cancelled'
  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt))
  const pastAppointments = appointments.filter(apt => !isUpcoming(apt))

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">Manage your upcoming and past appointments</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by doctor name or disease..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Appointments</option>
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
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' ? 'Try adjusting search or filters' : 'You haven\'t booked any appointments yet'}
            </p>
            <Link to="/doctors" className="btn-primary">Find Doctors</Link>
          </div>
        ) : (
          <>
            {upcomingAppointments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
                  Upcoming ({upcomingAppointments.length})
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((apt) => (
                    <div key={apt._id} className="bg-white rounded-2xl border border-gray-100 hover:border-primary-100 hover:shadow-lg transition-all p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-primary-600">{apt.doctorId?.userId?.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Dr. {apt.doctorId?.userId?.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{apt.doctorId?.specialization}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="inline-flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(apt.date)}</span>
                              <span className="inline-flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{apt.time}</span>
                              <span className="inline-flex items-center"><MapPin className="w-3.5 h-3.5 mr-1" />{apt.doctorId?.clinicAddress?.city}</span>
                            </div>
                            <div className="flex items-center mt-3 gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(apt.status)}`}>{apt.status}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getPaymentStatusColor(apt.paymentStatus)}`}>{apt.paymentStatus}</span>
                            </div>
                            {apt.disease && <p className="text-sm text-gray-600 mt-2"><strong>Reason:</strong> {apt.disease}</p>}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                          <Link to={`/doctors/${apt.doctorId?._id}`} className="btn-outline btn-sm">View Profile</Link>
                          {apt.status === 'confirmed' && (
                            <button onClick={() => handleCancelAppointment(apt._id)} disabled={cancelling} className="btn-error btn-sm">{cancelling ? '...' : 'Cancel'}</button>
                          )}
                          {apt.status === 'pending' && (
                            <button className="btn-primary btn-sm"><CreditCard className="w-3.5 h-3.5 mr-1" />Pay Now</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Past ({pastAppointments.length})</h2>
                <div className="space-y-4">
                  {pastAppointments.map((apt) => (
                    <div key={apt._id} className="bg-white rounded-2xl border border-gray-100 p-6 opacity-75">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-bold text-gray-500">{apt.doctorId?.userId?.name?.charAt(0)}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">Dr. {apt.doctorId?.userId?.name}</h3>
                            <p className="text-sm text-gray-500 mb-2">{apt.doctorId?.specialization}</p>
                            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                              <span className="inline-flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{formatDate(apt.date)}</span>
                              <span className="inline-flex items-center"><Clock className="w-3.5 h-3.5 mr-1" />{apt.time}</span>
                            </div>
                            <div className="flex items-center mt-3 gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(apt.status)}`}>{apt.status}</span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getPaymentStatusColor(apt.paymentStatus)}`}>{apt.paymentStatus}</span>
                            </div>
                            {apt.prescription && (
                              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
                                <p className="text-sm text-blue-700 font-medium">Prescription Available</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 lg:flex-shrink-0">
                          {apt.status === 'completed' && !apt.reviewId && (
                            <Link to={`/doctors/${apt.doctorId?._id}/review`} className="btn-primary btn-sm"><Star className="w-3.5 h-3.5 mr-1" />Review</Link>
                          )}
                          {apt.reviewId && (
                            <button disabled className="btn-outline btn-sm"><Star className="w-3.5 h-3.5 mr-1" />Reviewed</button>
                          )}
                          <Link to={`/dashboard/user/chat/${apt.doctorId?._id}`} className="btn-outline btn-sm"><MessageSquare className="w-3.5 h-3.5 mr-1" />Chat</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Appointments
