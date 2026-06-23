import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Users,
  TrendingUp,
  CreditCard,
  Star,
  Clock,
  Activity,
  ChevronRight
} from 'lucide-react'
import { doctorService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    totalPatients: 0,
    totalEarnings: 0,
    averageRating: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [appointmentsRes, statsRes] = await Promise.all([
        doctorService.getDoctorAppointments({ limit: 5 }),
        doctorService.getDoctorStats()
      ])
      const doctorAppointments = appointmentsRes.data.data.appointments
      setAppointments(doctorAppointments)
      if (statsRes.data.success) {
        setStats(statsRes.data.data)
      }
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
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  const isToday = (dateString) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)
    return appointmentDate.toDateString() === today.toDateString()
  }

  const todayAppointments = appointments.filter(apt => isToday(apt.date))

  const statsCards = [
    { label: 'Total Appointments', value: stats.totalAppointments, icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
    { label: "Today's Schedule", value: stats.todayAppointments, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
    { label: 'Total Patients', value: stats.totalPatients, icon: Users, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Total Earnings', value: `₹${(stats.totalEarnings || 0).toLocaleString()}`, icon: CreditCard, gradient: 'from-purple-500 to-pink-500' },
  ]

  const quickActions = [
    { label: 'Manage Appointments', desc: 'View and manage all appointments', icon: Calendar, href: '/dashboard/doctor/appointments', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'View Patients', desc: 'Manage patient records', icon: Users, href: '/dashboard/doctor/patients', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Update Profile', desc: 'Edit your professional details', icon: TrendingUp, href: '/dashboard/doctor/profile', gradient: 'from-purple-500 to-pink-500' },
    { label: 'View Earnings', desc: 'Track your income', icon: CreditCard, href: '/dashboard/doctor/earnings', gradient: 'from-amber-500 to-orange-500' },
  ]

  if (loading) {
    return (
      <div>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome, Dr. {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's an overview of your practice today</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Today's Appointments</h2>
              </div>
              <span className="badge bg-amber-50 text-amber-700 border border-amber-200">
                {todayAppointments.length} today
              </span>
            </div>
          </div>
          <div className="p-6">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-transparent rounded-xl hover:from-blue-100/50 transition-all">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {appointment.patientId?.name?.charAt(0) || 'P'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.patientId?.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {appointment.time}
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

        {/* Performance Overview */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Performance Overview</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-4 text-center">
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating || '4.8'}</p>
                <p className="text-sm text-gray-500">Average Rating</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 text-center">
                <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                <p className="text-sm text-gray-500">Total Patients</p>
              </div>
            </div>

            {/* Recent Activity */}
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New appointment booked</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New 5-star review received</p>
                  <p className="text-xs text-gray-500">5 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-xl">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Profile updated successfully</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-5">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.href}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{action.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
