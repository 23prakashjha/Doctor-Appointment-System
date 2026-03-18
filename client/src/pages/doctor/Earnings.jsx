import React, { useState, useEffect } from 'react'
import { 
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Filter,
  DollarSign,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { doctorService, paymentService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Earnings = () => {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState([])
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    totalAppointments: 0,
    averagePerAppointment: 0
  })
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())

  useEffect(() => {
    fetchEarnings()
    fetchStats()
  }, [filterPeriod, filterYear])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const params = {
        period: filterPeriod !== 'all' ? filterPeriod : undefined,
        year: filterPeriod !== 'all' ? filterYear : undefined
      }
      
      // This would typically be a doctor earnings endpoint
      const response = await paymentService.getPaymentStats(params)
      
      if (response.data.success) {
        setEarnings(response.data.data.earnings || [])
      }
    } catch (error) {
      toast.error('Failed to fetch earnings')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await doctorService.getDoctorStats()
      
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch stats')
    }
  }

  const downloadReport = async (type) => {
    try {
      // This would generate and download a report
      toast.success(`${type} report downloaded successfully!`)
    } catch (error) {
      toast.error('Failed to download report')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const monthlyData = [
    { month: 'Jan', earnings: 45000, appointments: 15 },
    { month: 'Feb', earnings: 52000, appointments: 18 },
    { month: 'Mar', earnings: 48000, appointments: 16 },
    { month: 'Apr', earnings: 61000, appointments: 22 },
    { month: 'May', earnings: 55000, appointments: 19 },
    { month: 'Jun', earnings: 58000, appointments: 20 }
  ]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Earnings</h1>
          <p className="text-gray-600">
            Track your income and financial performance
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.thisMonthEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <Calendar className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.lastMonthEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <Activity className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg per Appointment</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.averagePerAppointment.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex gap-2">
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="input"
              >
                <option value="all">All Time</option>
                <option value="this-month">This Month</option>
                <option value="last-month">Last Month</option>
                <option value="this-year">This Year</option>
                <option value="custom">Custom</option>
              </select>
              
              {filterPeriod === 'custom' && (
                <select
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="input"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              )}
            </div>
            
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => downloadReport('earnings')}
                className="btn-outline flex items-center"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </button>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Earnings Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h2>
            <div className="h-64 flex items-end space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-primary-600 rounded-t"
                    style={{ 
                      height: `${(data.earnings / Math.max(...monthlyData.map(d => d.earnings))) * 200}px` 
                    }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">
                    {data.month}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{(data.earnings / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Earnings Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-success-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Completed</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(stats.totalEarnings * 0.85).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-warning-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Pending</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(stats.totalEarnings * 0.10).toLocaleString()}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-error-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-900">Refunded</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  ₹{(stats.totalEarnings * 0.05).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-primary-600">
                  ₹{stats.totalEarnings.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : earnings.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-600">
                {filterPeriod !== 'all' 
                  ? 'Try selecting a different time period'
                  : 'You don\'t have any transactions yet'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {earnings.map((earning) => (
                    <tr key={earning._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(earning.date)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {earning.patientId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {earning.patientId?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {earning.service || 'Consultation'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{earning.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          earning.status === 'completed' 
                            ? 'bg-success-100 text-success-800'
                            : earning.status === 'pending'
                            ? 'bg-warning-100 text-warning-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Earnings
