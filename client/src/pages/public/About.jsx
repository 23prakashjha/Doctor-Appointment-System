import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import {
  Users,
  Shield,
  Heart,
  Award,
  Target,
  Globe,
  Clock,
  CheckCircle,
  Stethoscope,
  TrendingUp,
  Sparkles,
  ArrowRight
} from 'lucide-react'

const About = () => {
  const stats = [
    { label: 'Verified Doctors', value: '500+', icon: Users, gradient: 'from-blue-500 to-cyan-500' },
    { label: 'Happy Patients', value: '10,000+', icon: Heart, gradient: 'from-red-500 to-rose-500' },
    { label: 'Appointments', value: '50,000+', icon: CheckCircle, gradient: 'from-green-500 to-emerald-500' },
    { label: 'Years of Service', value: '15+', icon: Clock, gradient: 'from-purple-500 to-pink-500' },
  ]

  const values = [
    {
      title: 'Quality Healthcare',
      description: 'We connect you with certified and experienced healthcare professionals who are committed to providing the best medical care.',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      title: 'Patient-Centric',
      description: 'Your health and comfort are our top priorities. We design our services around your needs and convenience.',
      icon: Heart,
      gradient: 'from-red-500 to-rose-500',
    },
    {
      title: 'Innovation',
      description: 'We leverage technology to make healthcare accessible, efficient, and transparent for everyone.',
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Trust & Safety',
      description: 'We maintain the highest standards of data privacy and security to protect your personal health information.',
      icon: Shield,
      gradient: 'from-green-500 to-emerald-500',
    },
  ]

  const team = [
    { name: 'Dr. Sarah Johnson', role: 'Medical Director', desc: 'Leading our medical team with 20+ years of experience in internal medicine.', avatar: 'SJ', gradient: 'from-blue-500 to-cyan-500' },
    { name: 'Michael Chen', role: 'CEO & Founder', desc: 'Passionate about making healthcare accessible through technology.', avatar: 'MC', gradient: 'from-purple-500 to-pink-500' },
    { name: 'Dr. Emily Rodriguez', role: 'Head of Clinical Operations', desc: 'Ensuring quality care and smooth patient experiences.', avatar: 'ER', gradient: 'from-green-500 to-emerald-500' },
    { name: 'James Wilson', role: 'CTO', desc: 'Building secure and innovative healthcare technology solutions.', avatar: 'JW', gradient: 'from-amber-500 to-orange-500' },
  ]

  return (
    <>
      <Helmet>
        <title>About Us - DocCare</title>
        <meta name="description" content="Learn about DocCare's mission to make healthcare accessible and convenient for everyone." />
      </Helmet>

      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-28 bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.03]"></div>
          <div className="container-custom relative">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl mb-6 shadow-xl shadow-primary-500/20">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <span className="inline-flex items-center px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
                <Sparkles className="w-4 h-4 mr-1.5" />
                About Us
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
                About <span className="gradient-text">DocCare</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                We're on a mission to make quality healthcare accessible, convenient, and affordable for everyone.
                Our platform connects patients with certified doctors, making it easier than ever to manage your health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/doctors" className="btn-primary btn-lg">
                  Find a Doctor
                </Link>
                <Link to="/contact" className="btn-outline btn-lg">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-white border-y border-gray-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission */}
        <section id="mission" className="py-20 lg:py-28">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="inline-flex items-center px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
                  <Target className="w-4 h-4 mr-1.5" />
                  Our Mission
                </span>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
                  Transforming Healthcare Access
                </h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  At DocCare, we believe that everyone deserves access to quality healthcare.
                  Our mission is to bridge the gap between patients and healthcare providers through
                  innovative technology and compassionate service.
                </p>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  We strive to make healthcare more accessible by eliminating geographical barriers,
                  reducing wait times, and providing transparent information about doctors and their services.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Target, title: 'Accessibility First', desc: 'Making healthcare available to everyone, everywhere', color: 'text-blue-600', bg: 'bg-blue-50' },
                    { icon: Shield, title: 'Trust & Quality', desc: 'Ensuring the highest standards of medical care', color: 'text-green-600', bg: 'bg-green-50' },
                    { icon: Heart, title: 'Patient Care', desc: 'Putting your health and well-being first', color: 'text-red-600', bg: 'bg-red-50' },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start p-4 rounded-xl ${item.bg}`}>
                      <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center mr-4 flex-shrink-0`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-100 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full blur-3xl opacity-60"></div>
                <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 sm:p-10 border border-gray-100">
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { value: '98%', label: 'Patient Satisfaction', gradient: 'from-green-500 to-emerald-500' },
                      { value: '24/7', label: 'Support Available', gradient: 'from-blue-500 to-cyan-500' },
                      { value: '50+', label: 'Specializations', gradient: 'from-purple-500 to-pink-500' },
                      { value: '100+', label: 'Cities Covered', gradient: 'from-amber-500 to-orange-500' },
                    ].map((item, i) => (
                      <div key={i} className="text-center p-4">
                        <div className={`w-14 h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg`}>
                          <span className="text-xl font-bold text-white">{item.value}</span>
                        </div>
                        <div className="font-semibold text-gray-900">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-gray-50 to-blue-50/50">
          <div className="container-custom">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
                <Heart className="w-4 h-4 mr-1.5" />
                Our Values
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                What We Stand For
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="group bg-white rounded-2xl p-8 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300">
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="container-custom">
            <div className="text-center mb-16">
              <span className="inline-flex items-center px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
                <Users className="w-4 h-4 mr-1.5" />
                Our Team
              </span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                The passionate people behind DocCare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group text-center">
                  <div className={`w-28 h-28 bg-gradient-to-br ${member.gradient} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-xl group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-300`}>
                    <span className="text-3xl font-bold text-white">{member.avatar}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 lg:py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-purple-700 overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.05]"></div>
          <div className="container-custom relative text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of patients who trust DocCare for their healthcare needs.
              Book your first appointment today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/doctors" className="bg-white text-primary-700 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 hover:shadow-2xl transition-all duration-300">
                Find a Doctor
              </Link>
              <Link to="/register" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-primary-700 transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
