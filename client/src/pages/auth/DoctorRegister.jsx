import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Calendar, MapPin,
  Briefcase, Award, FileText, Clock, Globe, GraduationCap, Stethoscope
} from 'lucide-react'

const DoctorRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const password = watch('password')

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard/admin')
    }
  }, [isAuthenticated, navigate])

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
    const doctorData = { ...data, role: 'doctor', consultationFee: parseInt(data.consultationFee), experience: parseInt(data.experience), age: parseInt(data.age) }
    await registerUser(doctorData)
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-200/50">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Doctor Registration</h1>
          <p className="text-lg text-gray-600">Join our network of healthcare professionals</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 md:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
            {/* Personal Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} type="text" className="input pl-11" placeholder="Dr. John Smith" />
                  </div>
                  {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} type="email" className="input pl-11" placeholder="doctor@example.com" />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-500 font-medium">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' } })} type="tel" className="input pl-11" placeholder="1234567890" />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone.message}</p>}
                </div>
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
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-500 font-medium">{errors.gender.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years) *</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input {...register('experience', { required: 'Experience is required', min: { value: 0, message: 'Cannot be negative' }, max: { value: 50, message: 'Max 50 years' } })} type="number" className="input pl-11" placeholder="10" />
                  </div>
                  {errors.experience && <p className="mt-1 text-sm text-red-500 font-medium">{errors.experience.message}</p>}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Professional Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="mt-5">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio / Professional Summary *</label>
                <textarea {...register('bio', { required: 'Bio is required', minLength: { value: 50, message: 'Min 50 characters' }, maxLength: { value: 500, message: 'Max 500 characters' } })} rows={4} className="input" placeholder="Tell patients about your expertise, experience, and approach to healthcare..." />
                {errors.bio && <p className="mt-1 text-sm text-red-500 font-medium">{errors.bio.message}</p>}
              </div>
            </div>

            {/* Clinic Information */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Clinic Information</h2>
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
            </div>

            {/* Security */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Security</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                    <input {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Min 8 characters' },
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Need uppercase, lowercase & number' }
                    })} type={showPassword ? 'text' : 'password'} className="input pl-11 pr-11" placeholder="••••••••" />
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
                    <input {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (value) => value === password || 'Passwords do not match'
                    })} type={showConfirmPassword ? 'text' : 'password'} className="input pl-11 pr-11" placeholder="••••••••" />
                    <button type="button" className="absolute right-3.5 top-3.5" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500 font-medium">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="space-y-6">
              <div className="flex items-start">
                <input {...register('agreeTerms', { required: 'You must agree to the terms' })} type="checkbox" className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <label className="ml-3 text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-semibold">Terms of Service</Link> and{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-semibold">Privacy Policy</Link>
                </label>
              </div>
              {errors.agreeTerms && <p className="text-sm text-red-500 font-medium">{errors.agreeTerms.message}</p>}

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" disabled={isLoading} className="flex-1 btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed">
                  {isLoading ? (
                    <span className="inline-flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : 'Create Doctor Account'}
                </button>
                <Link to="/login" className="flex-1 btn-outline text-center flex items-center justify-center">Already have an account? Sign In</Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorRegister
