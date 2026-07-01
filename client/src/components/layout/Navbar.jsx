import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  Menu,
  X,
  User,
  Stethoscope,
  Calendar,
  CreditCard,
  Star,
  FileText,
  Settings,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Heart,
  Shield,
  Clock,
  LogIn,
  UserPlus
} from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsProfileMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    navigate('/')
    setIsProfileMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!user) return '/login'
    switch (user.role) {
      case 'doctor': return '/dashboard/doctor'
      case 'admin': return '/dashboard/admin'
      default: return '/dashboard/user'
    }
  }

  const getProfileMenuItems = () => {
    if (!user) return []
    const baseItems = [
      { label: 'Dashboard', icon: <Calendar className="w-4 h-4" />, href: getDashboardLink() },
      { label: 'Profile', icon: <User className="w-4 h-4" />, href: user.role === 'doctor' ? '/dashboard/doctor/profile' : '/dashboard/user/profile' },
    ]
    if (user.role === 'user') {
      baseItems.push(
        { label: 'Appointments', icon: <Calendar className="w-4 h-4" />, href: '/dashboard/user/appointments' },
        { label: 'Payments', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/user/payments' },
        { label: 'Reviews', icon: <Star className="w-4 h-4" />, href: '/dashboard/user/reviews' }
      )
    } else if (user.role === 'doctor') {
      baseItems.push(
        { label: 'My Appointments', icon: <Calendar className="w-4 h-4" />, href: '/dashboard/doctor/appointments' },
        { label: 'Patients', icon: <User className="w-4 h-4" />, href: '/dashboard/doctor/patients' },
        { label: 'Earnings', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/doctor/earnings' }
      )
    }
    baseItems.push(
      { label: 'Settings', icon: <Settings className="w-4 h-4" />, href: '/dashboard/settings' },
      { label: 'Logout', icon: <LogOut className="w-4 h-4" />, onClick: handleLogout, className: 'text-red-600 hover:text-red-700 hover:bg-red-50' }
    )
    return baseItems
  }

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Health Blogs', href: '/blogs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-100/50'
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300 group-hover:scale-105">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
              DocCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link px-4 py-2 text-sm ${
                  location.pathname === link.href ? 'active' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <button className="relative p-2.5 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100/80 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                      </div>
                      {getProfileMenuItems().map((item, index) => (
                        <div key={index}>
                          {item.href ? (
                            <Link
                              to={item.href}
                              className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${item.className || ''}`}
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={item.onClick}
                              className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left ${item.className || ''}`}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="btn-primary btn-sm shadow-lg shadow-primary-500/20 inline-flex items-center"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Sign Up
                  <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-fade-in-down">
                    <div className="px-4 pb-2 border-b border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Patients</p>
                    </div>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 text-primary-500" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 text-green-500" />
                      <span>Register</span>
                    </Link>
                    <div className="mt-2 px-4 pt-2 border-t border-gray-100">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Doctors</p>
                    </div>
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 text-primary-500" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/doctor-register"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Stethoscope className="w-4 h-4 text-purple-500" />
                      <span>Register</span>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-200 ${
              isMenuOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}>
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-100 p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="px-4 pt-2 pb-1">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Patients</p>
                  </div>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-primary-500" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-green-500" />
                    <span>Register</span>
                  </Link>
                  <div className="px-4 pt-2 pb-1 mt-1 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">For Doctors</p>
                  </div>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-primary-500" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/doctor-register"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Stethoscope className="w-4 h-4 text-purple-500" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
