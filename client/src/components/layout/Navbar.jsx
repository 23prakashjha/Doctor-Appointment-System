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
      case 'doctor': return '/dashboard/admin'
      case 'admin': return '/dashboard/admin'
      default: return '/dashboard/user'
    }
  }

  const getProfileMenuItems = () => {
    if (!user) return []
    const baseItems = [
      { label: 'Dashboard', icon: <Calendar className="w-4 h-4" />, href: getDashboardLink() },
      { label: 'Profile', icon: <User className="w-4 h-4" />, href: user.role === 'doctor' ? '/dashboard/admin/profile' : '/dashboard/user/profile' },
    ]
    if (user.role === 'user') {
      baseItems.push(
        { label: 'Appointments', icon: <Calendar className="w-4 h-4" />, href: '/dashboard/user/appointments' },
        { label: 'Payments', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/user/payments' },
        { label: 'Reviews', icon: <Star className="w-4 h-4" />, href: '/dashboard/user/reviews' }
      )
    } else if (user.role === 'doctor') {
      baseItems.push(
        { label: 'My Appointments', icon: <Calendar className="w-4 h-4" />, href: '/dashboard/admin/appointments' },
        { label: 'Patients', icon: <User className="w-4 h-4" />, href: '/dashboard/admin/patients' },
        { label: 'Earnings', icon: <CreditCard className="w-4 h-4" />, href: '/dashboard/admin/earnings' }
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
    { label: 'Doctors', href: '/doctors' },
    { label: 'Health Blogs', href: '/blogs' },
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/[0.06]'
        : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              DocCare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`nav-link-dark px-4 py-2 text-sm ${
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
                <button className="relative p-2.5 text-gray-400 hover:text-emerald-400 hover:bg-white/[0.06] rounded-xl transition-all duration-200">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-gray-900"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 pr-3 rounded-xl hover:bg-white/[0.06] transition-all duration-200 border border-transparent hover:border-white/[0.1]"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-200">{user?.name?.split(' ')[0]}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/[0.08] py-2 animate-fade-in-down">
                      <div className="px-4 py-3 border-b border-white/[0.06]">
                        <p className="text-sm font-semibold text-white">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                      </div>
                      {getProfileMenuItems().map((item, index) => (
                        <div key={index}>
                          {item.href ? (
                            <Link
                              to={item.href}
                              className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors ${item.className || ''}`}
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={item.onClick}
                              className={`flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors w-full text-left ${item.className || ''}`}
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
                  className="inline-flex items-center px-4 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Sign Up
                  <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/[0.08] py-2 animate-fade-in-down">
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <LogIn className="w-4 h-4 text-emerald-400" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <UserPlus className="w-4 h-4 text-emerald-400" />
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
              isMenuOpen ? 'bg-white/[0.08] text-white' : 'text-gray-300 hover:bg-white/[0.06]'
            }`}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        }`}>
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/[0.08] p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-300 hover:bg-white/[0.06] hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-white/[0.06] pt-3 mt-3 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/[0.06] rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{user?.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Link
                    to={getDashboardLink()}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/[0.06] hover:text-white transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
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
