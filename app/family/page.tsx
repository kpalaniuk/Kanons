'use client'

import { useUser } from '@clerk/nextjs'
import { motion } from 'framer-motion'

export default function FamilyHub() {
  const { user } = useUser()

  return (
    <div className="page-transition pt-24 min-h-screen">
      {/* Welcome Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-terracotta font-medium mb-4 tracking-wider uppercase text-sm">
              Family Hub
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-midnight mb-4">
              Welcome, {user?.firstName || 'Family'}! 👋
            </h1>
            <p className="text-midnight/60">
              Your private family space
            </p>
          </motion.div>

          {/* Quick Links Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {/* Photos */}
            <a
              href="#" // Link to your family photo album (Google Photos, iCloud, etc.)
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Family Photos</h3>
              <p className="text-midnight/60 text-sm">Shared photo albums</p>
            </a>

            {/* Calendar */}
            <a
              href="#" // Link to family calendar
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean/20 transition-colors">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Family Calendar</h3>
              <p className="text-midnight/60 text-sm">Upcoming events</p>
            </a>

            {/* Documents */}
            <a
              href="#" // Link to shared documents
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-sunset/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-sunset/30 transition-colors">
                <span className="text-2xl">📁</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Shared Docs</h3>
              <p className="text-midnight/60 text-sm">Important documents</p>
            </a>

            {/* Recipes */}
            <a
              href="#" // Link to family recipes
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
                <span className="text-2xl">🍳</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Family Recipes</h3>
              <p className="text-midnight/60 text-sm">Our favorite dishes</p>
            </a>

            {/* Kids' Corner */}
            <a
              href="#" // Link to kids' content
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean/20 transition-colors">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Kids' Corner</h3>
              <p className="text-midnight/60 text-sm">Art, achievements & more</p>
            </a>

            {/* Westfalia Adventures */}
            <a
              href="#" // Link to Westfalia content
              className="bg-sand rounded-2xl p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="w-12 h-12 bg-sunset/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-sunset/30 transition-colors">
                <span className="text-2xl">🚐</span>
              </div>
              <h3 className="font-semibold text-midnight mb-2">Westfalia Log</h3>
              <p className="text-midnight/60 text-sm">Road trip memories</p>
            </a>
          </motion.div>

          {/* Notes / Updates Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 bg-midnight text-cream rounded-2xl p-8"
          >
            <h2 className="font-display text-2xl mb-4">Family Notes</h2>
            <p className="text-cream/60 mb-6">
              Quick updates and reminders for everyone.
            </p>
            <div className="space-y-4">
              {/* Placeholder for notes - you can make this dynamic later */}
              <div className="bg-cream/5 rounded-lg p-4">
                <p className="text-sm text-cream/80">
                  Add your family notes here. Could connect to a Notion database 
                  or simple JSON file for easy updates.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
