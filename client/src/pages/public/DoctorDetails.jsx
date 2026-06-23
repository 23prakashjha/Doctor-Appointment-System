import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Star, Clock, Phone, Mail, Calendar, Award,
  Languages, CheckCircle, ChevronLeft, Heart, Share2, MessageSquare, Stethoscope
} from 'lucide-react'
import { doctorService, appointmentService, reviewService } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'

const DoctorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingModalOpen, setBookingModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [reviews, setReviews] = useState([])
  const [bookingData, setBookingData] = useState({
    disease: '', symptoms: '',
    medicalHistory: { allergies: [], medications: [], previousConditions: [] }
  })

  useEffect(() => { fetchDoctorDetails(); fetchDoctorReviews() }, [id])
  useEffect(() => { if (selectedDate && doctor) fetchAvailableSlots() }, [selectedDate, doctor])

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true)
      const response = await doctorService.getDoctorById(id)
      setDoctor(response.data.data.doctor)
    } catch (error) {
      toast.error('Failed to fetch doctor details')
      navigate('/doctors')
    } finally { setLoading(false) }
  }

  const fetchDoctorReviews = async () => {
    try {
      const response = await reviewService.getDoctorReviews(id, { limit: 5 })
      setReviews(response.data.data.reviews)
    } catch (error) { console.error('Failed to fetch reviews:', error) }
  }

  const fetchAvailableSlots = async () => {
    try {
      const response = await doctorService.getAvailableSlots(id, selectedDate)
      setAvailableSlots(response.data.data.availableSlots)
    } catch (error) { console.error('Failed to fetch slots:', error) }
  }

  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to book an appointment')
      navigate('/login')
      return
    }
    if (!selectedDate || !selectedTime || !bookingData.disease) {
      toast.error('Please fill all required fields')
      return
    }
    try {
      const appointmentData = { doctorId: id, date: selectedDate, time: selectedTime, disease: bookingData.disease, symptoms: bookingData.symptoms, medicalHistory: bookingData.medicalHistory }
      const response = await appointmentService.bookAppointment(appointmentData)
      if (response.data.success) {
        toast.success('Appointment booked successfully!')
        setBookingModalOpen(false)
        navigate(`/dashboard/user/appointments`)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment')
    }
  }

  const getMinDate = () => new Date().toISOString().split('T')[0]
  const getMaxDate = () => { const d = new Date(); d.setDate(d.getDate() + 30); return d.toISOString().split('T')[0] }

  if (loading) {
    return (
      <div className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="container-custom section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Doctor not found</h2>
          <p className="text-gray-600 mb-6">The doctor you're looking for doesn't exist.</p>
          <Link to="/doctors" className="btn-primary">Back to Doctors</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      <div className="container-custom section-padding">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 font-medium group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Doctors
        </button>

        {/* Doctor Header */}
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-purple-100 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                {doctor.userId?.profilePicture ? (
                  <img src={doctor.userId.profilePicture} alt={doctor.userId.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-primary-600">{doctor.userId?.name?.charAt(0)}</span>
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Dr. {doctor.userId?.name}</h1>
                  <p className="text-lg text-gray-600 mb-4">{doctor.specialization}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1.5 font-bold">{doctor.rating?.average || '4.5'}</span>
                      <span className="text-gray-500 ml-1">({doctor.rating?.count || 0} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-5 h-5 mr-1.5" />
                      {doctor.experience} years exp.
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-5 h-5 mr-1.5" />
                      {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Consultation Fee</p>
                    <p className="text-3xl font-extrabold text-primary-600">₹{doctor.consultationFee}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-outline btn-sm"><Heart className="w-4 h-4" /></button>
                    <button className="btn-outline btn-sm"><Share2 className="w-4 h-4" /></button>
                    <button onClick={() => setBookingModalOpen(true)} className="btn-primary btn-sm">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {doctor.bio || `Dr. ${doctor.userId?.name} is a qualified ${doctor.specialization} with ${doctor.experience} years of experience. They are committed to providing excellent healthcare services to patients.`}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Qualifications</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                    <Award className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{doctor.qualification}</p>
                    <p className="text-sm text-gray-500">Primary Qualification</p>
                  </div>
                </div>
                {doctor.achievements?.map((achievement, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{achievement}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {doctor.diseases?.map((disease, i) => (
                  <span key={i} className="badge-primary">{disease}</span>
                ))}
              </div>
            </div>

            {doctor.languages?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Languages</h2>
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-gray-500" />
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang, i) => <span key={i} className="badge-secondary">{lang}</span>)}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Patient Reviews</h2>
                <Link to={`/doctors/${id}/reviews`} className="text-sm font-semibold text-primary-600 hover:text-primary-700">View All</Link>
              </div>
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No reviews yet.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                            {review.patientId?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.patientId?.name}</p>
                            <div className="flex text-yellow-400">
                              {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 ml-13">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Clinic Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Address</p>
                    <p className="text-sm text-gray-600">
                      {doctor.clinicAddress?.street}<br />
                      {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state} {doctor.clinicAddress?.pincode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-gray-500 mr-3" />
                  <div><p className="font-semibold text-gray-900">Phone</p><p className="text-sm text-gray-600">{doctor.userId?.phone}</p></div>
                </div>
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-gray-500 mr-3" />
                  <div><p className="font-semibold text-gray-900">Email</p><p className="text-sm text-gray-600">{doctor.userId?.email}</p></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Availability</h2>
              <div className="space-y-3">
                {doctor.availability?.map((slot, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="font-semibold text-gray-900 text-sm">{slot.day}</span>
                    <div className="flex flex-wrap gap-1">
                      {slot.timeSlots?.map((ts, ti) => (
                        <span key={ti} className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">{ts.startTime}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button onClick={() => setBookingModalOpen(true)} className="w-full btn-primary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Appointment
                </button>
                <button className="w-full btn-outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setBookingModalOpen(false)} />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl animate-scale-in">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Book Appointment</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Date *</label>
                  <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={getMinDate()} max={getMaxDate()} className="input" />
                </div>
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Time *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {availableSlots.length === 0 ? (
                        <p className="col-span-3 text-gray-500 text-sm">No slots available</p>
                      ) : (
                        availableSlots.map((slot, i) => (
                          <button key={i} onClick={() => setSelectedTime(slot.startTime)}
                            className={`p-2.5 text-sm rounded-xl font-medium border transition-all ${
                              selectedTime === slot.startTime
                                ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white border-transparent shadow-lg'
                                : 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-gray-50'
                            }`}>
                            {slot.startTime}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Reason for Visit *</label>
                  <input type="text" value={bookingData.disease} onChange={(e) => setBookingData({...bookingData, disease: e.target.value})} placeholder="e.g., Regular checkup" className="input" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Symptoms (Optional)</label>
                  <textarea value={bookingData.symptoms} onChange={(e) => setBookingData({...bookingData, symptoms: e.target.value})} placeholder="Describe your symptoms..." rows={3} className="input resize-none" />
                </div>
                <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700"><strong>Consultation Fee:</strong> ₹{doctor.consultationFee}</p>
                  <p className="text-xs text-gray-500 mt-1">Payment will be processed after confirmation</p>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setBookingModalOpen(false)} className="flex-1 btn-outline">Cancel</button>
                <button onClick={handleBookAppointment} className="flex-1 btn-primary">Book Appointment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DoctorDetails
