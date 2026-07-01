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
  Minus,
  Sparkles,
  DollarSign,
  Smartphone
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const heroStats = [
    { label: 'Verified Doctors', value: '500+', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Happy Patients', value: '10K+', icon: Heart, color: 'from-red-500 to-red-600' },
    { label: 'Years Experience', value: '15+', icon: Award, color: 'from-green-500 to-green-600' },
    { label: 'Success Rate', value: '98%', icon: Target, color: 'from-purple-500 to-purple-600' }
  ]

  const services = [
    {
      title: 'General Consultation',
      description: 'Comprehensive health check-ups and medical consultations with top doctors',
      icon: Stethoscope,
      gradient: 'from-blue-500 to-cyan-500',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Lab Tests',
      description: 'Advanced diagnostic and laboratory testing services with fast results',
      icon: Microscope,
      gradient: 'from-green-500 to-emerald-500',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Pharmacy',
      description: 'Complete pharmacy services with authentic and quality medicines',
      icon: Pill,
      gradient: 'from-purple-500 to-pink-500',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Digital Records',
      description: 'Secure digital health records and medical history management',
      icon: FileText,
      gradient: 'from-orange-500 to-red-500',
      bgLight: 'bg-orange-50'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson', role: 'Patient',
      content: 'The best healthcare platform I have ever used. Doctors are highly qualified and the booking process is seamless.',
      rating: 5, avatar: 'SJ'
    },
    {
      name: 'Michael Chen', role: 'Patient',
      content: 'Excellent service! I got an appointment within hours and the doctor was very professional and caring.',
      rating: 5, avatar: 'MC'
    },
    {
      name: 'Emily Davis', role: 'Patient',
      content: 'The online consultation feature saved me so much time. Highly recommend this platform to everyone.',
      rating: 5, avatar: 'ED'
    },
    {
      name: 'David Wilson', role: 'Patient',
      content: 'Finally a healthcare platform that puts patients first. The quality of care is outstanding.',
      rating: 5, avatar: 'DW'
    }
  ]

  const features = [
    { title: '24/7 Availability', description: 'Get medical help anytime, anywhere, around the clock', icon: Clock, gradient: 'from-blue-500 to-cyan-500' },
    { title: 'Verified Doctors', description: 'All doctors are verified, certified, and thoroughly vetted', icon: Shield, gradient: 'from-green-500 to-emerald-500' },
    { title: 'Secure Platform', description: 'Your health data is always protected with bank-grade encryption', icon: Lock, gradient: 'from-purple-500 to-pink-500' },
    { title: 'Instant Booking', description: 'Book appointments in seconds with our streamlined process', icon: Zap, gradient: 'from-orange-500 to-red-500' }
  ]

  const appointmentSteps = [
    { step: 1, title: 'Search Doctor', description: 'Find the right doctor by specialty, location, or availability', icon: Search },
    { step: 2, title: 'Book Appointment', description: 'Choose your preferred time slot and book instantly', icon: Calendar },
    { step: 3, title: 'Consultation', description: 'Have your consultation online or at the clinic', icon: MessageCircle },
    { step: 4, title: 'Get Care', description: 'Receive prescriptions and follow-up care', icon: Heart }
  ]

  const faqs = [
    { question: 'How do I book an appointment?', answer: 'Simply search for a doctor, select your preferred time slot, and confirm your booking. You\'ll receive a confirmation email with all details.' },
    { question: 'Are the doctors verified?', answer: 'Yes, all our doctors are thoroughly verified with their credentials, licenses, and experience before being listed on our platform.' },
    { question: 'What if I need to cancel my appointment?', answer: 'You can cancel your appointment up to 2 hours before the scheduled time through your dashboard or by contacting support.' },
    { question: 'Do you offer online consultations?', answer: 'Yes, many of our doctors offer online video consultations. Look for the "Online Consultation" badge on doctor profiles.' },
    { question: 'How do I pay for my appointment?', answer: 'We accept various payment methods including credit/debit cards, net banking, and digital wallets. Payment is secure and encrypted.' },
    { question: 'Is my medical information secure?', answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and medical information.' }
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
      alert(`Thank you for subscribing with email: ${email}`)
      setEmail('')
    }
  }

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index)
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        </div>

        <div className="relative w-full">
          <div className="container-custom pt-24 pb-16 lg:pt-32 lg:pb-20">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left column */}
              <div className="space-y-8 animate-fade-in-up">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-primary-700 rounded-full text-sm font-medium border border-primary-200/50">
                  <Sparkles className="w-4 h-4 mr-2 text-primary-600" />
                  Your Health, Our Priority
                  <span className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse-soft"></span>
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight">
                  Your Health is
                  <br />
                  <span className="gradient-text">
                    Our Mission
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Connect with top-rated doctors, book appointments instantly, and manage your health journey with our comprehensive healthcare platform.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-500/5 p-2 flex flex-col sm:flex-row gap-2 border border-gray-100">
                  <div className="flex-1 flex items-center px-4">
                    <Search className="w-5 h-5 text-gray-400 mr-3" />
                    <input
                      type="text"
                      placeholder="Search doctors, specialties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center group"
                  >
                    Find Doctors
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>

                {/* Quick search tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-500 text-sm font-medium">Quick search:</span>
                  {['Fever', 'Cough', 'Headache', 'Diabetes', 'Blood Pressure'].map((disease) => (
                    <button
                      key={disease}
                      onClick={() => setSearchQuery(disease)}
                      className="px-4 py-1.5 bg-white/70 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-primary-300 rounded-full text-sm text-gray-600 hover:text-primary-700 transition-all duration-200 shadow-sm"
                    >
                      {disease}
                    </button>
                  ))}
                </div>

                {/* Trust indicators */}
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 text-green-500 mr-1.5" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 text-green-500 mr-1.5" />
                    <span>End-to-end Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Right column - Stats grid */}
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl shadow-blue-500/10 border border-white/50">
                  <div className="grid grid-cols-2 gap-4">
                    {heroStats.map((stat, index) => (
                      <div key={index} className="bg-white rounded-2xl p-5 sm:p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                        <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <stat.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/50 text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="ml-2 font-medium text-gray-700">4.9</span>
                      <span className="text-gray-400">(2.5k+ reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SERVICES SECTION ==================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-primary-700 rounded-full text-sm font-medium border border-blue-100 mb-4">
              <Activity className="w-4 h-4 mr-1.5" />
              Our Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need for your healthcare journey, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 group-hover:border-transparent group-hover:shadow-2xl group-hover:shadow-blue-500/10 transition-all duration-500 group-hover:-translate-y-2">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                  <div className="mt-6 flex items-center text-sm font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== DISEASE SEARCH ==================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-green-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-[0.03]"></div>
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 mb-4">
              <Search className="w-4 h-4 mr-1.5" />
              Find by Condition
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Search by Disease or Condition
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find specialized doctors for your specific health concerns
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleDiseaseSearch} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl shadow-green-500/5 p-2 flex flex-col sm:flex-row gap-2 border border-gray-100">
              <div className="flex-1 flex items-center px-4">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search diseases, conditions, symptoms..."
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full py-3 outline-none text-gray-700 placeholder-gray-400 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition-all duration-300 flex items-center justify-center group"
              >
                Find Specialists
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-10">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Popular Conditions:
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularDiseases.length > 0 ? (
                  popularDiseases.slice(0, 10).map((disease, i) => (
                    <button
                      key={disease._id}
                      onClick={() => setDiseaseSearch(disease.name)}
                      className="px-4 py-2 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-full text-sm text-gray-700 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {disease.name}
                    </button>
                  ))
                ) : (
                  ['Diabetes', 'Hypertension', 'COVID-19', 'Arthritis', 'Migraine', 'Asthma', 'Depression', 'Anxiety', 'Thyroid', 'Allergies'].map((disease) => (
                    <button
                      key={disease}
                      onClick={() => setDiseaseSearch(disease)}
                      className="px-4 py-2 bg-white hover:bg-green-50 border border-gray-200 hover:border-green-300 rounded-full text-sm text-gray-700 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
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

      {/* ==================== HOW IT WORKS ==================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100 mb-4">
              <Play className="w-4 h-4 mr-1.5" />
              Simple Process
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Book your appointment in 4 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {appointmentSteps.map((step, index) => (
              <div key={index} className="relative group">
                <div className="text-center">
                  <div className="relative mb-6 inline-block">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-purple-500/20 group-hover:shadow-2xl group-hover:shadow-purple-500/30 group-hover:-translate-y-1 transition-all duration-300">
                      <step.icon className="w-11 h-11 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-purple-500">
                      <span className="text-sm font-bold text-purple-600">{step.step}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < appointmentSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-6">
                    <ChevronRight className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.02]"></div>
        <div className="container-custom relative">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-primary-700 rounded-full text-sm font-medium border border-blue-100 mb-4">
              <Award className="w-4 h-4 mr-1.5" />
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why DocCare?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience healthcare that puts you first
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group text-center">
                <div className={`w-24 h-24 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-11 h-11 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURED DOCTORS ==================== */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-primary-700 rounded-full text-sm font-medium border border-blue-100 mb-4">
                <Users className="w-4 h-4 mr-1.5" />
                Our Professionals
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Featured Doctors
              </h2>
              <p className="text-xl text-gray-600">
                Top-rated medical professionals ready to help you
              </p>
            </div>
            <Link
              to="/doctors"
              className="hidden sm:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group mt-4 sm:mt-0"
            >
              View All Doctors
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <div className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredDoctors.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDoctors.map((doctor) => (
                <div key={doctor._id} className="group">
                  <div className="bg-white rounded-2xl border border-gray-100 group-hover:border-primary-100 group-hover:shadow-2xl group-hover:shadow-primary-500/10 transition-all duration-500 overflow-hidden group-hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <img
                        src={doctor.profilePicture || `https://ui-avatars.com/api/?name=${doctor.name}&background=random`}
                        alt={doctor.name}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-green-600 shadow-lg flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse-soft"></span>
                        Available
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{doctor.name}</h3>
                      <p className="text-gray-500 mb-3">{doctor.specialization}</p>
                      <div className="flex items-center mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating || 0) ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">({doctor.rating || 4.5})</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {doctor.location || 'New York, USA'}
                      </div>
                      <Link
                        to={`/doctors/${doctor._id}`}
                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300 text-center block group-hover:shadow-xl"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors available</h3>
              <p className="text-gray-600">Check back later for available doctors</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/doctors"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Doctors
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== BLOGS ==================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-purple-50 via-white to-blue-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-dots opacity-[0.03]"></div>
        <div className="container-custom relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12">
            <div>
              <span className="inline-flex items-center px-4 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-100 mb-4">
                <BookOpen className="w-4 h-4 mr-1.5" />
                Health Tips
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                Latest Health Blogs
              </h2>
              <p className="text-xl text-gray-600">
                Expert insights and health tips from medical professionals
              </p>
            </div>
            <Link
              to="/blogs"
              className="hidden sm:inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold group mt-4 sm:mt-0"
            >
              View All Blogs
              <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-lg">
                  <div className="animate-pulse">
                    <div className="w-full h-52 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.map((blog, idx) => (
                <div
                  key={blog._id}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/blogs/${blog._id}`}
                >
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-1">
                    <div className="relative overflow-hidden">
                      <img
                        src={blog.featuredImage || `https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                        alt={blog.title}
                        className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-primary-700 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                          {blog.category || 'Health'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <BookOpen className="w-4 h-4 mr-1.5" />
                        {blog.readTime || '5 min read'}
                        <span className="mx-2">•</span>
                        <span>{new Date(blog.createdAt || Date.now()).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 line-clamp-3 leading-relaxed">
                        {blog.excerpt || 'Read this informative article to learn more about health and wellness.'}
                      </p>
                      <div className="mt-4 flex items-center text-primary-600 font-semibold group-hover:text-primary-700">
                        Read More
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No blogs available</h3>
              <p className="text-gray-600">Check back later for health articles and tips</p>
            </div>
          )}

          <div className="sm:hidden mt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-semibold"
            >
              View All Blogs
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== TESTIMONIALS ==================== */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 opacity-50"></div>
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-yellow-50 text-yellow-700 rounded-full text-sm font-medium border border-yellow-100 mb-4">
              <Star className="w-4 h-4 mr-1.5 fill-yellow-500 text-yellow-500" />
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real experiences from our valued patients
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-1">
                <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mr-5 shadow-lg">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{testimonials[currentTestimonial].name}</h4>
                      <p className="text-gray-500">{testimonials[currentTestimonial].role}</p>
                    </div>
                  </div>
                  <div className="flex text-yellow-400 mb-6">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-lg sm:text-xl text-gray-700 leading-relaxed italic">
                    &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                  </blockquote>
                </div>
              </div>

              {/* Navigation dots */}
              <div className="flex justify-center mt-8 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentTestimonial
                        ? 'w-8 h-3 bg-gradient-to-r from-primary-500 to-purple-600'
                        : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FAQ ==================== */}
      <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-blue-50 text-primary-700 rounded-full text-sm font-medium border border-blue-100 mb-4">
              <HelpCircle className="w-4 h-4 mr-1.5" />
              FAQ
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get answers to common questions about our healthcare services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-primary-200 transition-colors duration-200">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center flex-1 pr-4">
                      <HelpCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    </div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 transition-all duration-300 ${
                      expandedFAQ === index ? 'bg-primary-100 text-primary-600 rotate-45' : 'text-gray-400'
                    }`}>
                      <Plus className="w-5 h-5" />
                    </div>
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-5 animate-slide-down">
                      <p className="text-gray-600 leading-relaxed pl-8">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NEWSLETTER ==================== */}
      <section className="relative py-20 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700"></div>
        <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container-custom relative">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white mb-6 border border-white/10">
              <Mail className="w-4 h-4 mr-2" />
              Stay Updated
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Get Health Tips & Updates
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
              Subscribe to our newsletter for the latest health insights, medical tips, and exclusive offers
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-xl text-gray-900 placeholder-gray-500 outline-none focus:ring-2 focus:ring-white/30 shadow-lg"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white text-primary-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  Subscribe
                  <Send className="w-4 h-4 ml-2" />
                </button>
              </div>
            </form>

            <p className="text-sm text-blue-200 mt-4">
              <CheckCircle className="w-4 h-4 inline mr-1" />
              Join 10,000+ subscribers. No spam, unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="relative py-20 lg:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
        <div className="container-custom relative text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied patients who trust DocCare for their medical needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-2xl hover:shadow-primary-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
            <Link
              to="/register"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-gray-900 transition-all duration-300 hover:-translate-y-0.5"
            >
              <Stethoscope className="w-5 h-5 inline mr-2" />
              Register as Doctor
            </Link>
            <Link
              to="/doctors"
              className="bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold hover:border-white hover:bg-white/5 transition-all duration-300"
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
