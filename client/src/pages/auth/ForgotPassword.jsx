import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, CheckCircle, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setEmail(data.email)
      setEmailSent(true)
      toast.success('Password reset instructions sent to your email!')
    } catch (error) {
      toast.error('Failed to send reset instructions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-200/50">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Check Your Email</h2>
            <p className="text-gray-600 mb-6">We've sent password reset instructions to:</p>
            <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4 mb-6 border border-primary-100/50">
              <p className="font-semibold text-gray-900">{email}</p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Click the link in the email to reset your password. If you don't see the email, check your spam folder.</p>
              <div className="flex flex-col gap-3">
                <button onClick={() => setEmailSent(false)} className="btn-outline w-full">Try Another Email</button>
                <Link to="/login" className="inline-flex items-center justify-center text-gray-600 hover:text-gray-900 font-medium">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200/50">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">Reset Your Password</h2>
            <p className="mt-2 text-gray-600">Enter your email and we'll send you a reset link.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                <input {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                })} type="email" autoComplete="email" className="input pl-11" placeholder="Enter your email" />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="w-full btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending...
                </span>
              ) : 'Send Reset Link'}
            </button>

            <div className="text-center">
              <Link to="/login" className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
              </Link>
            </div>
          </form>

          <div className="mt-8 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-5 border border-primary-100/50">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Need Help?</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>Make sure to check your spam folder</li>
              <li>The reset link will expire in 24 hours</li>
              <li>If you don't receive the email, contact support</li>
            </ul>
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-semibold text-sm mt-3 inline-block">Contact Support</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
