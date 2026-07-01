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
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, phone: user.phone, age: user.age, gender: user.gender, address: user.address })
  }, [user, reset])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return }
      setProfileImage(file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => { if (data[key] !== undefined && data[key] !== null) formData.append(key, data[key]) })
      if (profileImage) formData.append('profilePicture', profileImage)
      const response = await authService.updateProfile(formData)
      if (response.data.success) {
        updateUser({ user: response.data.data.user })
        toast.success('Profile updated successfully!')
        setProfileImage(null); setPreviewImage(null)
      }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to update profile') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Update your personal details and profile information</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
                        {previewImage || user?.profilePicture ? (
                          <img src={previewImage || user?.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl font-bold text-primary-600">{user?.name?.charAt(0)}</span>
                        )}
                      </div>
                      <label htmlFor="profile-image" className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl flex items-center justify-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                        <Camera className="w-4 h-4" />
                      </label>
                      <input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </div>
                    <p className="text-sm text-gray-500 mt-3">Click to change profile picture</p>
                    <p className="text-xs text-gray-400">Max 5MB</p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} type="text" autoComplete="name" className="input pl-11" placeholder="John Doe" />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-red-500 font-medium">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('email')} type="email" autoComplete="email" className="input pl-11 bg-gray-50 text-gray-500" disabled />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('phone', { required: 'Phone is required', pattern: { value: /^[0-9]{10}$/, message: 'Must be 10 digits' } })} type="tel" autoComplete="tel" className="input pl-11" placeholder="1234567890" />
                      </div>
                      {errors.phone && <p className="mt-1 text-sm text-red-500 font-medium">{errors.phone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Age *</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('age', { required: 'Age is required', min: { value: 1, message: 'Min 1' }, max: { value: 120, message: 'Max 120' } })} type="number" autoComplete="off" className="input pl-11" placeholder="25" />
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
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                      <textarea {...register('address')} rows={3} className="input pl-11 resize-none" placeholder="Enter your complete address" autoComplete="street-address" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                <button type="button" onClick={() => { reset(); setProfileImage(null); setPreviewImage(null) }} className="btn-outline">Cancel</button>
                <button type="submit" disabled={isLoading} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center">
                  {isLoading ? (
                    <><svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
                  ) : (
                    <><Save className="w-4 h-4 mr-2" />Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Account Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your account security and preferences</p>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl border border-primary-100/50">
              <div><h3 className="font-semibold text-gray-900">Change Password</h3><p className="text-sm text-gray-600">Update your account password</p></div>
              <button className="btn-outline btn-sm">Change Password</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3><p className="text-sm text-gray-600">Add an extra layer of security</p></div>
              <button className="btn-outline btn-sm">Enable 2FA</button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div><h3 className="font-semibold text-gray-900">Email Notifications</h3><p className="text-sm text-gray-600">Manage email preferences</p></div>
              <button className="btn-outline btn-sm">Configure</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
