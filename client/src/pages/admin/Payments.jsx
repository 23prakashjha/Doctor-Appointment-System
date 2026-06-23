import React, { useState, useEffect } from 'react'
import {
  CreditCard, Search, Filter, Download, Calendar, TrendingUp, TrendingDown, DollarSign, BarChart3, CheckCircle, X, AlertTriangle
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])
  const [stats, setStats] = useState({ totalRevenue: 0, thisMonthRevenue: 0, totalTransactions: 0, successfulTransactions: 0, failedTransactions: 0, refundedTransactions: 0, pendingTransactions: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [filterMethod, setFilterMethod] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })

  useEffect(() => { fetchPayments(); fetchStats() }, [filterStatus, filterDate, filterMethod, searchQuery])

  const fetchPayments = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, status: filterStatus !== 'all' ? filterStatus : undefined, date: filterDate || undefined, method: filterMethod !== 'all' ? filterMethod : undefined }
      const response = await adminService.getPayments(params)
      setPayments(response.data.data.payments)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch payments') }
    finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try { const response = await adminService.getPaymentStats(); if (response.data.success) setStats(response.data.data) }
    catch (error) { toast.error('Failed to fetch payment stats') }
  }

  const handleRefund = async (paymentId) => {
    if (!confirm('Process a refund for this payment?')) return
    try { toast.success('Refund processed!'); fetchPayments() }
    catch (error) { toast.error('Failed to process refund') }
  }

  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const monthlyData = [
    { month: 'Jan', revenue: 450000, transactions: 180 }, { month: 'Feb', revenue: 520000, transactions: 208 },
    { month: 'Mar', revenue: 480000, transactions: 192 }, { month: 'Apr', revenue: 610000, transactions: 244 },
    { month: 'May', revenue: 550000, transactions: 220 }, { month: 'Jun', revenue: 580000, transactions: 232 }
  ]
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue))

  const getStatusColor = (s) => ({ paid: 'bg-green-100 text-green-700', pending: 'bg-amber-100 text-amber-700', failed: 'bg-red-100 text-red-700', refunded: 'bg-gray-100 text-gray-700', cancelled: 'bg-gray-100 text-gray-700' }[s] || 'bg-gray-100 text-gray-700')

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Management</h1>
          <p className="text-gray-600">Monitor all financial transactions and revenue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: DollarSign, gradient: 'from-primary-500 to-purple-600', shadow: 'shadow-primary-200/50', label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}` },
            { icon: TrendingUp, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'This Month', value: `₹${stats.thisMonthRevenue.toLocaleString()}` },
            { icon: BarChart3, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Transactions', value: stats.totalTransactions },
            { icon: AlertTriangle, gradient: 'from-red-400 to-pink-500', shadow: 'shadow-red-200/50', label: 'Failed', value: stats.failedTransactions }
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg ${card.shadow}`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div><p className="text-sm text-gray-500">{card.label}</p><p className="text-2xl font-bold text-gray-900">{card.value}</p></div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Revenue Overview</h2>
              <select className="input text-sm w-40"><option>Last 6 months</option><option>Last year</option><option>All time</option></select>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {monthlyData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₹{(data.revenue / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-gradient-to-t from-primary-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height: `${(data.revenue / maxRevenue) * 180}px` }}></div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Transaction Breakdown</h2>
            <div className="space-y-3">
              {[
                { icon: CheckCircle, bg: 'bg-green-50', color: 'text-green-600', label: 'Successful', value: stats.successfulTransactions },
                { icon: AlertTriangle, bg: 'bg-amber-50', color: 'text-amber-600', label: 'Pending', value: stats.pendingTransactions },
                { icon: X, bg: 'bg-red-50', color: 'text-red-600', label: 'Failed', value: stats.failedTransactions },
                { icon: TrendingDown, bg: 'bg-gray-50', color: 'text-gray-600', label: 'Refunded', value: stats.refundedTransactions }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center p-3 ${item.bg} rounded-xl`}>
                  <div className="flex items-center gap-3">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by transaction ID, patient, or doctor..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className="input" />
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option>
                <option value="paid">Paid</option><option value="pending">Pending</option><option value="failed">Failed</option><option value="refunded">Refunded</option><option value="cancelled">Cancelled</option>
              </select>
              <select value={filterMethod} onChange={(e) => setFilterMethod(e.target.value)} className="input">
                <option value="all">All Methods</option>
                <option value="razorpay">Razorpay</option><option value="card">Card</option><option value="upi">UPI</option><option value="netbanking">Net Banking</option>
              </select>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />Filters</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2"><div className="h-4 bg-gray-200 rounded w-1/3"></div><div className="h-3 bg-gray-200 rounded w-1/2"></div></div>
              </div>
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No payments found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterStatus !== 'all' || filterDate || filterMethod !== 'all' ? 'Try adjusting filters' : 'No payments processed yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('all'); setFilterDate(''); setFilterMethod('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Transaction ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-900">#{p.transactionId?.slice(-8) || p._id.slice(-8)}</td>
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">{p.patientId?.name}</p></td>
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">Dr. {p.doctorId?.userId?.name}</p></td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{p.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 capitalize">{p.method === 'razorpay' ? 'Razorpay' : p.method}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(p.createdAt)}</td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(p.status)}`}>{p.status}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toast.success('Receipt downloaded!')} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"><Download className="w-4 h-4" /></button>
                          {p.status === 'paid' && <button onClick={() => handleRefund(p._id)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"><TrendingDown className="w-4 h-4" /></button>}
                        </div>
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
              <button onClick={() => fetchPayments(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchPayments(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchPayments(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPayments
