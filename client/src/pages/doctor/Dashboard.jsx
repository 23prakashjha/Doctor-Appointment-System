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
  User,
  Phone,
  MapPin
} from 'lucide-react'
import { doctorService, appointmentService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState({
    totalAppointments: 0,
    todayAppointments: 0,
    upcomingAppointments: 0,
    totalEarnings: 0,
    averageRating: 0,
    totalPatients: 0
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

  const isToday = (dateString) => {
    const today = new Date()
    const appointmentDate = new Date(dateString)
    return appointmentDate.toDateString() === today.toDateString()
  }

  const todayAppointments = appointments.filter(apt => isToday(apt.date))
  const upcomingAppointments = appointments.filter(apt => 
    new Date(apt.date) > new Date() && apt.status !== 'cancelled'
  )

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
          Welcome, Dr. {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your practice today
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
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-success-100 rounded-full">
              <Users className="w-6 h-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 bg-primary-100 rounded-full">
              <CreditCard className="w-6 h-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-semibold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Today's Appointments</h2>
              <span className="badge-warning">
                {todayAppointments.length}
              </span>
            </div>
          </div>
          <div className="p-6">
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No appointments scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {appointment.patientId?.profilePicture ? (
                          <img
                            src={appointment.patientId.profilePicture}
                            alt={appointment.patientId.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {appointment.patientId?.name?.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {appointment.patientId?.name}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time}
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New appointment booked</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Star className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">New 5-star review</p>
                  <p className="text-xs text-gray-600">5 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <User className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Profile updated</p>
                  <p className="text-xs text-gray-600">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/dashboard/doctor/appointments"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <Calendar className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Manage Appointments</h3>
            <p className="text-sm text-gray-600 mt-1">View and manage all appointments</p>
          </Link>
          
          <Link
            to="/dashboard/doctor/patients"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <Users className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">View Patients</h3>
            <p className="text-sm text-gray-600 mt-1">Manage patient records</p>
          </Link>
          
          <Link
            to="/dashboard/doctor/profile"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <User className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Update Profile</h3>
            <p className="text-sm text-gray-600 mt-1">Edit your professional details</p>
          </Link>
          
          <Link
            to="/dashboard/doctor/earnings"
            className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow text-center"
          >
            <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">View Earnings</h3>
            <p className="text-sm text-gray-600 mt-1">Track your income</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
