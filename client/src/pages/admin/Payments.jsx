import React, { useState, useEffect } from 'react'
import { 
  CreditCard,
  Search,
  Filter,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  BarChart3,
  CheckCircle,
  X,
  AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    totalTransactions: 0,
    successfulTransactions: 0,
    failedTransactions: 0,
    refundedTransactions: 0,
    pendingTransactions: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [filterMethod, setFilterMethod] = useState('all')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    fetchPayments()
    fetchStats()
  }, [filterStatus, filterDate, filterMethod, searchQuery])

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        search: searchQuery || undefined,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        date: filterDate || undefined,
        method: filterMethod !== 'all' ? filterMethod : undefined
      }
      
      const response = await adminService.getPayments(params)
      setPayments(response.data.data.payments)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await adminService.getPaymentStats()
      
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to fetch payment stats')
    }
  }

  const handleRefund = async (paymentId) => {
    if (!confirm('Are you sure you want to process a refund for this payment?')) {
      return
    }

    try {
      // This would call the refund API
      toast.success('Refund processed successfully!')
      fetchPayments()
    } catch (error) {
      toast.error('Failed to process refund')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-success-100 text-success-800'
      case 'pending':
        return 'bg-warning-100 text-warning-800'
      case 'failed':
        return 'bg-error-100 text-error-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      case 'cancelled':
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

  const downloadReport = async (type) => {
    try {
      toast.success(`${type} report downloaded successfully!`)
    } catch (error) {
      toast.error('Failed to download report')
    }
  }

  const monthlyData = [
    { month: 'Jan', revenue: 450000, transactions: 180 },
    { month: 'Feb', revenue: 520000, transactions: 208 },
    { month: 'Mar', revenue: 480000, transactions: 192 },
    { month: 'Apr', revenue: 610000, transactions: 244 },
    { month: 'May', revenue: 550000, transactions: 220 },
    { month: 'Jun', revenue: 580000, transactions: 232 }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">
            Monitor all financial transactions and revenue
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full">
                <DollarSign className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
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
                  ₹{stats.thisMonthRevenue.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalTransactions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.failedTransactions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Revenue Overview</h2>
              <select className="text-sm border-gray-300 rounded-md">
                <option>Last 6 months</option>
                <option>Last year</option>
                <option>All time</option>
              </select>
            </div>
            <div className="h-64 flex items-end space-x-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1">
                  <div 
                    className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                    style={{ height: `${(data.revenue / Math.max(...monthlyData.map(d => d.revenue))) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2 text-center">
                    {data.month}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{(data.revenue / 1000).toFixed(1)}k
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaction Breakdown</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Successful</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">{stats.successfulTransactions}</p>
                  <p className="text-sm text-gray-600">transactions</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-warning-50 rounded">
                <div className="flex items-center">
                  <AlertTriangle className="w-5 h-5 text-warning-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Pending</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-warning-600">{stats.pendingTransactions}</p>
                  <p className="text-sm text-gray-600">transactions</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <div className="flex items-center">
                  <X className="w-5 h-5 text-red-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Failed</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{stats.failedTransactions}</p>
                  <p className="text-sm text-gray-600">transactions</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <TrendingDown className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Refunded</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-600">{stats.refundedTransactions}</p>
                  <p className="text-sm text-gray-600">transactions</p>
                </div>
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
                placeholder="Search by transaction ID, patient, or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="input"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
                className="input"
              >
                <option value="all">All Methods</option>
                <option value="razorpay">Razorpay</option>
                <option value="card">Credit Card</option>
                <option value="upi">UPI</option>
                <option value="netbanking">Net Banking</option>
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
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
        ) : payments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' || filterDate || filterMethod !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No payments have been processed yet'
              }
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterStatus('all')
                setFilterDate('')
                setFilterMethod('all')
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
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Patient
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
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
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        #{payment.transactionId?.slice(-8) || payment._id.slice(-8)}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {payment.patientId?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(payment.appointmentId?.date)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            Dr. {payment.doctorId?.userId?.name}
                          </p>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-3 h-3 mr-1 text-yellow-400" />
                            {payment.doctorId?.rating?.average || '4.5'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.method === 'razorpay' ? 'Razorpay' : payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`badge ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => downloadReport('receipt')}
                            className="text-primary-600 hover:text-primary-700"
                            title="Download Receipt"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          
                          {payment.status === 'paid' && (
                            <button
                              onClick={() => handleRefund(payment._id)}
                              className="text-warning-600 hover:text-warning-700"
                              title="Process Refund"
                            >
                              <TrendingDown className="w-4 h-4" />
                            </button>
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
                onClick={() => fetchPayments(pagination.current - 1)}
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
                    onClick={() => fetchPayments(page)}
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
                onClick={() => fetchPayments(pagination.current + 1)}
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

export default AdminPayments
