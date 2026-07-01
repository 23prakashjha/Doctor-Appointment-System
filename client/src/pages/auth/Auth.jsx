import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Users, Stethoscope,
  Sparkles, Briefcase, Award, FileText, Clock, Globe, GraduationCap, MapPin
} from 'lucide-react'

const LoginRegister = () => {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userRole, setUserRole] = useState('user')
  const { login, register: registerUser, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated && user) {
      const path = user.role === 'doctor' || user.role === 'admin'
        ? '/dashboard/admin'
        : '/dashboard/user'
      navigate(path)
    }
  }, [isAuthenticated, user, navigate])

  const switchMode = (newMode) => {
    setMode(newMode)
    reset()
  }

  const specialties = [
    'General Practice', 'Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics',
    'Gynecology', 'Neurology', 'Psychiatry', 'Oncology', 'Endocrinology',
    'Gastroenterology', 'Pulmonology', 'Nephrology', 'Urology', 'Rheumatology',
    'Ophthalmology', 'ENT', 'Anesthesiology', 'Radiology', 'Pathology'
  ]

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Bengali', 'Urdu', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    if (mode === 'login') {
      await login(data)
    } else {
      const formData = {
        ...data,
        role: userRole,
        consultationFee: data.consultationFee ? parseInt(data.consultationFee) : undefined,
        experience: data.experience ? parseInt(data.experience) : undefined,
        age: data.age ? parseInt(data.age) : undefined,
      }
      await registerUser(formData)
    }
    setIsLoading(false)
  }

  const isLogin = mode === 'login'
  const isDoctor = userRole === 'doctor'

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
        <div className="absolute top-20 -left-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -right-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>

        <div className="relative text-center px-12 max-w-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/10">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            {isLogin ? 'Welcome Back!' : 'Join DocCare Today!'}
          </h2>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            {isLogin
              ? 'Your health journey continues here. Sign in to manage appointments, consult with doctors, and track your healthcare progress.'
              : 'Start your healthcare journey with us. Create an account to book appointments, consult with top doctors, and manage your health records.'}
          </p>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-blue-100 text-sm">500+ verified doctors available</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-blue-100 text-sm">Easy online appointment booking</span>
            </div>
            <div className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-xl px-5 py-3 border border-white/10">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span className="text-blue-100 text-sm">24/7 healthcare support</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 ${isDoctor ? 'py-6' : 'py-12'}`}>
        <div className={`w-full ${isDoctor ? 'max-w-2xl' : 'max-w-md'}`}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">DocCare</span>
            </Link>
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin ? (
                <>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchMode('register')} className="font-semibold text-primary-600 hover:text-primary-500 underline">
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="font-semibold text-primary-600 hover:text-primary-500 underline">
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>

          <div className={`bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 ${isDoctor ? 'p-8 md:p-10' : 'p-8'}`}>
            {!isLogin && (
              <>
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                    I want to register as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => { setUserRole('user'); reset() }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        userRole === 'user'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Users className="w-8 h-8 mx-auto mb-1.5" />
                      <div className="font-semibold text-sm">Patient</div>
                      <div className="text-xs mt-0.5 opacity-75">Book appointments</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setUserRole('doctor'); reset() }}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        userRole === 'doctor'
                          ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <Stethoscope className="w-8 h-8 mx-auto mb-1.5" />
                      <div className="font-semibold text-sm">Doctor</div>
                      <div className="text-xs mt-0.5 opacity-75">Provide healthcare</div>
                    </button>
                  </div>
                </div>
              </>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {isLogin ? (
                <>
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })}
                        type="email" autoComplete="email" className="input pl-11" placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                        type={showPassword ? 'text' : 'password'} autoComplete="current-password" className="input pl-11 pr-11" placeholder="Enter your password"
                      />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>}
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <input type="checkbox" autoComplete="off" className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-600">Remember me</span>
                    </label>
                    <Link to="/forgot-password" className="text-sm font-semibold text-primary-600 hover:text-primary-500">Forgot password?</Link>
                  </div>
                </>
              ) : isDoctor ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} type="text" autoComplete="name" className="input pl-11" placeholder="Dr. John Smith" />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} type="email" autoComplete="email" className="input pl-11" placeholder="doctor@example.com" />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' } })} type="tel" autoComplete="tel" className="input pl-11" placeholder="1234567890" />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age *</label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                          <input {...register('age', { required: 'Age is required', min: { value: 25, message: 'Min age is 25' }, max: { value: 70, message: 'Max age is 70' } })} type="number" className="input pl-11" placeholder="35" />
                        </div>
                        {errors.age && <p className="mt-1 text-sm text-red-500 font-medium">{errors.age.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender *</label>
                        <select {...register('gender', { required: 'Gender is required' })} className="input">
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-sm text-red-500 font-medium">{errors.gender.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years) *</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('experience', { required: 'Experience is required', min: { value: 0, message: 'Cannot be negative' }, max: { value: 50, message: 'Max 50 years' } })} type="number" className="input pl-11" placeholder="10" />
                      </div>
                      {errors.experience && <p className="mt-1 text-sm text-red-500 font-medium">{errors.experience.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization *</label>
                      <select {...register('specialization', { required: 'Specialization is required' })} className="input">
                        <option value="">Select Specialization</option>
                        {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.specialization && <p className="mt-1 text-sm text-red-500 font-medium">{errors.specialization.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualification *</label>
                      <div className="relative">
                        <Award className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('qualification', { required: 'Qualification is required' })} type="text" className="input pl-11" placeholder="MBBS, MD, MS..." />
                      </div>
                      {errors.qualification && <p className="mt-1 text-sm text-red-500 font-medium">{errors.qualification.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee (₹) *</label>
                      <div className="relative">
                        <FileText className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('consultationFee', { required: 'Fee is required', min: { value: 0, message: 'Cannot be negative' } })} type="number" className="input pl-11" placeholder="500" />
                      </div>
                      {errors.consultationFee && <p className="mt-1 text-sm text-red-500 font-medium">{errors.consultationFee.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Languages</label>
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400 z-10" />
                        <select {...register('languages')} className="input pl-11" multiple>
                          {languages.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <p className="mt-1 text-xs text-gray-400">Hold Ctrl/Cmd to select multiple</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / Professional Summary *</label>
                    <textarea {...register('bio', { required: 'Bio is required', minLength: { value: 50, message: 'Min 50 characters' }, maxLength: { value: 500, message: 'Max 500 characters' } })} rows={3} className="input" placeholder="Tell patients about your expertise, experience, and approach to healthcare..." />
                    {errors.bio && <p className="mt-1 text-sm text-red-500 font-medium">{errors.bio.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clinic Name *</label>
                      <input {...register('clinicName', { required: 'Clinic name is required' })} type="text" className="input" placeholder="City Medical Center" />
                      {errors.clinicName && <p className="mt-1 text-sm text-red-500 font-medium">{errors.clinicName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Clinic Address *</label>
                      <input {...register('clinicAddress', { required: 'Address is required' })} type="text" className="input" placeholder="123 Medical Street, City, State" />
                      {errors.clinicAddress && <p className="mt-1 text-sm text-red-500 font-medium">{errors.clinicAddress.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                      <input {...register('city', { required: 'City is required' })} type="text" className="input" placeholder="New York" />
                      {errors.city && <p className="mt-1 text-sm text-red-500 font-medium">{errors.city.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Working Hours</label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('workingHours')} type="text" className="input pl-11" placeholder="Mon-Fri: 9AM-6PM" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Min 8 characters' }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Need uppercase, lowercase & number' } })} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="input pl-11 pr-11" placeholder="••••••••" />
                        <button type="button" className="absolute right-3.5 top-3.5" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                      {errors.password && <p className="mt-1 text-sm text-red-500 font-medium">{errors.password.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password *</label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" className="input pl-11 pr-11" placeholder="••••••••" />
                        <button type="button" className="absolute right-3.5 top-3.5" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'Name must be at least 2 characters' } })} type="text" autoComplete="name" className="input pl-11" placeholder="John Doe" />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' } })} type="email" autoComplete="email" className="input pl-11" placeholder="john@example.com" />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input {...register('phone', { required: 'Phone number is required', pattern: { value: /^[0-9]{10}$/, message: 'Phone number must be 10 digits' } })} type="tel" autoComplete="tel" className="input pl-11" placeholder="9876543210" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input {...register('age', { required: 'Age is required', min: { value: 1, message: 'Min 1' }, max: { value: 120, message: 'Max 120' } })} type="number" autoComplete="off" className="input pl-11" placeholder="25" />
                      </div>
                      {errors.age && <p className="mt-1 text-sm text-error-600">{errors.age.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
                      <select {...register('gender', { required: 'Gender is required' })} className="input">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="mt-1 text-sm text-error-600">{errors.gender.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })} type={showPassword ? 'text' : 'password'} autoComplete="new-password" className="input pl-11 pr-11" placeholder="Create a password" />
                      <button type="button" className="absolute inset-y-0 right-0 pr-3.5 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-error-600">{errors.password.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input {...register('confirmPassword', { required: 'Please confirm your password', validate: (value) => value === password || 'Passwords do not match' })} type="password" autoComplete="new-password" className="input pl-11" placeholder="Confirm your password" />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-error-600">{errors.confirmPassword.message}</p>}
                  </div>
                </>
              )}

              {!isLogin && (
                <div className="flex items-start">
                  <input id="agree-terms" type="checkbox" className="mt-0.5 w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" {...register('agreeTerms', { required: 'You must agree to the terms and conditions' })} />
                  <label htmlFor="agree-terms" className="ml-2 text-sm text-gray-600">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-medium">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-medium">Privacy Policy</Link>
                  </label>
                </div>
              )}
              {!isLogin && errors.agreeTerms && <p className="text-sm text-error-600">{errors.agreeTerms.message}</p>}

              <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign in' : (isDoctor ? 'Create Doctor Account' : 'Create Account')
                )}
              </button>
            </form>

            {isLogin && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchMode('register')} className="font-semibold text-primary-600 hover:text-primary-500 underline">
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginRegister
