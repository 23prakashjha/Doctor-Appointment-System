import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Calendar,
  Clock,
  Star,
  CreditCard,
  User,
  Activity,
  TrendingUp,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { appointmentService, reviewService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const UserDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    upcomingAppointments: 0,
    completedAppointments: 0,
    totalSpent: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [appointmentsRes, reviewsRes] = await Promise.all([
        appointmentService.getUserAppointments({ limit: 5 }),
        reviewService.getUserReviews({ limit: 3 })
      ])

      const userAppointments = appointmentsRes.data.data.appointments
      
      // Calculate stats
      const totalAppointments = userAppointments.length
      const upcomingAppointments = userAppointments.filter(
        apt => apt.status === 'confirmed' || apt.status === 'pending'
      ).length
      const completedAppointments = userAppointments.filter(
        apt => apt.status === 'completed'
      ).length
      const totalSpent = userAppointments
        .filter(apt => apt.paymentStatus === 'paid')
        .reduce((sum, apt) => sum + (apt.consultationFee || 0), 0)

      setStats({
        totalAppointments,
        upcomingAppointments,
        completedAppointments,
        totalSpent
      })

      setAppointments(userAppointments)
      setRecentReviews(reviewsRes.data.data.reviews)
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your healthcare journey
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-warning-100 rounded-full">
              <Clock className="w-6 h-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.upcomingAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-full">
              <Activity className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completedAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Appointments</h2>
                <Link
                  to="/dashboard/user/appointments"
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {appointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No appointments yet</p>
                  <Link to="/doctors" className="btn-primary">
                    Find Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
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
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {appointment.doctorId?.userId?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.doctorId?.specialization}
                          </p>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(appointment.date)} at {appointment.time}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Summary</h2>
            <div className="flex items-center mb-4">
              <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-xl font-medium text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <p className="text-sm text-gray-600">{user?.phone}</p>
              </div>
            </div>
            <Link
              to="/dashboard/user/profile"
              className="w-full btn-outline text-center"
            >
              Edit Profile
            </Link>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
            {recentReviews.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No reviews yet</p>
            ) : (
              <div className="space-y-3">
                {recentReviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-center mb-1">
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 ml-2">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/dashboard/user/reviews"
              className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-4 inline-block"
            >
              View All Reviews
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/doctors"
                className="w-full btn-primary text-center"
              >
                Book New Appointment
              </Link>
              <Link
                to="/dashboard/user/payments"
                className="w-full btn-outline text-center"
              >
                View Payment History
              </Link>
              <Link
                to="/blogs"
                className="w-full btn-outline text-center"
              >
                Read Health Blogs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
