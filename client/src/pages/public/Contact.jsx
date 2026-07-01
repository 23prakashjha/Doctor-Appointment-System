import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import {
  Phone, Mail, MapPin, Clock, Send, MessageSquare, User, Sparkles, ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', desc: 'Mon-Fri 9AM-6PM EST', gradient: 'from-blue-500 to-cyan-500' },
    { icon: Mail, label: 'Email', value: 'support@doccare.com', desc: 'We respond within 24 hours', gradient: 'from-purple-500 to-pink-500' },
    { icon: MapPin, label: 'Address', value: '123 Healthcare Ave, Medical District, MD 12345', desc: 'Visit our office', gradient: 'from-green-500 to-emerald-500' },
  ]

  const faqs = [
    { q: 'How do I book an appointment?', a: 'You can book an appointment by searching for doctors, selecting your preferred doctor, and choosing an available time slot.' },
    { q: 'What payment methods are accepted?', a: 'We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through Razorpay.' },
    { q: 'Can I cancel or reschedule my appointment?', a: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time through your dashboard.' },
    { q: 'Are the doctors on your platform verified?', a: 'Yes, all doctors on our platform are verified and have valid medical licenses.' },
  ]

  return (
    <>
      <Helmet>
        <title>Contact Us - DocCare</title>
        <meta name="description" content="Get in touch with DocCare support team for any questions or assistance." />
      </Helmet>

      <div className="pt-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="container-custom section-padding">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-1.5 bg-emerald-500/10 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
              <Sparkles className="w-4 h-4 mr-1.5" />
              Get in Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
              Contact Us
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="dark-glass rounded-2xl p-6 border border-white/[0.06] hover:shadow-lg hover:border-primary-100 transition-all duration-300 group">
                  <div className="flex items-start">
                    <div className={`w-12 h-12 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <info.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">{info.label}</h3>
                      <p className="text-white mb-1 text-sm">{info.value}</p>
                      <p className="text-sm text-gray-400">{info.desc}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Office Hours */}
              <div className="dark-glass rounded-2xl p-6 border border-white/[0.06]">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-emerald-400 mr-2" />
                  <h3 className="font-bold text-white">Office Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-gray-400">Monday - Friday</span>
                    <span className="font-semibold text-white">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-white/[0.06]">
                    <span className="text-gray-400">Saturday</span>
                    <span className="font-semibold text-white">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-400">Sunday</span>
                    <span className="font-semibold text-white">Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 border border-red-100">
                <h3 className="font-bold text-red-800 mb-2">🚨 Emergency Support</h3>
                <p className="text-red-700 text-sm mb-2">For medical emergencies, please call:</p>
                <p className="text-red-900 font-bold text-lg">911 or your local emergency number</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="dark-glass rounded-2xl shadow-xl shadow-gray-200/50 border border-white/[0.06] p-8 sm:p-10">
                <h2 className="text-2xl font-bold text-white mb-8">Send us a Message</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-1.5">Your Name *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })} type="text" autoComplete="name" className="input pl-11" placeholder="John Doe" />
                      </div>
                      {errors.name && <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-200 mb-1.5">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                        <input {...register('email', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} type="email" autoComplete="email" className="input pl-11" placeholder="john@example.com" />
                      </div>
                      {errors.email && <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                      <input {...register('phone', { pattern: { value: /^[0-9]{10}$/, message: 'Valid 10-digit number' } })} type="tel" autoComplete="tel" className="input pl-11" placeholder="(555) 123-4567" />
                    </div>
                    {errors.phone && <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">Subject *</label>
                    <select {...register('subject', { required: 'Select a subject' })} className="input">
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="appointment">Appointment Issue</option>
                      <option value="payment">Payment Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback</option>
                    </select>
                    {errors.subject && <p className="mt-1 text-sm text-error-600">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-200 mb-1.5">Message *</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
                      <textarea {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Min 10 characters' } })} rows={5} className="input pl-11 resize-none" placeholder="How can we help you?" />
                    </div>
                    {errors.message && <p className="mt-1 text-sm text-error-600">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <div className="text-center mb-12">
              <span className="inline-flex items-center px-4 py-1.5 bg-emerald-500/10 text-primary-700 rounded-full text-sm font-medium border border-primary-100 mb-4">
                <MessageSquare className="w-4 h-4 mr-1.5" />
                FAQ
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Quick Answers</h2>
              <p className="text-gray-300">Frequently asked questions</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index} className="dark-glass rounded-2xl p-6 border border-white/[0.06] hover:shadow-lg hover:border-primary-100 transition-all duration-300">
                  <h3 className="font-bold text-white mb-2 flex items-start">
                    <ChevronRight className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                    {faq.q}
                  </h3>
                  <p className="text-gray-300 text-sm pl-7">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="mt-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Visit Our Office</h2>
              <p className="text-gray-300">Find us at our headquarters in Medical District</p>
            </div>
            <div className="dark-glass rounded-2xl border border-white/[0.06] overflow-hidden shadow-lg">
              <div className="aspect-[16/7] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                  <p className="text-lg font-bold text-white">DocCare Headquarters</p>
                  <p className="text-gray-300">123 Healthcare Ave, Medical District, MD 12345</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
