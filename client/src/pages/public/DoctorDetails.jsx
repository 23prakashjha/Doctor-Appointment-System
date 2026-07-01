import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Clock, Phone, Mail, Calendar, Award, Languages, Stethoscope, ChevronLeft, Heart, Share2, CheckCircle, Briefcase } from 'lucide-react'
import doctorsData from '../../data/doctors.json'
import toast from 'react-hot-toast'

const DoctorDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const doc = doctorsData.doctors.find(d => d.id === parseInt(id))
    if (doc) setDoctor(doc)
    else toast.error('Doctor not found')
    setLoading(false)
  }, [id])

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: doctor.name, url: window.location.href })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="pt-16 bg-transparent min-h-screen">
        <div className="container-custom section-padding">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
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
          <div className="w-20 h-20 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Doctor not found</h2>
          <p className="text-gray-300 mb-6">The doctor you're looking for doesn't exist.</p>
          <Link to="/doctors" className="btn-primary">Back to Doctors</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 bg-transparent min-h-screen">
      <div className="container-custom section-padding">
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-gray-300 hover:text-white mb-6 font-medium group">
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Doctors
        </button>

        <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-shrink-0">
              <img src={doctor.image} alt={doctor.name} className="w-32 h-32 rounded-2xl object-cover shadow-lg" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">{doctor.name}</h1>
                  <p className="text-lg text-gray-300 mb-4">{doctor.specialization}</p>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="ml-1.5 font-bold">{doctor.rating}</span>
                      <span className="text-gray-400 ml-1">({doctor.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-1.5" />
                      {doctor.experience} years exp.
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-1.5" />
                      {doctor.city}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-start lg:items-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Consultation Fee</p>
                    <p className="text-3xl font-extrabold text-emerald-400">₹{doctor.consultationFee}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn-outline btn-sm"><Heart className="w-4 h-4" /></button>
                    <button onClick={handleShare} className="btn-outline btn-sm"><Share2 className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">About</h2>
              <p className="text-gray-200 leading-relaxed">{doctor.bio}</p>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">Qualifications</h2>
              <div className="flex items-start">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Award className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{doctor.qualification}</p>
                  <p className="text-sm text-gray-400">Primary Qualification</p>
                </div>
              </div>
            </div>

            {doctor.languages?.length > 0 && (
              <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
                <h2 className="text-xl font-bold text-white mb-4">Languages</h2>
                <div className="flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    {doctor.languages.map((lang, i) => <span key={i} className="badge-secondary">{lang}</span>)}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">Clinic Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Address</p>
                    <p className="text-sm text-gray-300">{doctor.clinicAddress}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-semibold text-white">Clinic</p>
                    <p className="text-sm text-gray-300">{doctor.clinicName}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-semibold text-white">Working Hours</p>
                    <p className="text-sm text-gray-300">{doctor.workingHours}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Award className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="font-semibold text-white">Experience</p>
                    <p className="text-sm text-gray-300">{doctor.experience} years</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.08] shadow-xl rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">Availability</h2>
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span className="font-semibold">{doctor.isAvailable ? 'Available for consultations' : 'Currently unavailable'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDetails
