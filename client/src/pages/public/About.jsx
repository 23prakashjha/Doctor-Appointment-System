import React from 'react'
import { Helmet } from 'react-helmet-async'
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
  TrendingUp
} from 'lucide-react'

const About = () => {
  const stats = [
    { label: 'Verified Doctors', value: '500+', icon: Users },
    { label: 'Happy Patients', value: '10,000+', icon: Heart },
    { label: 'Successful Appointments', value: '50,000+', icon: CheckCircle },
    { label: 'Years of Service', value: '15+', icon: Clock },
  ]

  const values = [
    {
      title: 'Quality Healthcare',
      description: 'We connect you with certified and experienced healthcare professionals who are committed to providing the best medical care.',
      icon: Shield,
    },
    {
      title: 'Patient-Centric',
      description: 'Your health and comfort are our top priorities. We design our services around your needs and convenience.',
      icon: Heart,
    },
    {
      title: 'Innovation',
      description: 'We leverage technology to make healthcare accessible, efficient, and transparent for everyone.',
      icon: TrendingUp,
    },
    {
      title: 'Trust & Safety',
      description: 'We maintain the highest standards of data privacy and security to protect your personal health information.',
      icon: Shield,
    },
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Medical Director',
      description: 'Leading our medical team with 20+ years of experience in internal medicine.',
      avatar: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'CEO & Founder',
      description: 'Passionate about making healthcare accessible through technology.',
      avatar: 'MC',
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Clinical Operations',
      description: 'Ensuring quality care and smooth patient experiences.',
      avatar: 'ER',
    },
    {
      name: 'James Wilson',
      role: 'CTO',
      description: 'Building secure and innovative healthcare technology solutions.',
      avatar: 'JW',
    },
  ]

  return (
    <>
      <Helmet>
        <title>About Us - DocCare</title>
        <meta name="description" content="Learn about DocCare's mission to make healthcare accessible and convenient for everyone." />
      </Helmet>

      <div className="pt-16 bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About DocCare
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We're on a mission to make quality healthcare accessible, convenient, and affordable for everyone. 
                Our platform connects patients with certified doctors, making it easier than ever to manage your health.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#mission" className="btn-primary btn-lg">
                  Learn More
                </a>
                <a href="#contact" className="btn-outline btn-lg">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section id="mission" className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  At DocCare, we believe that everyone deserves access to quality healthcare. 
                  Our mission is to bridge the gap between patients and healthcare providers through 
                  innovative technology and compassionate service.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  We strive to make healthcare more accessible by eliminating geographical barriers, 
                  reducing wait times, and providing transparent information about doctors and their services.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Target className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Accessibility First</h3>
                      <p className="text-gray-600">Making healthcare available to everyone, everywhere</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Trust & Quality</h3>
                      <p className="text-gray-600">Ensuring the highest standards of medical care</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Heart className="w-6 h-6 text-primary-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Patient Care</h3>
                      <p className="text-gray-600">Putting your health and well-being first</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6 text-success-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">98%</div>
                      <div className="text-sm text-gray-600">Patient Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">24/7</div>
                      <div className="text-sm text-gray-600">Support Available</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-warning-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">50+</div>
                      <div className="text-sm text-gray-600">Specializations</div>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Globe className="w-6 h-6 text-secondary-600" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">100+</div>
                      <div className="text-sm text-gray-600">Cities Covered</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600">
                      {value.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                The passionate people behind DocCare
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-24 h-24 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">
                      {member.avatar}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary-600">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of patients who trust DocCare for their healthcare needs. 
              Book your first appointment today and experience the difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/doctors" className="btn bg-white text-primary-600 hover:bg-gray-100 btn-lg">
                Find a Doctor
              </a>
              <a href="/register" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg">
                Sign Up
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default About
