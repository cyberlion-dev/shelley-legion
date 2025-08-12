'use client'

import { useState } from 'react'
import { Send, User, Mail, Phone, Calendar, MapPin, FileText } from 'lucide-react'
import emailjs from '@emailjs/browser'
import BaseballBackground from './BaseballBackground'

export default function ProspectForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    position: '',
    experience: '',
    city: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Replace these with your EmailJS credentials
      const serviceId = 'YOUR_SERVICE_ID'
      const templateId = 'YOUR_TEMPLATE_ID'
      const publicKey = 'YOUR_PUBLIC_KEY'

      const templateParams = {
        from_name: `${formData.firstName} ${formData.lastName}`,
        from_email: formData.email,
        phone: formData.phone,
        age: formData.age,
        position: formData.position,
        experience: formData.experience,
        city: formData.city,
        message: formData.message,
        to_name: 'Shelley Legion Coaching Staff'
      }

      await emailjs.send(serviceId, templateId, templateParams, publicKey)

      setSubmitStatus('success')
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        age: '',
        position: '',
        experience: '',
        city: '',
        message: ''
      })
    } catch (error) {
      console.error('EmailJS error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const positions = [
    'Pitcher',
    'Catcher',
    'First Base',
    'Second Base',
    'Third Base',
    'Shortstop',
    'Left Field',
    'Center Field',
    'Right Field',
    'Utility Player'
  ]

  return (
    <section id="contact" className="section-padding bg-legion-gray-50 dark:bg-legion-gray-900 relative overflow-hidden">
      <BaseballBackground />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-legion-red-600 mr-3" />
            <h2 className="text-4xl font-bold text-legion-gray-900 dark:text-white">Join the Legion</h2>
          </div>
          <p className="text-xl text-legion-gray-600 dark:text-legion-gray-300 max-w-2xl mx-auto">
            Are you 18 or under and ready to play ball? Join the Shelley Legion youth baseball team! Fill out our prospect form and we'll be in touch.
          </p>
        </div>

        <div className="bg-white dark:bg-legion-gray-800 rounded-xl shadow-lg p-8 border-t-4 border-legion-red-600">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="form-label">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                  placeholder="(208) 555-0123"
                />
              </div>
            </div>

            {/* Baseball Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Age *
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  required
                  min="12"
                  max="18"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                  placeholder="16"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  Primary Position *
                </label>
                <select
                  id="position"
                  name="position"
                  required
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                >
                  <option value="">Select Position</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-legion-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                  placeholder="Shelley, ID"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-legion-gray-700 mb-2">
                Baseball Experience *
              </label>
              <input
                type="text"
                id="experience"
                name="experience"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors"
                placeholder="e.g., High School JV/Varsity, Little League, Travel Ball, etc."
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-legion-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Additional Information
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-legion-red-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about your baseball background, achievements, or anything else you'd like us to know..."
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-all duration-300 ${isSubmitting
                  ? 'bg-legion-gray-400 cursor-not-allowed'
                  : 'bg-legion-red-600 hover:bg-legion-red-700 transform hover:scale-105'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Submit Application
                  </>
                )}
              </button>
            </div>

            {/* Status Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 font-semibold">
                  🎉 Application submitted successfully! We'll be in touch soon.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 font-semibold">
                  ❌ There was an error submitting your application. Please try again.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}