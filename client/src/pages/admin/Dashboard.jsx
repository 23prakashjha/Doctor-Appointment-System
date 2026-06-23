import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  ArrowRight,
  Shield,
  BarChart3
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalRevenue: 0,
    pendingDoctors: 0,
    todayAppointments: 0,
    monthlyGrowth: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await adminService.getUserStats()
      if (response.data.success) {
        setStats(response.data.data)
      }

      setRecentActivity([
        { id: 1, type: 'user', message: 'New user registered', time: '2 minutes ago', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 2, type: 'doctor', message: 'New doctor application submitted', time: '15 minutes ago', icon: UserCheck, color: 'text-green-600', bg: 'bg-green-50' },
        { id: 3, type: 'appointment', message: 'Appointment booked successfully', time: '1 hour ago', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 4, type: 'revenue', message: 'Payment received - ₹2,500', time: '2 hours ago', icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
        { id: 5, type: 'review', message: 'New 5-star review posted', time: '3 hours ago', icon: Star, color: 'text-rose-600', bg: 'bg-rose-50' },
      ])
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    { title: 'Total Users', value: (stats.totalUsers || 0).toLocaleString(), icon: Users, gradient: 'from-blue-500 to-cyan-500', change: '+12%', changeType: 'increase' },
    { title: 'Total Doctors', value: (stats.totalDoctors || 0).toLocaleString(), icon: UserCheck, gradient: 'from-green-500 to-emerald-500', change: '+8%', changeType: 'increase' },
    { title: 'Appointments', value: (stats.totalAppointments || 0).toLocaleString(), icon: Calendar, gradient: 'from-purple-500 to-pink-500', change: '+15%', changeType: 'increase' },
    { title: 'Total Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, gradient: 'from-amber-500 to-orange-500', change: '+22%', changeType: 'increase' },
  ]

  const chartData = [65, 78, 90, 81, 95, 88, 92, 103, 97, 110, 105, 115]
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const quickActions = [
    { label: 'Manage Users', desc: 'View all users', icon: Users, href: '/dashboard/admin/users', gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Doctor Approvals', desc: `${stats.pendingDoctors || 0} pending`, icon: UserCheck, href: '/dashboard/admin/doctors', gradient: 'from-green-500 to-emerald-500' },
    { label: 'Appointments', desc: 'Manage bookings', icon: Calendar, href: '/dashboard/admin/appointments', gradient: 'from-purple-500 to-pink-500' },
    { label: 'Payments', desc: 'View transactions', icon: CreditCard, href: '/dashboard/admin/payments', gradient: 'from-amber-500 to-orange-500' },
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
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of platform performance and user activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`p-3.5 bg-gradient-to-br ${card.gradient} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{card.value}</p>
                </div>
              </div>
              {card.change && (
                <div className={`flex items-center text-sm font-semibold ${
                  card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  {card.change}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Charts & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <BarChart3 className="w-5 h-5 text-primary-600" />
                <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
              </div>
              <select className="text-sm border-gray-200 rounded-xl px-3 py-2 focus:ring-primary-500 focus:border-primary-500">
                <option>This Year</option>
                <option>Last 30 days</option>
                <option>Last 7 days</option>
              </select>
            </div>
          </div>
          <div className="p-6">
            <div className="h-56 flex items-end space-x-1.5">
              {chartData.map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg hover:from-primary-500 hover:to-primary-300 transition-all duration-300 cursor-pointer"
                    style={{ height: `${(height / 115) * 200}px` }}
                    title={`${chartLabels[index]}: ${height}`}
                  ></div>
                  <span className="text-[10px] text-gray-500 mt-2 hidden sm:block">{chartLabels[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">User Distribution</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Regular Users</p>
                    <p className="text-sm text-gray-500">Patients</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">75%</p>
                  <div className="w-24 h-2 bg-blue-200 rounded-full mt-1">
                    <div className="w-3/4 h-full bg-blue-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Doctors</p>
                    <p className="text-sm text-gray-500">Medical professionals</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">20%</p>
                  <div className="w-24 h-2 bg-green-200 rounded-full mt-1">
                    <div className="w-1/5 h-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Admins</p>
                    <p className="text-sm text-gray-500">Platform managers</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">5%</p>
                  <div className="w-24 h-2 bg-purple-200 rounded-full mt-1">
                    <div className="w-1/20 h-full bg-purple-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Activity className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100/70 hover:shadow-sm transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-xl flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{action.label}</p>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-primary-600" />
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className={`p-2 ${activity.bg} rounded-lg ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Activity className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-bold text-gray-900">System Health</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">All Systems Operational</h3>
              <p className="text-sm text-green-600 font-semibold">99.9% Uptime</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Response Time</h3>
              <p className="text-sm text-gray-600">245ms average</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Revenue Today</h3>
              <p className="text-sm font-bold text-gray-900">₹45,000</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="w-14 h-14 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-gray-900">Active Users</h3>
              <p className="text-sm font-bold text-gray-900">{stats.activeUsers || 156}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert */}
      {(stats.pendingDoctors || 0) > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-amber-800">Pending Doctor Approvals</h3>
              <p className="text-amber-700 text-sm mt-1">
                You have {stats.pendingDoctors} doctor applications waiting for approval.
                <Link to="/dashboard/admin/doctors" className="font-semibold text-amber-800 underline ml-1 hover:text-amber-900">
                  Review now
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
