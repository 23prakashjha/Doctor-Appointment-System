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
  ArrowRight,
  ChevronRight
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

      setStats({ totalAppointments, upcomingAppointments, completedAppointments, totalSpent })
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
      case 'confirmed': return 'bg-success-50 text-success-700 border-success-200'
      case 'pending': return 'bg-warning-50 text-warning-700 border-warning-200'
      case 'completed': return 'bg-primary-50 text-primary-700 border-primary-200'
      case 'cancelled': return 'bg-error-50 text-error-700 border-error-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const statsCards = [
    { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50' },
    { label: 'Upcoming', value: stats.upcomingAppointments, icon: Clock, gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
    { label: 'Completed', value: stats.completedAppointments, icon: Activity, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50' },
    { label: 'Total Spent', value: `₹${stats.totalSpent}`, icon: CreditCard, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
  ]

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your healthcare journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
            <div className="flex items-center">
              <div className={`p-3.5 bg-gradient-to-br ${stat.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-primary-600" />
                  <h2 className="text-lg font-bold text-gray-900">Recent Appointments</h2>
                </div>
                <Link
                  to="/dashboard/user/appointments"
                  className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 group"
                >
                  View All
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div className="p-6">
              {appointments.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4 font-medium">No appointments yet</p>
                  <Link to="/doctors" className="btn-primary">
                    Find Doctors
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100/70 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                          {appointment.doctorId?.userId?.name?.charAt(0) || 'D'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Dr. {appointment.doctorId?.userId?.name}</p>
                          <p className="text-sm text-gray-500">{appointment.doctorId?.specialization}</p>
                          <div className="flex items-center text-sm text-gray-400 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {formatDate(appointment.date)} at {appointment.time}
                          </div>
                        </div>
                      </div>
                      <span className={`badge border ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
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
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Profile</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-xl font-bold text-white">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-500">{user?.phone}</p>
                </div>
              </div>
              <Link
                to="/dashboard/user/profile"
                className="w-full btn-outline text-center text-sm"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-yellow-500" />
                <h2 className="text-lg font-bold text-gray-900">Recent Reviews</h2>
              </div>
            </div>
            <div className="p-6">
              {recentReviews.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No reviews yet</p>
              ) : (
                <div className="space-y-3">
                  {recentReviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center mb-1">
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
              {recentReviews.length > 0 && (
                <Link
                  to="/dashboard/user/reviews"
                  className="inline-flex items-center text-sm font-semibold text-primary-600 hover:text-primary-700 mt-4 group"
                >
                  View All Reviews
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              </div>
            </div>
            <div className="p-6 space-y-3">
              <Link to="/doctors" className="btn-primary w-full text-center">
                Book New Appointment
              </Link>
              <Link to="/dashboard/user/payments" className="btn-outline w-full text-center">
                View Payment History
              </Link>
              <Link to="/blogs" className="btn-outline w-full text-center">
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
