import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Calendar, 
  Users, 
  Star,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  Play,
  CheckCircle,
  Heart,
  Shield,
  Award,
  TrendingUp,
  Activity,
  Stethoscope,
  Microscope,
  Pill,
  FileText,
  ArrowRight,
  Zap,
  Target,
  Globe,
  Lock,
  User,
  MessageCircle,
  ChevronDown,
  Send,
  BookOpen,
  HelpCircle,
  Plus,
  Minus
} from 'lucide-react'
import { doctorService, diseaseService, blogService } from '../../services/api'

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [diseaseSearch, setDiseaseSearch] = useState('')
  const [featuredDoctors, setFeaturedDoctors] = useState([])
  const [popularDiseases, setPopularDiseases] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [expandedFAQ, setExpandedFAQ] = useState(null)
  const [email, setEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, diseasesRes, blogsRes] = await Promise.all([
          doctorService.getAllDoctors({ limit: 6, sortBy: 'rating' }),
          diseaseService.getPopularDiseases({ limit: 8 }),
          blogService.getFeaturedBlogs({ limit: 3 })
        ])

        setFeaturedDoctors(doctorsRes.data.data.doctors || [])
        setPopularDiseases(diseasesRes.data.data.diseases || [])
        setRecentBlogs(blogsRes.data.data.blogs || [])
      } catch (error) {
        console.error('Failed to fetch home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const heroStats = [
    { label: 'Verified Doctors', value: '500+', icon: Users, color: 'bg-blue-500' },
    { label: 'Happy Patients', value: '10K+', icon: Heart, color: 'bg-red-500' },
    { label: 'Years Experience', value: '15+', icon: Award, color: 'bg-green-500' },
    { label: 'Success Rate', value: '98%', icon: Target, color: 'bg-purple-500' }
  ]

  const services = [
    {
      title: 'General Consultation',
      description: 'Comprehensive health check-ups and medical consultations',
      icon: Stethoscope,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Lab Tests',
      description: 'Advanced diagnostic and laboratory testing services',
      icon: Microscope,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Pharmacy',
      description: 'Complete pharmacy services with authentic medicines',
      icon: Pill,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'Health Records',
      description: 'Digital health records and medical history management',
      icon: FileText,
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Patient',
      content: 'The best healthcare platform I have ever used. Doctors are highly qualified and the booking process is seamless.',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Patient',
      content: 'Excellent service! I got an appointment within hours and the doctor was very professional and caring.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Davis',
      role: 'Patient',
      content: 'The online consultation feature saved me so much time. Highly recommend this platform to everyone.',
      rating: 5,
      avatar: 'ED'
    }
  ]

  const features = [
    {
      title: '24/7 Availability',
      description: 'Get medical help anytime, anywhere',
      icon: Clock,
      color: 'bg-blue-500'
    },
    {
      title: 'Verified Doctors',
      description: 'All doctors are verified and certified',
      icon: Shield,
      color: 'bg-green-500'
    },
    {
      title: 'Secure Platform',
      description: 'Your health data is always protected',
      icon: Lock,
      color: 'bg-purple-500'
    },
    {
      title: 'Instant Booking',
      description: 'Book appointments in seconds',
      icon: Zap,
      color: 'bg-orange-500'
    }
  ]

  const appointmentSteps = [
    {
      step: 1,
      title: 'Search Doctor',
      description: 'Find the right doctor by specialty, location, or availability',
      icon: Search
    },
    {
      step: 2,
      title: 'Book Appointment',
      description: 'Choose your preferred time slot and book instantly',
      icon: Calendar
    },
    {
      step: 3,
      title: 'Consultation',
      description: 'Have your consultation online or at the clinic',
      icon: MessageCircle
    },
    {
      step: 4,
      title: 'Get Care',
      description: 'Receive prescriptions and follow-up care',
      icon: Heart
    }
  ]

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply search for a doctor, select your preferred time slot, and confirm your booking. You\'ll receive a confirmation email with all details.'
    },
    {
      question: 'Are the doctors verified?',
      answer: 'Yes, all our doctors are thoroughly verified with their credentials, licenses, and experience before being listed on our platform.'
    },
    {
      question: 'What if I need to cancel my appointment?',
      answer: 'You can cancel your appointment up to 2 hours before the scheduled time through your dashboard or by contacting support.'
    },
    {
      question: 'Do you offer online consultations?',
      answer: 'Yes, many of our doctors offer online video consultations. Look for the "Online Consultation" badge on doctor profiles.'
    },
    {
      question: 'How do I pay for my appointment?',
      answer: 'We accept various payment methods including credit/debit cards, net banking, and digital wallets. Payment is secure and encrypted.'
    },
    {
      question: 'Is my medical information secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and medical information.'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/doctors?search=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleDiseaseSearch = (e) => {
    e.preventDefault()
    if (diseaseSearch.trim()) {
      window.location.href = `/doctors?disease=${encodeURIComponent(diseaseSearch)}`
    }
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      // Add newsletter subscription logic here
      alert(`Thank you for subscribing with email: ${email}`)
      setEmail('')
    }
  }

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <Activity className="w-4 h-4 mr-2" />
                Your Health, Our Priority
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Health is
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {" "}Our Mission
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Connect with top-rated doctors, book appointments instantly, and manage your health journey with our comprehensive healthcare platform.
              </p>
              
              {/* Enhanced Search Bar */}
              <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search doctors, specialties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-3 outline-none text-gray-700 placeholder-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  Find Doctors
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </form>

              {/* Disease Quick Search */}
              <div className="flex flex-wrap gap-2">
                <span className="text-gray-600 text-sm">Quick search:</span>
                {['Fever', 'Cough', 'Headache', 'Diabetes'].map((disease) => (
                  <button
                    key={disease}
                    onClick={() => setDiseaseSearch(disease)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                  >
                    {disease}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  {heroStats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow">
                      <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive medical services designed to meet all your healthcare needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedicated Disease Search Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Search by Disease or Condition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find specialized doctors for your specific health concerns
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleDiseaseSearch} className="bg-white rounded-2xl shadow-xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search diseases, conditions, symptoms..."
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full py-3 outline-none text-gray-700 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                Find Specialists
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Conditions:</h3>
              <div className="flex flex-wrap gap-2">
                {popularDiseases.length > 0 ? (
                  popularDiseases.slice(0, 8).map((disease) => (
                    <button
                      key={disease._id}
                      onClick={() => setDiseaseSearch(disease.name)}
                      className="px-4 py-2 bg-white hover:bg-green-100 border border-gray-200 hover:border-green-300 rounded-full text-sm text-gray-700 hover:text-green-700 transition-colors"
                    >
                      {disease.name}
                    </button>
                  ))
                ) : (
                  ['Diabetes', 'Hypertension', 'COVID-19', 'Arthritis', 'Migraine', 'Asthma', 'Depression', 'Anxiety'].map((disease) => (
                    <button
                      key={disease}
                      onClick={() => setDiseaseSearch(disease)}
                      className="px-4 py-2 bg-white hover:bg-green-100 border border-gray-200 hover:border-green-300 rounded-full text-sm text-gray-700 hover:text-green-700 transition-colors"
                    >
                      {disease}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Appointment Steps Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book your appointment in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {appointmentSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                {index < appointmentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <div className="flex items-center justify-center">
                      <ChevronRight className="w-6 h-6 text-gray-300" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HealthCare+
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare that puts you first
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform`}>
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Doctors
              </h2>
              <p className="text-xl text-gray-600">
                Top-rated medical professionals
              </p>
            </div>
            <Link
              to="/doctors"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Doctors
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 animate-pulse">
                  <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : featuredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDoctors.map((doctor) => (
                <div key={doctor._id} className="group">
                  <div className="bg-white rounded-2xl border border-gray-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img
                        src={doctor.profilePicture || `https://ui-avatars.com/api/?name=${doctor.name}&background=random`}
                        alt={doctor.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-green-600">
                        Available
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{doctor.name}</h3>
                      <p className="text-gray-600 mb-3">{doctor.specialization}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating || 0) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({doctor.rating || 4.5})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {doctor.location || 'New York, USA'}
                      </div>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-center block"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors available</h3>
              <p className="text-gray-600">Check back later for available doctors</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/doctors"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Doctors
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Health Blogs Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Latest Health Blogs
              </h2>
              <p className="text-xl text-gray-600">
                Expert insights and health tips from medical professionals
              </p>
            </div>
            <Link
              to="/blogs"
              className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Blogs
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="w-full h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog) => (
                <div key={blog._id} className="group cursor-pointer" onClick={() => window.location.href = `/blogs/${blog._id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative">
                      <img
                        src={blog.featuredImage || `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                        alt={blog.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {blog.category || 'Health'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {blog.readTime || '5 min read'}
                        <span className="mx-2">•</span>
                        {new Date(blog.createdAt || Date.now()).toLocaleDateString()}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3">
                        {blog.excerpt || 'Read this informative article to learn more about health and wellness.'}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No blogs available</h3>
              <p className="text-gray-600">Check back later for health articles and tips</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              View All Blogs
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from our valued patients
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonials[currentTestimonial].avatar}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                  <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <p className="text-lg text-gray-700 leading-relaxed italic">
                "{testimonials[currentTestimonial].content}"
              </p>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our healthcare services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <HelpCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <div className="flex items-center">
                      {expandedFAQ === index ? (
                        <Minus className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6">
              <Mail className="w-4 h-4 mr-2" />
              Stay Updated
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get Health Tips & Updates
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest health insights, medical tips, and exclusive offers
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/50"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
              >
                Subscribe
                <Send className="w-4 h-4 ml-2" />
              </button>
            </form>
            
            <p className="text-sm text-blue-100 mt-4">
              Join 10,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied patients who trust HealthCare+ for their medical needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/doctor-register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center"
            >
              <Stethoscope className="w-5 h-5 mr-2" />
              Register as Doctor
            </Link>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
            >
              Get Started Now
            </Link>
            <Link
              to="/doctors"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300"
            >
              Browse Doctors
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
