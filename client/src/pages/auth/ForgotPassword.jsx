import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // Simulate API call
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="w-10 h-10 text-success-600" />
            </div>
            
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Check Your Email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to:
            </p>
            
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900">{email}</p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Click the link in the email to reset your password. 
                If you don't see the email, check your spam folder.
              </p>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => setEmailSent(false)}
                  className="btn-outline"
                >
                  Try Another Email
                </button>
                
                <Link
                  to="/login"
                  className="flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="input pl-10"
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner w-5 h-5 mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="flex items-center justify-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Link>
          </div>
        </form>

        {/* Help Section */}
        <div className="mt-8 bg-gray-100 rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Need Help?
          </h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Make sure to check your spam folder</li>
            <li>• The reset link will expire in 24 hours</li>
            <li>• If you don't receive the email, contact support</li>
          </ul>
          <Link
            to="/contact"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm mt-3 inline-block"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
