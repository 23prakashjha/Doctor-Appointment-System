import React, { useState, useEffect } from 'react'
import { 
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  X,
  Calendar,
  Mail,
  Phone,
  Star,
  Award,
  Clock,
  MapPin,
  Eye,
  AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const Doctors = () => {
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterSpecialization, setFilterSpecialization] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchDoctors()
  }, [filterStatus, filterSpecialization, searchQuery])

  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        specialization: filterSpecialization !== 'all' ? filterSpecialization : undefined
      }
      
      const response = await adminService.getDoctors(params)
      setDoctors(response.data.data.doctors)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (doctorId) => {
    try {
      const response = await adminService.approveDoctor(doctorId)
      
      if (response.data.success) {
        toast.success('Doctor approved successfully!')
        fetchDoctors()
      }
    } catch (error) {
      toast.error('Failed to approve doctor')
    }
  }

  const handleReject = (doctor) => {
    setSelectedDoctor(doctor)
    setRejectionReason('')
    setShowRejectModal(true)
  }

  const submitRejection = async () => {
    if (!selectedDoctor || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason')
      return
    }

    try {
      const response = await adminService.rejectDoctor(selectedDoctor._id, {
        reason: rejectionReason
      })
      
      if (response.data.success) {
        toast.success('Doctor rejected successfully!')
        setShowRejectModal(false)
        setSelectedDoctor(null)
        setRejectionReason('')
        fetchDoctors()
      }
    } catch (error) {
      toast.error('Failed to reject doctor')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-success-100 text-success-800'
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      case 'rejected':
        return 'bg-error-100 text-error-800'
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

  const specializations = [
    'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist',
    'Orthopedic', 'Gynecologist', 'Psychiatrist', 'General Physician',
    'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist'
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Management</h1>
            <p className="text-gray-600">
              Review and approve doctor applications
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or specialization..."
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
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <select
                value={filterSpecialization}
                onChange={(e) => setFilterSpecialization(e.target.value)}
                className="input"
              >
                <option value="all">All Specializations</option>
                {specializations.map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
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
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {doctors.filter(d => d.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {doctors.filter(d => d.status === 'approved').length}
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
                <p className="text-sm font-medium text-gray-600">Rejected Applications</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {doctors.filter(d => d.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <UserCheck className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{doctors.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Table */}
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
        ) : doctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <UserCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctor applications found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterSpecialization !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'No doctor applications yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
                setFilterSpecialization('all')
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
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Experience
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                            {doctor.userId?.profilePicture ? (
                              <img
                                src={doctor.userId.profilePicture}
                                alt={doctor.userId.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">
                                {doctor.userId?.name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              Dr. {doctor.userId?.name}
                            </p>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1" />
                              {doctor.userId?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="badge-secondary">
                          {doctor.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {doctor.experience} years
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(doctor.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(doctor.approvalStatus)}`}>
                          {doctor.approvalStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setSelectedDoctor(doctor)}
                            className="text-primary-600 hover:text-primary-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          {doctor.approvalStatus === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(doctor._id)}
                                className="text-green-600 hover:text-green-700"
                                title="Approve Doctor"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(doctor)}
                                className="text-error-600 hover:text-error-700"
                                title="Reject Doctor"
                              >
                                <X className="w-4 h-4" />
                              </button>
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => fetchDoctors(pagination.current - 1)}
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
                    onClick={() => fetchDoctors(page)}
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
                onClick={() => fetchDoctors(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && selectedDoctor && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowRejectModal(false)} />
              
              <div className="relative bg-white rounded-lg max-w-md w-full p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mr-3">
                    <X className="w-6 h-6 text-error-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Reject Doctor Application</h3>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-600 mb-2">
                    Doctor: <strong>Dr. {selectedDoctor.userId?.name}</strong>
                  </p>
                  <p className="text-sm text-gray-500">
                    Specialization: {selectedDoctor.specialization}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="input resize-none"
                    placeholder="Please provide a reason for rejection..."
                  />
                </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitRejection}
                    disabled={!rejectionReason.trim()}
                    className="flex-1 btn-error disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reject Application
                  </button>
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
