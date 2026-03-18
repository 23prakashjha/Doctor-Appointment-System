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
  BarChart3,
  Clock,
  Star,
  AlertTriangle
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

      // Simulate recent activity
      setRecentActivity([
        {
          id: 1,
          type: 'user',
          message: 'New user registered',
          time: '2 minutes ago',
          icon: Users,
          color: 'text-blue-600'
        },
        {
          id: 2,
          type: 'doctor',
          message: 'New doctor application',
          time: '15 minutes ago',
          icon: UserCheck,
          color: 'text-green-600'
        },
        {
          id: 3,
          type: 'appointment',
          message: 'Appointment booked',
          time: '1 hour ago',
          icon: Calendar,
          color: 'text-purple-600'
        },
        {
          id: 4,
          type: 'revenue',
          message: 'Payment received',
          time: '2 hours ago',
          icon: CreditCard,
          color: 'text-yellow-600'
        }
      ])
    } catch (error) {
      toast.error('Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 ${color} rounded-full`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {change && (
          <div className={`flex items-center text-sm ${
            changeType === 'increase' ? 'text-green-600' : 'text-red-600'
          }`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {change}
          </div>
        )}
      </div>
    </div>
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">
            Overview of platform performance and user activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="bg-blue-600"
            change="+12%"
            changeType="increase"
          />
          
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors.toLocaleString()}
            icon={UserCheck}
            color="bg-green-600"
            change="+8%"
            changeType="increase"
          />
          
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments.toLocaleString()}
            icon={Calendar}
            color="bg-purple-600"
            change="+15%"
            changeType="increase"
          />
          
          <StatCard
            title="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={CreditCard}
            color="bg-yellow-600"
            change="+22%"
            changeType="increase"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {[65, 78, 90, 81, 95, 88, 92, 103, 97, 110, 105, 115, 108, 95].map((height, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                    style={{ height: `${(height / 115) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 text-center">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">User Distribution</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Regular Users</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">75%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Doctors</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">20%</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Admins</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">5%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/dashboard/admin/users"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Manage Users</p>
                  <p className="text-sm text-gray-600">View all users</p>
                </div>
              </Link>
              
              <Link
                to="/dashboard/admin/doctors"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <UserCheck className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Doctor Approvals</p>
                  <p className="text-sm text-gray-600">{stats.pendingDoctors} pending</p>
                </div>
              </Link>
              
              <Link
                to="/dashboard/admin/appointments"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Calendar className="w-6 h-6 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Appointments</p>
                  <p className="text-sm text-gray-600">Manage bookings</p>
                </div>
              </Link>
              
              <Link
                to="/dashboard/admin/payments"
                className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <CreditCard className="w-6 h-6 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Payments</p>
                  <p className="text-sm text-gray-600">View transactions</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 bg-gray-100 rounded-full ${activity.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="font-medium text-gray-900">All Systems Operational</h3>
              <p className="text-sm text-success-600">99.9% Uptime</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-warning-600" />
              </div>
              <h3 className="font-medium text-gray-900">Response Time</h3>
              <p className="text-sm text-gray-600">245ms average</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Revenue Today</h3>
              <p className="text-sm font-semibold text-gray-900">₹45,000</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Pending Doctor Approvals</h3>
                <p className="text-yellow-700 text-sm">
                  You have {stats.pendingDoctors} doctor applications waiting for approval. 
                  <Link to="/dashboard/admin/doctors" className="text-yellow-800 underline ml-1">
                    Review now
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
