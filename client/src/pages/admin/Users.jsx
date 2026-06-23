import React, { useState, useEffect } from 'react'
import {
  Users as UsersIcon, Search, Filter, Edit, Trash2, ShieldOff, Calendar, Mail, Shield, X
} from 'lucide-react'
import { adminService } from '../../services/api'
import toast from 'react-hot-toast'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => { fetchUsers() }, [filterRole, filterStatus, searchQuery])

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true)
      const params = { page, limit: 10, search: searchQuery || undefined, role: filterRole !== 'all' ? filterRole : undefined, status: filterStatus !== 'all' ? filterStatus : undefined }
      const response = await adminService.getUsers(params)
      setUsers(response.data.data.users)
      setPagination(response.data.data.pagination)
    } catch (error) { toast.error('Failed to fetch users') }
    finally { setLoading(false) }
  }

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      const response = await adminService.updateUserStatus(userId, { status: newStatus })
      if (response.data.success) { toast.success(`User ${newStatus}!`); fetchUsers() }
    } catch (error) { toast.error('Failed to update status') }
  }

  const handleDelete = async (userId) => {
    if (!confirm('This action cannot be undone.')) return
    try {
      await adminService.deleteUser(userId)
      toast.success('User deleted!')
      setShowDeleteModal(false); setSelectedUser(null); fetchUsers()
    } catch (error) { toast.error('Failed to delete user') }
  }

  const getStatusColor = (s) => ({ active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-700', suspended: 'bg-red-100 text-red-700' }[s] || 'bg-gray-100 text-gray-700')
  const getRoleColor = (r) => ({ admin: 'bg-purple-100 text-purple-700', doctor: 'bg-blue-100 text-blue-700', user: 'bg-green-100 text-green-700' }[r] || 'bg-gray-100 text-gray-700')
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all registered users and their permissions</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by name, email, or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="input">
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
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
        ) : users.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-600 mb-6">{searchQuery || filterRole !== 'all' || filterStatus !== 'all' ? 'Try adjusting filters' : 'No users registered yet'}</p>
            <button onClick={() => { setSearchQuery(''); setFilterRole('all'); setFilterStatus('all') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Joined</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Last Active</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            {u.profilePicture ? <img src={u.profilePicture} alt={u.name} className="w-full h-full rounded-xl object-cover" /> : <span className="text-sm font-bold text-primary-600">{u.name?.charAt(0)}</span>}
                          </div>
                          <div><p className="font-semibold text-gray-900">{u.name}</p><p className="text-sm text-gray-500">{u.email}</p></div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getRoleColor(u.role)}`}>{u.role}</span></td>
                      <td className="px-6 py-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${getStatusColor(u.status)}`}>{u.status}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(u.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{u.lastLogin ? formatDate(u.lastLogin) : 'Never'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelectedUser(u)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><Edit className="w-4 h-4" /></button>
                          <button onClick={() => handleStatusToggle(u._id, u.status)} className={`p-1.5 rounded-lg transition-all ${u.status === 'active' ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-50' : 'text-green-500 hover:text-green-700 hover:bg-green-50'}`}>
                            {u.status === 'active' ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setSelectedUser(u); setShowDeleteModal(true) }} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
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
              <button onClick={() => fetchUsers(pagination.current - 1)} disabled={pagination.current === 1} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Previous</button>
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1
                return <button key={page} onClick={() => fetchUsers(page)} className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${page === pagination.current ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>{page}</button>
              })}
              <button onClick={() => fetchUsers(pagination.current + 1)} disabled={pagination.current === pagination.pages} className="px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 text-sm">Next</button>
            </div>
          </div>
        )}
      </div>

      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-500 rounded-xl flex items-center justify-center"><X className="w-6 h-6 text-white" /></div>
                <h3 className="text-xl font-bold text-gray-900">Delete User</h3>
              </div>
              <p className="text-gray-600 mb-2">Are you sure you want to delete <strong>{selectedUser.name}</strong>?</p>
              <p className="text-sm text-gray-500 mb-6">This action cannot be undone. All user data will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 btn-outline">Cancel</button>
                <button onClick={() => handleDelete(selectedUser._id)} className="flex-1 btn-error">Delete User</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
