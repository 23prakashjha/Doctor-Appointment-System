import React from 'react'
import { Link } from 'react-router-dom'
import { Home, RefreshCw, AlertTriangle, Mail } from 'lucide-react'

const ServerError = () => {
  const handleRefresh = () => window.location.reload()

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-red-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-200/50">
          <AlertTriangle className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Server Error</h1>
        <p className="text-lg text-gray-600 mb-8">Something went wrong on our end. Please try again later.</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 text-left">
          <h2 className="text-lg font-bold text-gray-900 mb-3">What happened?</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>Our servers are experiencing temporary issues</li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>The service might be under maintenance</li>
            <li className="flex items-start gap-2"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></span>There could be a network connectivity problem</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What you can do</h2>
          <div className="space-y-3">
            {['Refresh the page and try again', 'Check your internet connection', 'Try again in a few minutes', 'Contact support if the problem persists'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-600">{i + 1}</span>
                </div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button onClick={handleRefresh} className="btn-primary inline-flex items-center justify-center"><RefreshCw className="w-4 h-4 mr-2" />Refresh Page</button>
          <Link to="/" className="btn-outline inline-flex items-center justify-center"><Home className="w-4 h-4 mr-2" />Go Home</Link>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-100/50 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Still having trouble?</h3>
          <p className="text-gray-600 mb-4">Our support team is here to help you resolve any issues.</p>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="inline-flex items-center gap-2"><Mail className="w-4 h-4 text-gray-500" /> support@doccare.com</div>
          </div>
          <Link to="/contact" className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-semibold">Contact Support Team</Link>
        </div>

        <p className="mt-8 text-sm text-gray-400">Error Code: 500 • Timestamp: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}

export default ServerError
