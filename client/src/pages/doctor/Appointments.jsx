import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar,
  Clock,
  User,
  Star,
  CreditCard,
  CheckCircle,
  X,
  MessageSquare,
  Filter,
  Search,
  FileText
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
  const [prescription, setPrescription] = useState({
    diagnosis: '',
    medicines: '',
    instructions: '',
    followUpDate: ''
  })

  useEffect(() => {
    fetchAppointments()
  }, [filterStatus, searchQuery, selectedDate])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const params = {
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery || undefined,
        date: selectedDate || undefined
      }
      
      const response = await doctorService.getDoctorAppointments(params)
      setAppointments(response.data.data.appointments)
    } catch (error) {
      toast.error('Failed to fetch appointments')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const response = await doctorService.updateAppointmentStatus(appointmentId, { status })
      
      if (response.data.success) {
        toast.success(`Appointment ${status} successfully!`)
        fetchAppointments()
      }
    } catch (error) {
      toast.error('Failed to update appointment status')
    }
  }

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment)
    setPrescription({
      diagnosis: '',
      medicines: '',
      instructions: '',
      followUpDate: ''
    })
    setShowPrescriptionModal(true)
  }

  const handleSubmitPrescription = async () => {
    if (!selectedAppointment) return

    try {
      await appointmentService.addPrescription(selectedAppointment._id, prescription)
      
      toast.success('Prescription added successfully!')
      setShowPrescriptionModal(false)
      setSelectedAppointment(null)
      setPrescription({
        diagnosis: '',
        medicines: '',
        instructions: '',
        followUpDate: ''
      })
      fetchAppointments()
    } catch (error) {
      toast.error('Failed to add prescription')
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const isToday = (dateString) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)
    return appointmentDate.toDateString() === today.toDateString()
  }

  const todayAppointments = appointments.filter(apt => isToday(apt.date))
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'cancelled'
  )
  const completedAppointments = appointments.filter(apt => apt.status === 'completed')

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Appointments</h1>
          <p className="text-gray-600">
            Manage your patient appointments and consultations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <Calendar className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today</p>
                <p className="text-2xl font-semibold text-gray-900">{todayAppointments.length}</p>
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
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">{completedAppointments.length}</p>
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

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input"
              />
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
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
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
              {searchQuery || filterStatus !== 'all' || selectedDate
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any appointments yet'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {appointment.patientId?.profilePicture ? (
                        <img
                          src={appointment.patientId.profilePicture}
                          alt={appointment.patientId.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {appointment.patientId?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {appointment.patientId?.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {appointment.patientId?.age} years • {appointment.patientId?.gender}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {appointment.patientId?.phone}
                        </div>
                      </div>

                      {appointment.disease && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            <strong>Reason:</strong> {appointment.disease}
                          </p>
                        </div>
                      )}

                      {appointment.symptoms && (
                        <div className="mb-2">
                          <p className="text-sm text-gray-600">
                            <strong>Symptoms:</strong> {appointment.symptoms}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center mt-2 space-x-4">
                        <span className={`badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                        <span className={`badge ${appointment.paymentStatus === 'paid' ? 'bg-success-100 text-success-800' : 'bg-warning-100 text-warning-800'}`}>
                          {appointment.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    {appointment.status === 'confirmed' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'completed')}
                          className="btn-primary btn-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Complete
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appointment._id, 'cancelled')}
                          className="btn-error btn-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </button>
                      </div>
                    )}

                    {appointment.status === 'completed' && (
                      <>
                        {!appointment.prescription && (
                          <button
                            onClick={() => handleAddPrescription(appointment)}
                            className="btn-primary btn-sm"
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            Add Prescription
                          </button>
                        )}
                        
                        {appointment.prescription && (
                          <div className="text-center">
                            <span className="badge-success">
                              <FileText className="w-4 h-4 mr-1" />
                              Prescription Added
                            </span>
                          </div>
                        )}
                      </>
                    )}

                    <Link
                      to={`/dashboard/doctor/chat/${appointment.patientId?._id}`}
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
        )}

        {/* Prescription Modal */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowPrescriptionModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Prescription</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <textarea
                      value={prescription.diagnosis}
                      onChange={(e) => setPrescription(prev => ({ ...prev, diagnosis: e.target.value }))}
                      rows={3}
                      className="input resize-none"
                      placeholder="Enter diagnosis..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicines</label>
                    <textarea
                      value={prescription.medicines}
                      onChange={(e) => setPrescription(prev => ({ ...prev, medicines: e.target.value }))}
                      rows={4}
                      className="input resize-none"
                      placeholder="List prescribed medicines with dosage..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                    <textarea
                      value={prescription.instructions}
                      onChange={(e) => setPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                      rows={3}
                      className="input resize-none"
                      placeholder="Usage instructions and precautions..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Date</label>
                    <input
                      type="date"
                      value={prescription.followUpDate}
                      onChange={(e) => setPrescription(prev => ({ ...prev, followUpDate: e.target.value }))}
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPrescriptionModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPrescription}
                    className="flex-1 btn-primary"
                  >
                    Save Prescription
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

export default DoctorAppointments
