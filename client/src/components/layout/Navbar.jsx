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
  Search
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
      case 'doctor':
        return '/dashboard/doctor'
      case 'admin':
        return '/dashboard/admin'
      default:
        return '/dashboard/user'
    }
  }

  const getProfileMenuItems = () => {
    if (!user) return []

    const baseItems = [
      {
        label: 'Dashboard',
        icon: <Calendar className="w-4 h-4" />,
        href: getDashboardLink(),
      },
      {
        label: 'Profile',
        icon: <User className="w-4 h-4" />,
        href: user.role === 'doctor' ? '/dashboard/doctor/profile' : '/dashboard/user/profile',
      },
    ]

    if (user.role === 'user') {
      baseItems.push(
        {
          label: 'Appointments',
          icon: <Calendar className="w-4 h-4" />,
          href: '/dashboard/user/appointments',
        },
        {
          label: 'Payments',
          icon: <CreditCard className="w-4 h-4" />,
          href: '/dashboard/user/payments',
        },
        {
          label: 'Reviews',
          icon: <Star className="w-4 h-4" />,
          href: '/dashboard/user/reviews',
        }
      )
    } else if (user.role === 'doctor') {
      baseItems.push(
        {
          label: 'My Appointments',
          icon: <Calendar className="w-4 h-4" />,
          href: '/dashboard/doctor/appointments',
        },
        {
          label: 'Patients',
          icon: <User className="w-4 h-4" />,
          href: '/dashboard/doctor/patients',
        },
        {
          label: 'Earnings',
          icon: <CreditCard className="w-4 h-4" />,
          href: '/dashboard/doctor/earnings',
        }
      )
    }

    baseItems.push(
      {
        label: 'Settings',
        icon: <Settings className="w-4 h-4" />,
        href: '/dashboard/settings',
      },
      {
        label: 'Logout',
        icon: <LogOut className="w-4 h-4" />,
        onClick: handleLogout,
        className: 'text-red-600 hover:text-red-700 hover:bg-red-50',
      }
    )

    return baseItems
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}>
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Stethoscope className="w-8 h-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">DocCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-gray-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/' ? 'text-primary-600 font-medium' : ''
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`text-gray-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/doctors' ? 'text-primary-600 font-medium' : ''
              }`}
            >
              Find Doctors
            </Link>
            <Link
              to="/blogs"
              className={`text-gray-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/blogs' ? 'text-primary-600 font-medium' : ''
              }`}
            >
              Health Blogs
            </Link>
            <Link
              to="/about"
              className={`text-gray-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/about' ? 'text-primary-600 font-medium' : ''
              }`}
            >
              About Us
            </Link>
            <Link
              to="/contact"
              className={`text-gray-700 hover:text-primary-600 transition-colors ${
                location.pathname === '/contact' ? 'text-primary-600 font-medium' : ''
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                      {getProfileMenuItems().map((item, index) => (
                        <div key={index}>
                          {item.href ? (
                            <Link
                              to={item.href}
                              className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors ${
                                item.className || ''
                              }`}
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={item.onClick}
                              className={`flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left ${
                                item.className || ''
                              }`}
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
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/doctor-register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Register as Doctor
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-3">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Home
              </Link>
              <Link
                to="/doctors"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Find Doctors
              </Link>
              <Link
                to="/blogs"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Health Blogs
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Contact
              </Link>
              
              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 pt-3">
                    <Link
                      to={getDashboardLink()}
                      className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/doctor-register"
                    className="block mx-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Register as Doctor
                  </Link>
                  <Link
                    to="/register"
                    className="block mx-4 btn-primary text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
