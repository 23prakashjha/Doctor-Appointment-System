import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { authService } from '../../services/api'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Calendar, MapPin, Save, Camera } from 'lucide-react'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone,
        age: user.age,
        gender: user.gender,
        address: user.address
      })
    }
  }, [user, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      
      // Add form fields
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key])
        }
      })

      // Add profile image if changed
      if (profileImage) {
        formData.append('profilePicture', profileImage)
      }

      const response = await authService.updateProfile(formData)
      
      if (response.data.success) {
        updateUser({ user: response.data.data.user })
        toast.success('Profile updated successfully!')
        setProfileImage(null)
        setPreviewImage(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
            <p className="text-sm text-gray-600 mt-1">
              Update your personal details and profile information
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Image */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto overflow-hidden">
                      {previewImage || user?.profilePicture ? (
                        <img
                          src={previewImage || user?.profilePicture}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Click to change profile picture
                  </p>
                  <p className="text-xs text-gray-500">
                    Maximum file size: 5MB
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                        type="text"
                        className="input pl-10"
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
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
                        placeholder="john@example.com"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register('phone', {
                          required: 'Phone number is required',
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Phone number must be 10 digits',
                          },
                        })}
                        type="tel"
                        className="input pl-10"
                        placeholder="1234567890"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register('age', {
                          required: 'Age is required',
                          min: {
                            value: 1,
                            message: 'Age must be at least 1',
                          },
                          max: {
                            value: 120,
                            message: 'Age cannot exceed 120',
                          },
                        })}
                        type="number"
                        className="input pl-10"
                        placeholder="25"
                      />
                    </div>
                    {errors.age && (
                      <p className="mt-1 text-sm text-error-600">{errors.age.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                      Gender *
                    </label>
                    <select
                      {...register('gender', {
                        required: 'Gender is required',
                      })}
                      className="input"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && (
                      <p className="mt-1 text-sm text-error-600">{errors.gender.message}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <textarea
                      {...register('address')}
                      rows={3}
                      className="input pl-10 resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-error-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  reset()
                  setProfileImage(null)
                  setPreviewImage(null)
                }}
                className="btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="spinner w-4 h-4 mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account security and preferences
            </p>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <button className="btn-outline btn-sm">
                Change Password
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <button className="btn-outline btn-sm">
                Enable 2FA
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Manage email preferences</p>
              </div>
              <button className="btn-outline btn-sm">
                Configure
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
