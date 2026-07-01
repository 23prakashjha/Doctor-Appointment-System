import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, MapPin, Star, Clock, SlidersHorizontal, X, Stethoscope } from 'lucide-react'
import doctorsData from '../../data/doctors.json'

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '')
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')
  const [currentPage, setCurrentPage] = useState(1)
  const perPage = 12

  const allDoctors = doctorsData.doctors

  const specializations = [...new Set(allDoctors.map(d => d.specialization))].sort()
  const cities = [...new Set(allDoctors.map(d => d.city))].sort()

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (specialization) params.set('specialization', specialization)
    if (city) params.set('city', city)
    if (minExperience) params.set('minExperience', minExperience)
    if (maxFee) params.set('maxFee', maxFee)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    setSearchParams(params, { replace: true })
  }, [search, specialization, city, minExperience, maxFee, sortBy, sortOrder])

  useEffect(() => {
    setLoading(true)
    setCurrentPage(1)
    const timeout = setTimeout(() => {
      let filtered = [...allDoctors]

      if (search) {
        const q = search.toLowerCase()
        filtered = filtered.filter(d =>
          d.name.toLowerCase().includes(q) ||
          d.specialization.toLowerCase().includes(q) ||
          d.bio.toLowerCase().includes(q) ||
          d.city.toLowerCase().includes(q)
        )
      }
      if (specialization) filtered = filtered.filter(d => d.specialization === specialization)
      if (city) filtered = filtered.filter(d => d.city === city)
      if (minExperience) filtered = filtered.filter(d => d.experience >= parseInt(minExperience))
      if (maxFee) filtered = filtered.filter(d => d.consultationFee <= parseInt(maxFee))

      const sorted = [...filtered].sort((a, b) => {
        const mul = sortOrder === 'desc' ? -1 : 1
        if (sortBy === 'rating') return (a.rating - b.rating) * mul
        if (sortBy === 'experience') return (a.experience - b.experience) * mul
        if (sortBy === 'fee') return (a.consultationFee - b.consultationFee) * mul
        return 0
      })

      setDoctors(sorted)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, specialization, city, minExperience, maxFee, sortBy, sortOrder])

  const totalPages = Math.ceil(doctors.length / perPage)
  const paginatedDoctors = doctors.slice((currentPage - 1) * perPage, currentPage * perPage)
  const total = doctors.length

  return (
    <div className="pt-16 bg-transparent min-h-screen">
      <div className="container-custom section-padding">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-2">Find a Doctor</h1>
          <p className="text-lg text-gray-300">Connect with certified healthcare professionals</p>
        </div>

        <div className="dark-glass rounded-2xl shadow-lg shadow-black/20 border border-white/[0.06] p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search by doctor name, specialty, or city..." value={search} onChange={(e) => setSearch(e.target.value)} className="input pl-11" />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setFiltersOpen(!filtersOpen)} className="btn-outline flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {filtersOpen && (
          <div className="dark-glass rounded-2xl shadow-lg border border-white/[0.06] p-6 mb-6 animate-slide-down">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-white">Filters</h3>
              <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-300 p-1 rounded-lg hover:bg-white/[0.06]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1.5">Specialization</label>
                <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="input">
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => <option key={spec} value={spec}>{spec}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1.5">City</label>
                <select value={city} onChange={(e) => setCity(e.target.value)} className="input">
                  <option value="">All Cities</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1.5">Min Experience (years)</label>
                <input type="number" value={minExperience} onChange={(e) => setMinExperience(e.target.value)} placeholder="e.g., 5" className="input" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1.5">Max Fee (₹)</label>
                <input type="number" value={maxFee} onChange={(e) => setMaxFee(e.target.value)} placeholder="e.g., 1000" className="input" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setFiltersOpen(false) }} className="btn-primary">Apply Filters</button>
              <button onClick={() => { setSearch(''); setSpecialization(''); setCity(''); setMinExperience(''); setMaxFee(''); setSortBy('rating'); setSortOrder('desc'); setFiltersOpen(false) }} className="btn-outline">Reset</button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-300">Found <span className="font-bold text-white">{total}</span> doctors</p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border-white/[0.08] rounded-xl px-3 py-2">
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="fee">Fee</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="dark-glass rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="animate-pulse">
                  <div className="h-48 bg-white/[0.08]"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-white/[0.08] rounded w-3/4"></div>
                    <div className="h-4 bg-white/[0.08] rounded w-1/2"></div>
                    <div className="h-4 bg-white/[0.08] rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedDoctors.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No doctors found</h3>
            <p className="text-gray-300 mb-4">Try adjusting your filters or search criteria</p>
            <button onClick={() => { setSearch(''); setSpecialization(''); setCity(''); setMinExperience(''); setMaxFee(''); setSortBy('rating'); setSortOrder('desc') }} className="btn-primary">Clear Filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedDoctors.map((doctor) => (
              <div key={doctor.id} className="group dark-glass rounded-2xl border border-white/[0.06] hover:border-primary-100 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full object-cover shadow-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{doctor.name}</h3>
                      <p className="text-sm text-gray-400">{doctor.specialization}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm text-gray-300 ml-1">{doctor.rating} ({doctor.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2.5">
                    <div className="flex items-center text-sm text-gray-400">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      {doctor.city}
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <Stethoscope className="w-4 h-4 mr-2 text-gray-400" />
                      {doctor.clinicName}
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/[0.06]">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-400">Consultation Fee</p>
                        <p className="text-xl font-bold text-emerald-400">₹{doctor.consultationFee}</p>
                      </div>
                      <Link to={`/doctors/${doctor.id}`} className="btn-primary btn-sm">
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center mt-10">
            <div className="flex items-center space-x-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="px-4 py-2 border border-white/[0.08] rounded-xl hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                Previous
              </button>
              {[...Array(Math.min(totalPages, 7))].map((_, index) => {
                let page
                if (totalPages <= 7) {
                  page = index + 1
                } else if (currentPage <= 4) {
                  page = index + 1
                } else if (currentPage >= totalPages - 3) {
                  page = totalPages - 6 + index
                } else {
                  page = currentPage - 3 + index
                }
                return (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      page === currentPage
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg'
                        : 'border border-white/[0.08] text-gray-200 hover:bg-white/[0.06]'
                    }`}>
                    {page}
                  </button>
                )
              })}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="px-4 py-2 border border-white/[0.08] rounded-xl hover:bg-white/[0.06] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Doctors
