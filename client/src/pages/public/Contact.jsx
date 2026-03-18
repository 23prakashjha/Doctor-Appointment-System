import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send,
  MessageSquare,
  User,
  Building
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
      // Simulate API call
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
    {
      icon: Phone,
      label: 'Phone',
      value: '+1 (555) 123-4567',
      description: 'Mon-Fri 9AM-6PM EST'
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'support@doccare.com',
      description: 'We respond within 24 hours'
    },
    {
      icon: MapPin,
      label: 'Address',
      value: '123 Healthcare Ave, Medical District, MD 12345',
      description: 'Visit our office'
    }
  ]

  const faqs = [
    {
      question: 'How do I book an appointment?',
      answer: 'You can book an appointment by searching for doctors, selecting your preferred doctor, and choosing an available time slot. You\'ll need to create an account and provide basic information.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept all major credit cards, debit cards, UPI, and net banking. All payments are processed securely through Razorpay.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time through your dashboard.'
    },
    {
      question: 'Are the doctors on your platform verified?',
      answer: 'Yes, all doctors on our platform are verified and have valid medical licenses. We also check their credentials and experience.'
    },
    {
      question: 'Is my medical information secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your personal and medical information.'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Contact Us - DocCare</title>
        <meta name="description" content="Get in touch with DocCare support team for any questions or assistance." />
      </Helmet>

      <div className="pt-16 bg-gray-50 min-h-screen">
        <div className="container-custom section-padding">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help. 
              Reach out to us through any of the following channels.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div key={index} className="flex items-start">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {info.label}
                        </h3>
                        <p className="text-gray-900 mb-1">{info.value}</p>
                        <p className="text-sm text-gray-600">{info.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Office Hours */}
              <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-primary-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Office Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-900">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-900">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-900">Closed</span>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-6 p-4 bg-error-50 border border-error-200 rounded-lg">
                <h3 className="font-semibold text-error-800 mb-2">
                  Emergency Support
                </h3>
                <p className="text-error-700 text-sm mb-2">
                  For medical emergencies, please call:
                </p>
                <p className="text-error-900 font-bold">911 or your local emergency number</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          {...register('name', {
                            required: 'Name is required',
                            minLength: {
                              value: 2,
                              message: 'Name must be at least 2 characters',
                            },
                          })}
                          type="text"
                          className="input pl-10"
                          placeholder="John Doe"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-error-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address',
                            },
                          })}
                          type="email"
                          className="input pl-10"
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-error-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        {...register('phone', {
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: 'Please enter a valid 10-digit phone number',
                          },
                        })}
                        type="tel"
                        className="input pl-10"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-error-600">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      {...register('subject', {
                        required: 'Please select a subject',
                      })}
                      className="input"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="appointment">Appointment Issue</option>
                      <option value="payment">Payment Question</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-error-600">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters',
                          },
                        })}
                        rows={5}
                        className="input pl-10 resize-none"
                        placeholder="How can we help you?"
                      />
                    </div>
                    {errors.message && (
                      <p className="mt-1 text-sm text-error-600">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner w-5 h-5 mr-2"></div>
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

          {/* FAQ Section */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Visit Our Office
              </h2>
              <p className="text-gray-600">
                Find us at our headquarters in Medical District
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Interactive Map</p>
                  <p className="text-sm text-gray-500">123 Healthcare Ave, Medical District, MD 12345</p>
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
