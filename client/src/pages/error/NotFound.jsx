import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl font-bold text-primary-600">404</span>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>

          {/* Search Suggestions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What were you looking for?
            </h2>
            <div className="space-y-3">
              <Link
                to="/doctors"
                className="flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Find a Doctor</p>
                    <p className="text-sm text-gray-600">Search and book appointments with certified doctors</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/dashboard/user/appointments"
                className="flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">My Appointments</p>
                    <p className="text-sm text-gray-600">View and manage your upcoming appointments</p>
                  </div>
                </div>
              </Link>
              
              <Link
                to="/blogs"
                className="flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">Health Blogs</p>
                    <p className="text-sm text-gray-600">Read latest health tips and medical insights</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn-outline flex items-center justify-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </button>
            <Link
              to="/"
              className="btn-primary flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-12 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Need Help?
            </h3>
            <p className="text-gray-600 mb-4">
              If you continue to have trouble, please contact our support team.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/contact"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Contact Support
              </Link>
              <Link
                to="/help"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
