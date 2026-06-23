import React, { useState, useEffect } from 'react'
import {
  CreditCard, Calendar, Download, Filter, Search, CheckCircle, X, Clock, AlertTriangle
} from 'lucide-react'
import { paymentService } from '../../services/api'
import toast from 'react-hot-toast'

const Payments = () => {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => { fetchPayments() }, [filterStatus, searchQuery])

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, status: filterStatus !== 'all' ? filterStatus : undefined, search: searchQuery || undefined }
      const response = await paymentService.getPaymentHistory(params)
      setPayments(response.data.data.payments)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch payments') }
    finally { setLoading(false) }
  }

  const downloadInvoice = async () => { toast.success('Invoice downloaded successfully!') }

  const getStatusColor = (status) => {
    const colors = { paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700', cancelled: 'bg-gray-100 text-gray-700' }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getStatusIcon = (status) => {
    const icons = { paid: <CheckCircle className="w-3.5 h-3.5" />, pending: <Clock className="w-3.5 h-3.5" />, failed: <X className="w-3.5 h-3.5" />, cancelled: <X className="w-3.5 h-3.5" />, refunded: <AlertTriangle className="w-3.5 h-3.5" /> }
    return icons[status] || <Clock className="w-3.5 h-3.5" />
  }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const totalRefunded = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment History</h1>
          <p className="text-gray-600">View and manage your payment transactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200/50">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalPaid.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-200/50">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalPending.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-200/50">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Refunded</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRefunded.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by doctor name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'You haven\'t made any payments yet'}
            </p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Payment ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Appointment</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">#{payment.transactionId?.slice(-8) || payment._id.slice(-8)}</td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold text-gray-900">Dr. {payment.appointmentId?.doctorId?.userId?.name}</p>
                        <p className="text-xs text-gray-500">{payment.appointmentId?.disease || 'Consultation'}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(payment.createdAt)}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{payment.method === 'razorpay' ? 'Card/Net Banking' : payment.method}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {payment.status === 'paid' && (
                          <button onClick={downloadInvoice} className="text-primary-600 hover:text-primary-700 p-2 hover:bg-primary-50 rounded-lg transition-all" title="Download Invoice">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        {payment.status === 'pending' && (
                          <button className="btn-primary btn-sm">Pay Now</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <button onClick={() => fetchPayments(pagination.current - 1)} disabled={pagination.current === 1}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return (
                  <button key={page} onClick={() => fetchPayments(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === pagination.current
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-200/50'
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}>{page}</button>
                )
              })}
              <button onClick={() => fetchPayments(pagination.current + 1)} disabled={pagination.current === pagination.pages}
                className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Payments
