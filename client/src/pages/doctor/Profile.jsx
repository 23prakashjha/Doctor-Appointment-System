import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext'
import { doctorService } from '../../services/api'
import toast from 'react-hot-toast'
import { User, Mail, Phone, MapPin, Clock, Award, Save, Camera, Plus, X } from 'lucide-react'

const DoctorProfile = () => {
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [doctorData, setDoctorData] = useState(null)
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false)
  const [newTimeSlot, setNewTimeSlot] = useState({ day: '', startTime: '', endTime: '' })
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => { fetchDoctorProfile() }, [])

  const fetchDoctorProfile = async () => {
    try {
      const response = await doctorService.getDoctorProfile()
      const doctor = response.data.data.doctor
      setDoctorData(doctor)
      reset({
        specialization: doctor.specialization, qualification: doctor.qualification,
        experience: doctor.experience, consultationFee: doctor.consultationFee,
        bio: doctor.bio, languages: doctor.languages?.join(', '),
        achievements: doctor.achievements?.join(', '),
        clinicAddress: { street: doctor.clinicAddress?.street || '', city: doctor.clinicAddress?.city || '', state: doctor.clinicAddress?.state || '', pincode: doctor.clinicAddress?.pincode || '' }
      })
    } catch (error) { toast.error('Failed to fetch profile') }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { toast.error('Image size should be less than 5MB'); return }
      setProfileImage(file); setPreviewImage(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          if (key === 'clinicAddress') Object.keys(data[key]).forEach(subKey => formData.append(`clinicAddress.${subKey}`, data[key][subKey]))
          else if (key === 'languages' || key === 'achievements') { const items = data[key].split(',').map(i => i.trim()).filter(Boolean); formData.append(key, JSON.stringify(items)) }
          else formData.append(key, data[key])
        }
      })
      if (profileImage) formData.append('profilePicture', profileImage)
      const response = await doctorService.updateDoctorProfile(formData)
      if (response.data.success) {
        updateUser({ user: response.data.data.user })
        toast.success('Profile updated successfully!')
        setProfileImage(null); setPreviewImage(null)
        fetchDoctorProfile()
      }
    } catch (error) { toast.error(error.response?.data?.message || 'Failed to update profile') }
    finally { setLoading(false) }
  }

  const addTimeSlot = () => {
    if (!newTimeSlot.day || !newTimeSlot.startTime || !newTimeSlot.endTime) { toast.error('Please fill all fields'); return }
    const updatedAvailability = [...(doctorData?.availability || [])]
    const existingDayIndex = updatedAvailability.findIndex(slot => slot.day === newTimeSlot.day)
    if (existingDayIndex >= 0) updatedAvailability[existingDayIndex].timeSlots.push({ startTime: newTimeSlot.startTime, endTime: newTimeSlot.endTime })
    else updatedAvailability.push({ day: newTimeSlot.day, timeSlots: [{ startTime: newTimeSlot.startTime, endTime: newTimeSlot.endTime }] })
    setDoctorData(prev => ({ ...prev, availability: updatedAvailability }))
    setNewTimeSlot({ day: '', startTime: '', endTime: '' })
    toast.success('Time slot added!')
  }

  const removeTimeSlot = (dayIndex, slotIndex) => {
    const updatedAvailability = [...doctorData.availability]
    updatedAvailability[dayIndex].timeSlots.splice(slotIndex, 1)
    if (updatedAvailability[dayIndex].timeSlots.length === 0) updatedAvailability.splice(dayIndex, 1)
    setDoctorData(prev => ({ ...prev, availability: updatedAvailability }))
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Doctor Profile</h1>
          <p className="text-gray-600">Manage your professional profile and availability</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Picture */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden">
                  {previewImage || user?.profilePicture ? (
                    <img src={previewImage || user?.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl font-bold text-primary-600">{user?.name?.charAt(0)}</span>
                  )}
                </div>
                <label htmlFor="profile-image" className="absolute -bottom-1 -right-1 w-9 h-9 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl flex items-center justify-center cursor-pointer hover:shadow-lg transition-all shadow-md">
                  <Camera className="w-4 h-4" />
                </label>
                <input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Click to change profile picture</p>
                <p className="text-xs text-gray-400">Max 5MB</p>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Specialization *</label>
                <input {...register('specialization', { required: 'Required' })} type="text" className="input" placeholder="e.g., Cardiologist" />
                {errors.specialization && <p className="mt-1 text-sm text-red-500">{errors.specialization.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Qualification *</label>
                <input {...register('qualification', { required: 'Required' })} type="text" className="input" placeholder="e.g., MBBS, MD" />
                {errors.qualification && <p className="mt-1 text-sm text-red-500">{errors.qualification.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience (years) *</label>
                <input {...register('experience', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} type="number" className="input" placeholder="e.g., 5" />
                {errors.experience && <p className="mt-1 text-sm text-red-500">{errors.experience.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Consultation Fee (₹) *</label>
                <input {...register('consultationFee', { required: 'Required', min: { value: 0, message: 'Must be positive' } })} type="number" className="input" placeholder="500" />
                {errors.consultationFee && <p className="mt-1 text-sm text-red-500">{errors.consultationFee.message}</p>}
              </div>
            </div>
          </div>

          {/* Clinic Address */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Clinic Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Street Address</label>
                <input {...register('clinicAddress.street')} type="text" className="input" placeholder="123 Healthcare Avenue" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                <input {...register('clinicAddress.city', { required: 'City is required' })} type="text" className="input" placeholder="Mumbai" />
                {errors.clinicAddress?.city && <p className="mt-1 text-sm text-red-500">{errors.clinicAddress.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                <input {...register('clinicAddress.state', { required: 'State is required' })} type="text" className="input" placeholder="Maharashtra" />
                {errors.clinicAddress?.state && <p className="mt-1 text-sm text-red-500">{errors.clinicAddress.state.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Code *</label>
                <input {...register('clinicAddress.pincode', { required: 'PIN is required' })} type="text" className="input" placeholder="400001" />
                {errors.clinicAddress?.pincode && <p className="mt-1 text-sm text-red-500">{errors.clinicAddress.pincode.message}</p>}
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Additional Information</h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
                <textarea {...register('bio')} rows={4} className="input resize-none" placeholder="Tell patients about your expertise..." />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Languages (comma-separated)</label>
                <input {...register('languages')} type="text" className="input" placeholder="English, Hindi, Marathi" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Achievements (comma-separated)</label>
                <textarea {...register('achievements')} rows={3} className="input resize-none" placeholder="Best Doctor Award 2020, Research Publication..." />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-900">Availability</h2>
              <button type="button" onClick={() => setShowAvailabilityModal(true)} className="btn-outline inline-flex items-center"><Plus className="w-4 h-4 mr-2" />Add Slot</button>
            </div>
            <div className="space-y-3">
              {doctorData?.availability?.map((daySlot, dayIndex) => (
                <div key={dayIndex} className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-gray-900 mb-3">{daySlot.day}</h3>
                  <div className="space-y-2">
                    {daySlot.timeSlots?.map((timeSlot, slotIndex) => (
                      <div key={slotIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="inline-flex items-center text-sm text-gray-900"><Clock className="w-4 h-4 text-gray-500 mr-2" />{timeSlot.startTime} - {timeSlot.endTime}</span>
                        <button type="button" onClick={() => removeTimeSlot(dayIndex, slotIndex)} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!doctorData?.availability || doctorData.availability.length === 0) && (
                <p className="text-gray-500 text-center py-6">No availability set. Click "Add Slot" to get started.</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => reset()} className="btn-outline">Reset</button>
            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 inline-flex items-center">
              {loading ? (
                <><svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Saving...</>
              ) : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}
            </button>
          </div>
        </form>

        {showAvailabilityModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAvailabilityModal(false)} />
              <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Add Time Slot</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Day</label>
                    <select value={newTimeSlot.day} onChange={(e) => setNewTimeSlot(p => ({ ...p, day: e.target.value }))} className="input">
                      <option value="">Select Day</option>
                      {days.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Time</label>
                      <input type="time" value={newTimeSlot.startTime} onChange={(e) => setNewTimeSlot(p => ({ ...p, startTime: e.target.value }))} className="input" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Time</label>
                      <input type="time" value={newTimeSlot.endTime} onChange={(e) => setNewTimeSlot(p => ({ ...p, endTime: e.target.value }))} className="input" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setShowAvailabilityModal(false)} className="flex-1 btn-outline">Cancel</button>
                  <button onClick={() => { addTimeSlot(); setShowAvailabilityModal(false) }} className="flex-1 btn-primary">Add Slot</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorProfile
