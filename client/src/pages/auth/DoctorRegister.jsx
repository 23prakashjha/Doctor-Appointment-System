import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  Calendar,
  MapPin,
  Briefcase,
  Award,
  FileText,
  Clock,
  Globe,
  GraduationCap,
  Stethoscope
} from 'lucide-react'

const DoctorRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const specialties = [
    'General Practice',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'Neurology',
    'Psychiatry',
    'Oncology',
    'Endocrinology',
    'Gastroenterology',
    'Pulmonology',
    'Nephrology',
    'Urology',
    'Rheumatology',
    'Ophthalmology',
    'ENT',
    'Anesthesiology',
    'Radiology',
    'Pathology'
  ]

  const languages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
    'Bengali', 'Urdu', 'Tamil', 'Telugu', 'Marathi', 'Gujarati'
  ]

  const onSubmit = async (data) => {
    setIsLoading(true)
    
    // Prepare doctor data with role
    const doctorData = {
      ...data,
      role: 'doctor',
      consultationFee: parseInt(data.consultationFee),
      experience: parseInt(data.experience),
      age: parseInt(data.age)
    }

    const result = await registerUser(doctorData)
    
    if (result.success) {
      // After successful registration, redirect to doctor dashboard
      navigate('/dashboard/doctor')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Stethoscope className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Doctor Registration
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our network of healthcare professionals and start helping patients today
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('name', {
                        required: 'Full name is required',
                        minLength: {
                          value: 2,
                          message: 'Name must be at least 2 characters'
                        }
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="Dr. John Smith"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="input pl-10"
                      placeholder="doctor@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('phone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: 'Phone number must be 10 digits'
                        }
                      })}
                      type="tel"
                      className="input pl-10"
                      placeholder="1234567890"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('age', {
                        required: 'Age is required',
                        min: {
                          value: 25,
                          message: 'Minimum age is 25 years'
                        },
                        max: {
                          value: 70,
                          message: 'Maximum age is 70 years'
                        }
                      })}
                      type="number"
                      className="input pl-10"
                      placeholder="35"
                    />
                  </div>
                  {errors.age && (
                    <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    {...register('gender', {
                      required: 'Gender is required'
                    })}
                    className="input"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('experience', {
                        required: 'Experience is required',
                        min: {
                          value: 0,
                          message: 'Experience cannot be negative'
                        },
                        max: {
                          value: 50,
                          message: 'Maximum experience is 50 years'
                        }
                      })}
                      type="number"
                      className="input pl-10"
                      placeholder="10"
                    />
                  </div>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <GraduationCap className="w-6 h-6 mr-2 text-blue-600" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization *
                  </label>
                  <select
                    {...register('specialization', {
                      required: 'Specialization is required'
                    })}
                    className="input"
                  >
                    <option value="">Select Specialization</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>
                        {specialty}
                      </option>
                    ))}
                  </select>
                  {errors.specialization && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialization.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qualification *
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('qualification', {
                        required: 'Qualification is required'
                      })}
                      type="text"
                      className="input pl-10"
                      placeholder="MBBS, MD, MS..."
                    />
                  </div>
                  {errors.qualification && (
                    <p className="mt-1 text-sm text-red-600">{errors.qualification.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Fee ($) *
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('consultationFee', {
                        required: 'Consultation fee is required',
                        min: {
                          value: 0,
                          message: 'Fee cannot be negative'
                        }
                      })}
                      type="number"
                      className="input pl-10"
                      placeholder="100"
                    />
                  </div>
                  {errors.consultationFee && (
                    <p className="mt-1 text-sm text-red-600">{errors.consultationFee.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <select
                      {...register('languages')}
                      className="input pl-10"
                      multiple
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple</p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio / Professional Summary *
                </label>
                <textarea
                  {...register('bio', {
                    required: 'Bio is required',
                    minLength: {
                      value: 50,
                      message: 'Bio must be at least 50 characters'
                    },
                    maxLength: {
                      value: 500,
                      message: 'Bio cannot exceed 500 characters'
                    }
                  })}
                  rows={4}
                  className="input"
                  placeholder="Tell patients about your expertise, experience, and approach to healthcare..."
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            </div>

            {/* Clinic Information */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                Clinic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Name *
                  </label>
                  <input
                    {...register('clinicName', {
                      required: 'Clinic name is required'
                    })}
                    type="text"
                    className="input"
                    placeholder="City Medical Center"
                  />
                  {errors.clinicName && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinicName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clinic Address *
                  </label>
                  <input
                    {...register('clinicAddress', {
                      required: 'Clinic address is required'
                    })}
                    type="text"
                    className="input"
                    placeholder="123 Medical Street, City, State"
                  />
                  {errors.clinicAddress && (
                    <p className="mt-1 text-sm text-red-600">{errors.clinicAddress.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    {...register('city', {
                      required: 'City is required'
                    })}
                    type="text"
                    className="input"
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('workingHours')}
                      type="text"
                      className="input pl-10"
                      placeholder="Mon-Fri: 9AM-6PM, Sat: 9AM-2PM"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Password Fields */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-blue-600" />
                Security
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 8,
                          message: 'Password must be at least 8 characters'
                        },
                        pattern: {
                          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                          message: 'Password must contain at least one uppercase, one lowercase, and one number'
                        }
                      })}
                      type={showPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === password || 'Passwords do not match'
                      })}
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="input pl-10 pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms and Submit */}
            <div className="space-y-6">
              <div className="flex items-start">
                <input
                  {...register('agreeTerms', {
                    required: 'You must agree to the terms and conditions'
                  })}
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-3 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms of Service
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 font-medium">
                    Privacy Policy
                  </Link>
                  {' '}and confirm that all provided information is accurate and truthful.
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms.message}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Doctor Account'
                  )}
                </button>

                <Link
                  to="/login"
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 text-center"
                >
                  Already have an account? Sign In
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DoctorRegister
