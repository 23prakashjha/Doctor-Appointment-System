import React, { useState, useEffect } from 'react'
import { 
  CreditCard,
  Calendar,
  Download,
  Filter,
  Search,
  CheckCircle,
  X,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { paymentService } from '../../services/api'
import toast from 'react-hot-toast'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  useEffect(() => {
    fetchPayments()
  }, [filterStatus, searchQuery])

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 10,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        search: searchQuery || undefined
      }
      
      const response = await paymentService.getPaymentHistory(params)
      setPayments(response.data.data.payments)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch payments')
    } finally {
      setLoading(false)
    }
  }

  const downloadInvoice = async (paymentId) => {
    try {
      // This would typically download a PDF invoice
      toast.success('Invoice downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download invoice')
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'failed':
      case 'cancelled':
        return <X className="w-4 h-4" />
      case 'refunded':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunded = payments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">
            View and manage your payment transactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-success-100 rounded-full">
                <CreditCard className="w-6 h-6 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{totalPaid.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-warning-100 rounded-full">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{payments
                    .filter(p => p.status === 'pending')
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-error-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-error-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Refunded</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ₹{totalRefunded.toLocaleString()}
                </p>
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
                placeholder="Search by appointment ID or doctor name..."
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
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-outline flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No payments found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You haven\'t made any payments yet'
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
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
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
                          <p className="text-sm font-medium text-gray-900">
                            Dr. {payment.appointmentId?.doctorId?.userId?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {payment.appointmentId?.disease || 'Consultation'}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.method === 'razorpay' ? 'Card/Net Banking' : payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1">{payment.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center space-x-2">
                          {payment.status === 'paid' && (
                            <button
                              onClick={() => downloadInvoice(payment._id)}
                              className="text-primary-600 hover:text-primary-700"
                              title="Download Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          )}
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => {
                                // Redirect to payment page
                                window.location.href = `/appointments/${payment.appointmentId}/payment`
                              }}
                              className="btn-primary btn-sm"
                            >
                              Pay Now
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

export default Payments
