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
  MessageSquare
} from 'lucide-react'

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
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
        {
          label: 'Dashboard',
          icon: Home,
          href: '/dashboard/user',
        },
        {
          label: 'My Appointments',
          icon: Calendar,
          href: '/dashboard/user/appointments',
        },
        {
          label: 'Find Doctors',
          icon: Users,
          href: '/doctors',
        },
        {
          label: 'Payments',
          icon: CreditCard,
          href: '/dashboard/user/payments',
        },
        {
          label: 'Reviews',
          icon: Star,
          href: '/dashboard/user/reviews',
        },
        {
          label: 'Health Blogs',
          icon: FileText,
          href: '/blogs',
        },
      ]
    } else if (user.role === 'doctor') {
      return [
        {
          label: 'Dashboard',
          icon: Home,
          href: '/dashboard/doctor',
        },
        {
          label: 'My Profile',
          icon: User,
          href: '/dashboard/doctor/profile',
        },
        {
          label: 'Appointments',
          icon: Calendar,
          href: '/dashboard/doctor/appointments',
        },
        {
          label: 'Patients',
          icon: Users,
          href: '/dashboard/doctor/patients',
        },
        {
          label: 'Earnings',
          icon: TrendingUp,
          href: '/dashboard/doctor/earnings',
        },
        {
          label: 'Reviews',
          icon: Star,
          href: '/dashboard/user/reviews',
        },
      ]
    } else if (user.role === 'admin') {
      return [
        {
          label: 'Dashboard',
          icon: Home,
          href: '/dashboard/admin',
        },
        {
          label: 'Users',
          icon: Users,
          href: '/dashboard/admin/users',
        },
        {
          label: 'Doctors',
          icon: Stethoscope,
          href: '/dashboard/admin/doctors',
        },
        {
          label: 'Appointments',
          icon: Calendar,
          href: '/dashboard/admin/appointments',
        },
        {
          label: 'Payments',
          icon: CreditCard,
          href: '/dashboard/admin/payments',
        },
        {
          label: 'Blogs',
          icon: BookOpen,
          href: '/dashboard/admin/blogs',
        },
        {
          label: 'Diseases',
          icon: FileText,
          href: '/dashboard/admin/diseases',
        },
        {
          label: 'Notifications',
          icon: Bell,
          href: '/dashboard/admin/notifications',
        },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">DocCare</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="px-3 py-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages */}
              <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md">
                <MessageSquare className="w-5 h-5" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
