import React from 'react'
import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react'

const ServerError = () => {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mx-auto w-24 h-24 bg-error-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-12 h-12 text-error-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Server Error
          </h1>
          <p className="text-gray-600 mb-8">
            Something went wrong on our end. Please try again later.
          </p>

          {/* Error Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What happened?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="text-error-600 mr-2">•</span>
                <span>Our servers are experiencing temporary issues</span>
              </div>
              <div className="flex items-start">
                <span className="text-error-600 mr-2">•</span>
                <span>The service might be under maintenance</span>
              </div>
              <div className="flex items-start">
                <span className="text-error-600 mr-2">•</span>
                <span>There could be a network connectivity problem</span>
              </div>
            </div>
          </div>

          {/* Troubleshooting Steps */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              What you can do
            </h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">1</span>
                </div>
                <span className="text-sm text-gray-700">Refresh the page and try again</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">2</span>
                </div>
                <span className="text-sm text-gray-700">Check your internet connection</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">3</span>
                </div>
                <span className="text-sm text-gray-700">Try again in a few minutes</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-sm font-medium text-gray-600">4</span>
                </div>
                <span className="text-sm text-gray-700">Contact support if the problem persists</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={handleRefresh}
              className="btn-primary flex items-center justify-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
            <Link
              to="/"
              className="btn-outline flex items-center justify-center"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </div>

          {/* Contact Support */}
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Still having trouble?
            </h3>
            <p className="text-gray-600 mb-4">
              Our support team is here to help you resolve any issues.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                support@doccare.com
              </div>
              <div className="flex items-center justify-center text-sm text-gray-600">
                <span>Phone: +1 (555) 123-4567</span>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support Team
            </Link>
          </div>

          {/* Status Check */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Error Code: 500 • Timestamp: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServerError
