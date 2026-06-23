import React, { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Menu,
  X,
  Home,
  Users,
  Calendar,
  CreditCard,
  Star,
  FileText,
  Settings,
  LogOut,
  Bell,
  User,
  Stethoscope,
  TrendingUp,
  BookOpen,
  MessageSquare,
  Activity,
  ChevronLeft,
  ChevronRight,
  HelpCircle
} from 'lucide-react'

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getMenuItems = () => {
    if (!user) return []

    if (user.role === 'user') {
      return [
        { label: 'Dashboard', icon: Home, href: '/dashboard/user' },
        { label: 'My Appointments', icon: Calendar, href: '/dashboard/user/appointments' },
        { label: 'Find Doctors', icon: Users, href: '/doctors' },
        { label: 'Payments', icon: CreditCard, href: '/dashboard/user/payments' },
        { label: 'Reviews', icon: Star, href: '/dashboard/user/reviews' },
        { label: 'Health Blogs', icon: FileText, href: '/blogs' },
      ]
    } else if (user.role === 'doctor') {
      return [
        { label: 'Dashboard', icon: Home, href: '/dashboard/doctor' },
        { label: 'My Profile', icon: User, href: '/dashboard/doctor/profile' },
        { label: 'Appointments', icon: Calendar, href: '/dashboard/doctor/appointments' },
        { label: 'Patients', icon: Users, href: '/dashboard/doctor/patients' },
        { label: 'Earnings', icon: TrendingUp, href: '/dashboard/doctor/earnings' },
        { label: 'Reviews', icon: Star, href: '/dashboard/user/reviews' },
      ]
    } else if (user.role === 'admin') {
      return [
        { label: 'Dashboard', icon: Home, href: '/dashboard/admin' },
        { label: 'Users', icon: Users, href: '/dashboard/admin/users' },
        { label: 'Doctors', icon: Stethoscope, href: '/dashboard/admin/doctors' },
        { label: 'Appointments', icon: Calendar, href: '/dashboard/admin/appointments' },
        { label: 'Payments', icon: CreditCard, href: '/dashboard/admin/payments' },
        { label: 'Blogs', icon: BookOpen, href: '/dashboard/admin/blogs' },
        { label: 'Diseases', icon: FileText, href: '/dashboard/admin/diseases' },
        { label: 'Notifications', icon: Bell, href: '/dashboard/admin/notifications' },
      ]
    }
    return []
  }

  const menuItems = getMenuItems()

  const isActive = (href) => {
    if (href === '/dashboard/user' && location.pathname === '/dashboard/user') return true
    if (href === '/dashboard/doctor' && location.pathname === '/dashboard/doctor') return true
    if (href === '/dashboard/admin' && location.pathname === '/dashboard/admin') return true
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-white shadow-xl shadow-gray-200/50 border-r border-gray-100
        transform transition-all duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className={`flex items-center justify-between h-16 px-4 border-b border-gray-100 ${isCollapsed ? 'lg:px-5' : 'lg:px-6'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && <span className="text-xl font-bold text-gray-900">DocCare</span>}
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-4 px-3 overflow-y-auto scrollbar-thin" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    group flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-primary-50 to-primary-50/50 text-primary-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className={`flex items-center justify-center w-5 h-5 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                  {active && !isCollapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600"></div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Collapse toggle - desktop only */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full mt-6 px-3 py-2 text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4 mr-2" />}
            {!isCollapsed && 'Collapse'}
          </button>
        </nav>

        {/* User profile at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 border-t border-gray-100 bg-white p-3 ${isCollapsed ? 'lg:p-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : ''} px-3 py-2 rounded-xl bg-gray-50/80`}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-white text-xs font-semibold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            {!isCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize truncate">{user?.role}</p>
              </div>
            )}
            {!isCollapsed && (
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500">
                <span className="font-medium text-gray-900 capitalize">{user?.role}</span>
                <span>/</span>
                <span className="capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <MessageSquare className="w-5 h-5" />
              </button>
              <button className="p-2.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                <HelpCircle className="w-5 h-5" />
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">{user?.name?.split(' ')[0]}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-fade-in">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout
