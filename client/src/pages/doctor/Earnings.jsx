import React, { useState, useEffect } from 'react'
import {
  TrendingUp, CreditCard, Calendar, Download, Filter, DollarSign, BarChart3, Activity
} from 'lucide-react'
import { doctorService, paymentService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const Earnings = () => {
  const { user } = useAuth()
  const [earnings, setEarnings] = useState([])
  const [stats, setStats] = useState({ totalEarnings: 0, thisMonthEarnings: 0, lastMonthEarnings: 0, totalAppointments: 0, averagePerAppointment: 0 })
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState('all')
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString())

  useEffect(() => { fetchEarnings(); fetchStats() }, [filterPeriod, filterYear])

  const fetchEarnings = async () => {
    try {
      setLoading(true)
      const params = { period: filterPeriod !== 'all' ? filterPeriod : undefined, year: filterPeriod !== 'all' ? filterYear : undefined }
      const response = await paymentService.getPaymentStats(params)
      if (response.data.success) setEarnings(response.data.data.earnings || [])
    } catch (error) { toast.error('Failed to fetch earnings') }
    finally { setLoading(false) }
  }

  const fetchStats = async () => {
    try {
      const response = await doctorService.getDoctorStats()
      if (response.data.success) setStats(response.data.data)
    } catch (error) { toast.error('Failed to fetch stats') }
  }

  const downloadReport = async (type) => { toast.success(`${type} report downloaded!`) }

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const monthlyData = [
    { month: 'Jan', earnings: 45000, appointments: 15 }, { month: 'Feb', earnings: 52000, appointments: 18 },
    { month: 'Mar', earnings: 48000, appointments: 16 }, { month: 'Apr', earnings: 61000, appointments: 22 },
    { month: 'May', earnings: 55000, appointments: 19 }, { month: 'Jun', earnings: 58000, appointments: 20 }
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
  const maxEarning = Math.max(...monthlyData.map(d => d.earnings))

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Earnings</h1>
          <p className="text-gray-600">Track your income and financial performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {[
            { icon: DollarSign, gradient: 'from-primary-500 to-purple-600', shadow: 'shadow-primary-200/50', label: 'Total Earnings', value: `₹${stats.totalEarnings.toLocaleString()}` },
            { icon: TrendingUp, gradient: 'from-green-400 to-emerald-500', shadow: 'shadow-green-200/50', label: 'This Month', value: `₹${stats.thisMonthEarnings.toLocaleString()}` },
            { icon: Calendar, gradient: 'from-amber-400 to-orange-500', shadow: 'shadow-amber-200/50', label: 'Last Month', value: `₹${stats.lastMonthEarnings.toLocaleString()}` },
            { icon: BarChart3, gradient: 'from-blue-400 to-indigo-500', shadow: 'shadow-blue-200/50', label: 'Appointments', value: stats.totalAppointments },
            { icon: Activity, gradient: 'from-teal-400 to-cyan-500', shadow: 'shadow-teal-200/50', label: 'Avg per Visit', value: `₹${stats.averagePerAppointment.toLocaleString()}` }
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

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="input">
              <option value="all">All Time</option>
              <option value="this-month">This Month</option>
              <option value="last-month">Last Month</option>
              <option value="this-year">This Year</option>
              <option value="custom">Custom</option>
            </select>
            {filterPeriod === 'custom' && (
              <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="input">
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            )}
            <div className="flex gap-2 lg:ml-auto">
              <button onClick={() => downloadReport('earnings')} className="btn-outline inline-flex items-center"><Download className="w-4 h-4 mr-2" />Download Report</button>
              <button className="btn-outline inline-flex items-center"><Filter className="w-4 h-4 mr-2" />More Filters</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Monthly Earnings</h2>
            <div className="h-64 flex items-end justify-between gap-3">
              {monthlyData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">₹{(data.earnings / 1000).toFixed(1)}k</span>
                  <div className="w-full bg-gradient-to-t from-primary-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-pointer" style={{ height: `${(data.earnings / maxEarning) * 180}px` }}></div>
                  <span className="text-xs text-gray-500">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Earnings Breakdown</h2>
            <div className="space-y-3">
              {[
                { color: 'bg-green-500', label: 'Completed', value: `₹${(stats.totalEarnings * 0.85).toLocaleString()}` },
                { color: 'bg-amber-500', label: 'Pending', value: `₹${(stats.totalEarnings * 0.10).toLocaleString()}` },
                { color: 'bg-red-500', label: 'Refunded', value: `₹${(stats.totalEarnings * 0.05).toLocaleString()}` }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-900">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-lg font-extrabold text-primary-600">₹{stats.totalEarnings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Recent Transactions</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center justify-between animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div><div className="h-4 bg-gray-200 rounded w-32 mb-2"></div><div className="h-3 bg-gray-200 rounded w-24"></div></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : earnings.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No transactions</h3>
              <p className="text-gray-500">{filterPeriod !== 'all' ? 'Try a different period' : 'No transactions yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Service</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {earnings.map((e) => (
                    <tr key={e._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(e.date)}</td>
                      <td className="px-6 py-4"><p className="text-sm font-semibold text-gray-900">{e.patientId?.name}</p><p className="text-xs text-gray-500">{e.patientId?.email}</p></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{e.service || 'Consultation'}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{e.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                          e.status === 'completed' ? 'bg-green-100 text-green-700' : e.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                        }`}>{e.status}</span>
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
