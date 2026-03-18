import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar,
  Search,
  Filter,
  Eye,
  CreditCard,
  Clock,
  User,
  MapPin,
  Star,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  useEffect(() => {
    fetchAppointments()
  }, [filterStatus, filterDate, searchQuery])

  const fetchAppointments = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        date: filterDate || undefined
      }
      
      const response = await adminService.getAppointments(params)
      setAppointments(response.data.data.appointments)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
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
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Management</h1>
          <p className="text-gray-600">
            Monitor and manage all platform appointments
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient, doctor, or appointment ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No Show</option>
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
              <div className="p-3 bg-warning-100 rounded-full">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointments.filter(apt => {
                    const aptDate = new Date(apt.date)
                    const today = new Date()
                    return aptDate.toDateString() === today.toDateString()
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointments.filter(apt => apt.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointments.filter(apt => apt.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-error-100 rounded-full">
                <X className="w-6 h-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {appointments.filter(apt => apt.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
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
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No appointments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterDate
                ? 'Try adjusting your search or filters'
                : 'No appointments have been booked yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
                setFilterDate('')
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
                      Appointment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{appointment._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patientId?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-3 h-3 mr-1" />
                            {appointment.patientId?.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {appointment.doctorId?.userId?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            {appointment.doctorId?.rating?.average || '4.5'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatTime(appointment.time)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                          {appointment.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewDetails(appointment)}
                            className="text-primary-600 hover:text-primary-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {appointment.status === 'completed' && (
                            <Link
                              to={`/dashboard/admin/payments?appointment=${appointment._id}`}
                              className="text-green-600 hover:text-green-700"
                              title="View Payment"
                            >
                              <CreditCard className="w-4 h-4" />
                            </Link>
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchAppointments(pagination.current - 1)}
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
                    onClick={() => fetchAppointments(page)}
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
                onClick={() => fetchAppointments(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Appointment Details Modal */}
        {showDetailsModal && selectedAppointment && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailsModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Patient Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.patientId?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.patientId?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.patientId?.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Age</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.patientId?.age} years</p>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Information */}
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 mb-2">Appointment Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Date & Time</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(selectedAppointment.date)} at {formatTime(selectedAppointment.time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`badge ${getStatusColor(selectedAppointment.status)}`}>
                          {selectedAppointment.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`badge ${getPaymentStatusColor(selectedAppointment.paymentStatus)}`}>
                          {selectedAppointment.paymentStatus}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Consultation Fee</p>
                        <p className="font-medium text-gray-900">₹{selectedAppointment.consultationFee}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedAppointment.symptoms && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Symptoms</p>
                        <p className="font-medium text-gray-900">{selectedAppointment.symptoms}</p>
                      </div>
                      {selectedAppointment.medicalHistory && (
                        <div>
                          <p className="text-sm text-gray-600">Medical History</p>
                          <p className="font-medium text-gray-900">{selectedAppointment.medicalHistory}</p>
                        </div>
                      )}
                    </div>
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
