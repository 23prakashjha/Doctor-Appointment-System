import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, ArrowLeft, Search, Stethoscope, Calendar, FileText } from 'lucide-react'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="w-28 h-28 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200/50">
          <span className="text-5xl font-extrabold text-white">404</span>
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8 text-left">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What were you looking for?</h2>
          <div className="space-y-2">
            {[
              { to: '/doctors', icon: Stethoscope, title: 'Find a Doctor', desc: 'Search and book appointments with certified doctors' },
              { to: '/dashboard/user/appointments', icon: Calendar, title: 'My Appointments', desc: 'View and manage your upcoming appointments' },
              { to: '/blogs', icon: FileText, title: 'Health Blogs', desc: 'Read latest health tips and medical insights' }
            ].map((item, i) => (
              <Link key={i} to={item.to} className="flex items-center gap-4 p-3 hover:bg-gradient-to-r hover:from-primary-50 hover:to-purple-50 rounded-xl transition-all group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button onClick={() => navigate(-1)} className="btn-outline inline-flex items-center justify-center"><ArrowLeft className="w-4 h-4 mr-2" />Go Back</button>
          <Link to="/" className="btn-primary inline-flex items-center justify-center"><Home className="w-4 h-4 mr-2" />Go Home</Link>
        </div>

        <div className="text-center">
          <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
          <div className="flex justify-center gap-6">
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-semibold">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
