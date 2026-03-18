import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  MessageSquare,
  FileText,
  Heart
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
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    fetchPatients()
  }, [filterStatus, searchQuery])

  const fetchPatients = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined
      }
      
      // This would typically be a doctor service endpoint
      // For now, we'll simulate with appointment data
      const response = await doctorService.getDoctorAppointments(params)
      const uniquePatients = response.data.data.appointments.reduce((acc, apt) => {
        if (apt.patientId && !acc.find(p => p._id === apt.patientId._id)) {
          acc.push({
            ...apt.patientId,
            lastAppointment: apt,
            totalAppointments: response.data.data.appointments.filter(a => a.patientId?._id === apt.patientId._id).length,
            averageRating: 4.5 // This would come from reviews
          })
        }
        return acc
      }, [])
      
      setPatients(uniquePatients)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success-100 text-success-800'
      case 'inactive':
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

  const totalPatients = patients.length
  const activePatients = patients.filter(p => p.status === 'active').length
  const newPatientsThisMonth = patients.filter(p => {
    const joinDate = new Date(p.createdAt)
    const thisMonth = new Date()
    return joinDate.getMonth() === thisMonth.getMonth() && 
           joinDate.getFullYear() === thisMonth.getFullYear()
  }).length

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Patients</h1>
          <p className="text-gray-600">
            Manage your patient records and consultation history
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <Heart className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Patients</p>
                <p className="text-2xl font-semibold text-gray-900">{activePatients}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <Calendar className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-semibold text-gray-900">{newPatientsThisMonth}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <Star className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-semibold text-gray-900">4.5</p>
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
                placeholder="Search by patient name or email..."
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
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Patients Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : patients.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No patients found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any patients yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => (
              <div key={patient._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {patient.profilePicture ? (
                        <img
                          src={patient.profilePicture}
                          alt={patient.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-600">
                          {patient.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patient.age} years • {patient.gender}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`badge ${getStatusColor(patient.status || 'active')}`}>
                          {patient.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      {patient.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {patient.phone}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {patient.address || 'No address provided'}
                    </div>
                  </div>

                  {patient.lastAppointment && (
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <p className="text-sm font-medium text-gray-900 mb-2">Last Appointment</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(patient.lastAppointment.date)}
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {patient.lastAppointment.time}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`badge ${getStatusColor(patient.lastAppointment.status)}`}>
                            {patient.lastAppointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        {patient.averageRating || '4.5'} rating
                      </div>
                      <div className="flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1" />
                        {patient.totalAppointments || 0} consultations
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/dashboard/doctor/chat/${patient._id}`}
                        className="btn-primary btn-sm"
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Link>
                      <button className="btn-outline btn-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchPatients(pagination.current - 1)}
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
                    onClick={() => fetchPatients(page)}
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
                onClick={() => fetchPatients(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Patients
