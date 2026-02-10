'use client'

import { motion } from 'framer-motion'
import AnimatedSection from '@/components/AnimatedSection'

export default function Contact() {
  return (
    <div className="page-transition pt-24">
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm"
          >
            Contact
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl text-midnight mb-6"
          >
            Let's Connect
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-midnight/60 max-w-xl mx-auto"
          >
            Whether it's about business, music, community, or just to say hello — 
            I'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* Contact Methods */}
      <AnimatedSection className="py-20 bg-sand">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Email */}
            <a
              href="mailto:kyle@palaniuk.net"
              className="bg-cream rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-terracotta/20 transition-colors">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-2">Email</h3>
              <p className="text-terracotta font-medium">kyle@palaniuk.net</p>
              <p className="text-midnight/60 text-sm mt-2">
                Best for detailed inquiries
              </p>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com/in/kylepalaniuk"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-ocean/20 transition-colors">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-2">LinkedIn</h3>
              <p className="text-ocean font-medium">Connect with me</p>
              <p className="text-midnight/60 text-sm mt-2">
                Professional networking
              </p>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/kyle_theukrainian"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-cream rounded-2xl p-8 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-sunset/20 rounded-full flex items-center justify-center mb-6 group-hover:bg-sunset/30 transition-colors">
                <span className="text-2xl">📸</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-2">Instagram</h3>
              <p className="text-sunset font-medium">@kyle_theukrainian</p>
              <p className="text-midnight/60 text-sm mt-2">
                Behind the scenes
              </p>
            </a>

            {/* Location */}
            <div className="bg-cream rounded-2xl p-8">
              <div className="w-12 h-12 bg-midnight/10 rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-display text-2xl text-midnight mb-2">Location</h3>
              <p className="text-midnight font-medium">San Diego, California</p>
              <p className="text-midnight/60 text-sm mt-2">
                Available for local meetups
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Form (Optional - Simple Version) */}
      <AnimatedSection className="py-20 md:py-32">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="font-display text-3xl text-midnight mb-8 text-center">
            Send a Message
          </h2>
          
          <form 
            action="https://formspree.io/f/YOUR_FORM_ID" // Replace with your Formspree ID
            method="POST"
            className="space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-midnight mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-3 bg-sand border border-transparent rounded-lg focus:border-terracotta focus:outline-none transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-midnight mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-sand border border-transparent rounded-lg focus:border-terracotta focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-midnight mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 bg-sand border border-transparent rounded-lg focus:border-terracotta focus:outline-none transition-colors"
              >
                <option value="general">General Inquiry</option>
                <option value="business">Business / Professional</option>
                <option value="music">Music / Booking</option>
                <option value="collaboration">Collaboration</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-midnight mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="w-full px-4 py-3 bg-sand border border-transparent rounded-lg focus:border-terracotta focus:outline-none transition-colors resize-none"
                placeholder="What's on your mind?"
              />
            </div>
            
            <button
              type="submit"
              className="w-full px-8 py-4 bg-midnight text-cream rounded-lg font-medium hover:bg-ocean transition-colors"
            >
              Send Message
            </button>
          </form>
          
          <p className="text-center text-midnight/40 text-sm mt-6">
            I typically respond within 24-48 hours
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
