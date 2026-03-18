import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Stethoscope, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Heart
} from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const quickLinks = [
    { name: 'Find Doctors', href: '/doctors' },
    { name: 'Book Appointment', href: '/doctors' },
    { name: 'Health Blogs', href: '/blogs' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  const services = [
    { name: 'General Consultation', href: '/doctors' },
    { name: 'Specialist Consultation', href: '/doctors' },
    { name: 'Online Consultation', href: '/doctors' },
    { name: 'Health Checkup', href: '/doctors' },
    { name: 'Emergency Care', href: '/contact' },
  ]

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'Disclaimer', href: '/disclaimer' },
  ]

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Stethoscope className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold">DocCare</span>
            </div>
            <p className="text-gray-300 mb-6">
              Your trusted platform for connecting with certified healthcare professionals. 
              Book appointments, consult online, and manage your health journey with ease.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <Link
                    to={service.href}
                    className="text-gray-300 hover:text-primary-400 transition-colors"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary-400" />
                <span className="text-gray-300">support@doccare.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-1" />
                <span className="text-gray-300">
                  123 Healthcare Ave<br />
                  Medical District, MD 12345<br />
                  United States
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-medium mb-2">Subscribe to Newsletter</h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md focus:outline-none focus:border-primary-500 text-white"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>© {currentYear} DocCare. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-gray-400 hover:text-primary-400 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 mt-4 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for better healthcare</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
