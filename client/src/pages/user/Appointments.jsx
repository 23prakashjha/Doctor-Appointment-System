import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar,
  Clock,
  User,
  Star,
  CreditCard,
  X,
  MessageSquare,
  Phone,
  MapPin,
  Filter,
  Search
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
  const [showFilters, setShowFilters] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [filterStatus, searchQuery])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery || undefined
      }
      
      const response = await appointmentService.getUserAppointments(params)
      setAppointments(response.data.data.appointments)
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      setCancelling(true)
      const response = await appointmentService.cancelAppointment(appointmentId, {
        reason: 'Patient cancelled'
      })
      
      if (response.data.success) {
        toast.success('Appointment cancelled successfully')
        fetchAppointments()
        setSelectedAppointment(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel appointment')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-success-100 text-success-800'
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      case 'completed':
        return 'bg-primary-100 text-primary-800'
      case 'cancelled':
        return 'bg-error-100 text-error-800'
      case 'no-show':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-800'
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      case 'failed':
        return 'bg-error-100 text-error-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isUpcoming = (appointment) => {
    const appointmentDate = new Date(appointment.date)
    const now = new Date()
    return appointmentDate > now && appointment.status !== 'cancelled'
  }

  const upcomingAppointments = appointments.filter(apt => isUpcoming(apt))
  const pastAppointments = appointments.filter(apt => !isUpcoming(apt))

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">
            Manage your upcoming and past appointments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name or disease..."
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
                <option value="all">All Appointments</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t booked any appointments yet'
              }
            </p>
            <Link to="/doctors" className="btn-primary">
              Find Doctors
            </Link>
          </div>
        ) : (
          <>
            {/* Upcoming Appointments */}
            {upcomingAppointments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Upcoming Appointments ({upcomingAppointments.length})
                </h2>
                <div className="space-y-4">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {appointment.doctorId?.userId?.profilePicture ? (
                              <img
                                src={appointment.doctorId.userId.profilePicture}
                                alt={appointment.doctorId.userId.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-gray-600">
                                {appointment.doctorId?.userId?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              Dr. {appointment.doctorId?.userId?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {appointment.doctorId?.specialization}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.time}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {appointment.doctorId?.clinicAddress?.city}
                              </div>
                            </div>

                            <div className="flex items-center mt-2 space-x-4">
                              <span className={`badge ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                              <span className={`badge ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                {appointment.paymentStatus}
                              </span>
                            </div>

                            {appointment.disease && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                  <strong>Reason:</strong> {appointment.disease}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <Link
                            to={`/doctors/${appointment.doctorId?._id}`}
                            className="btn-outline btn-sm"
                          >
                            View Profile
                          </Link>
                          
                          {appointment.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment._id)}
                              disabled={cancelling}
                              className="btn-error btn-sm"
                            >
                              {cancelling ? 'Cancelling...' : 'Cancel'}
                            </button>
                          )}
                          
                          {appointment.status === 'pending' && (
                            <button
                              onClick={() => setSelectedAppointment(appointment)}
                              className="btn-primary btn-sm"
                            >
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past Appointments */}
            {pastAppointments.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Past Appointments ({pastAppointments.length})
                </h2>
                <div className="space-y-4">
                  {pastAppointments.map((appointment) => (
                    <div key={appointment._id} className="bg-white rounded-lg shadow-sm p-6 opacity-75">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {appointment.doctorId?.userId?.profilePicture ? (
                              <img
                                src={appointment.doctorId.userId.profilePicture}
                                alt={appointment.doctorId.userId.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-medium text-gray-600">
                                {appointment.doctorId?.userId?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              Dr. {appointment.doctorId?.userId?.name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {appointment.doctorId?.specialization}
                            </p>
                            
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(appointment.date)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.time}
                              </div>
                            </div>

                            <div className="flex items-center mt-2 space-x-4">
                              <span className={`badge ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                              </span>
                              <span className={`badge ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                                {appointment.paymentStatus}
                              </span>
                            </div>

                            {appointment.prescription && (
                              <div className="mt-2 p-2 bg-blue-50 rounded">
                                <p className="text-sm text-blue-800">
                                  <strong>Prescription Available</strong>
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col space-y-2">
                          {appointment.status === 'completed' && !appointment.reviewId && (
                            <Link
                              to={`/doctors/${appointment.doctorId?._id}/review`}
                              className="btn-primary btn-sm"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Review
                            </Link>
                          )}
                          
                          {appointment.reviewId && (
                            <button
                              disabled
                              className="btn-outline btn-sm"
                            >
                              <Star className="w-4 h-4 mr-1" />
                              Reviewed
                            </button>
                          )}

                          <Link
                            to={`/dashboard/user/chat/${appointment.doctorId?._id}`}
                            className="btn-outline btn-sm"
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Chat
                          </Link>
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
