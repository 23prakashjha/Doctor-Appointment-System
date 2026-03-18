import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  MapPin, 
  Star,
  Clock,
  Calendar,
  Phone,
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { doctorService, diseaseService } from '../../services/api'
import toast from 'react-hot-toast'

const Doctors = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [popularDiseases, setPopularDiseases] = useState([])
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [specialization, setSpecialization] = useState(searchParams.get('specialization') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [disease, setDisease] = useState(searchParams.get('disease') || '')
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '')
  const [maxFee, setMaxFee] = useState(searchParams.get('maxFee') || '')
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'rating')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc')
  
  const [pagination, setPagination] = useState({
    current: 1,
    pages: 1,
    total: 0
  })

  const specializations = [
    'Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist',
    'Orthopedic', 'Gynecologist', 'Psychiatrist', 'General Physician',
    'ENT Specialist', 'Ophthalmologist', 'Dentist', 'Urologist'
  ]

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata',
    'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ]

  useEffect(() => {
    fetchDoctors()
    fetchPopularDiseases()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (specialization) params.set('specialization', specialization)
    if (city) params.set('city', city)
    if (disease) params.set('disease', disease)
    if (minExperience) params.set('minExperience', minExperience)
    if (maxFee) params.set('maxFee', maxFee)
    if (sortBy) params.set('sortBy', sortBy)
    if (sortOrder) params.set('sortOrder', sortOrder)
    
    setSearchParams(params)
  }, [search, specialization, city, disease, minExperience, maxFee, sortBy, sortOrder])

  const fetchDoctors = async (page = 1) => {
    try {
      setLoading(true)
      const params = {
        page,
        limit: 12,
        search,
        specialization,
        city,
        disease,
        minExperience,
        maxFee,
        sortBy,
        sortOrder
      }
      
      const response = await doctorService.getAllDoctors(params)
      setDoctors(response.data.data.doctors)
      setPagination(response.data.data.pagination)
    } catch (error) {
      toast.error('Failed to fetch doctors')
    } finally {
      setLoading(false)
    }
  }

  const fetchPopularDiseases = async () => {
    try {
      const response = await diseaseService.getPopularDiseases({ limit: 10 })
      setPopularDiseases(response.data.data.diseases)
    } catch (error) {
      console.error('Failed to fetch diseases:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchDoctors(1)
  }

  const handleFilterApply = () => {
    fetchDoctors(1)
    setFiltersOpen(false)
  }

  const handleFilterReset = () => {
    setSearch('')
    setSpecialization('')
    setCity('')
    setDisease('')
    setMinExperience('')
    setMaxFee('')
    setSortBy('rating')
    setSortOrder('desc')
    setFiltersOpen(false)
    fetchDoctors(1)
  }

  const handlePageChange = (page) => {
    fetchDoctors(page)
  }

  return (
    <div className="pt-16 bg-gray-50 min-h-screen">
      <div className="container-custom section-padding">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find a Doctor
          </h1>
          <p className="text-gray-600">
            Connect with certified healthcare professionals
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by doctor name, specialty, or disease..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="btn-outline flex items-center"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button type="submit" className="btn-primary">
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Popular Diseases */}
        {popularDiseases.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Popular Diseases</h3>
            <div className="flex flex-wrap gap-2">
              {popularDiseases.map((disease, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDisease(disease.name)
                    fetchDoctors(1)
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    disease === disease.name
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {disease.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium text-gray-900">Filters</h3>
              <button
                onClick={() => setFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="input"
                >
                  <option value="">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="input"
                >
                  <option value="">All Cities</option>
                  {cities.map((cityName) => (
                    <option key={cityName} value={cityName}>{cityName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease
                </label>
                <input
                  type="text"
                  value={disease}
                  onChange={(e) => setDisease(e.target.value)}
                  placeholder="e.g., Diabetes"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Experience (years)
                </label>
                <input
                  type="number"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value)}
                  placeholder="e.g., 5"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Fee (₹)
                </label>
                <input
                  type="number"
                  value={maxFee}
                  onChange={(e) => setMaxFee(e.target.value)}
                  placeholder="e.g., 1000"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input"
                >
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="fee">Consultation Fee</option>
                  <option value="appointments">Appointments</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleFilterApply}
                className="btn-primary"
              >
                Apply Filters
              </button>
              <button
                onClick={handleFilterReset}
                className="btn-outline"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Found {pagination.total} doctors
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                fetchDoctors(1)
              }}
              className="text-sm border-gray-300 rounded-md"
            >
              <option value="rating">Rating</option>
              <option value="experience">Experience</option>
              <option value="fee">Fee</option>
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : doctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <button
              onClick={handleFilterReset}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="card hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {doctor.userId?.profilePicture ? (
                        <img
                          src={doctor.userId.profilePicture}
                          alt={doctor.userId.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl font-medium text-gray-600">
                          {doctor.userId?.name?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        Dr. {doctor.userId?.name}
                      </h3>
                      <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {doctor.rating?.average || '4.5'} ({doctor.rating?.count || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {doctor.clinicAddress?.city}, {doctor.clinicAddress?.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {doctor.experience} years experience
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2" />
                      {doctor.userId?.phone}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Consultation Fee</p>
                        <p className="text-lg font-semibold text-primary-600">
                          ₹{doctor.consultationFee}
                        </p>
                      </div>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="btn-primary btn-sm"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.current - 1)}
                disabled={pagination.current === 1}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {[...Array(pagination.pages)].map((_, index) => {
                const page = index + 1
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 border rounded-md ${
                      page === pagination.current
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
              
              <button
                onClick={() => handlePageChange(pagination.current + 1)}
                disabled={pagination.current === pagination.pages}
                className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
