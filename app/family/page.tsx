'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function FamilyHub() {
  const { user } = useUser()

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl text-midnight mb-2">
          Welcome, {user?.firstName || 'Family'} 👋
        </h1>
        <p className="text-midnight/60">
          Your private family space
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tasks - Jasper's to-do app */}
        <Link
          href="/family/tasks"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
            <span className="text-2xl">✅</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Tasks</h3>
          <p className="text-midnight/60 text-sm">Your to-do list, powered by Jasper</p>
        </Link>

        {/* Photos */}
        <a
          href="#"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean/20 transition-colors">
            <span className="text-2xl">📷</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Family Photos</h3>
          <p className="text-midnight/60 text-sm">Shared photo albums</p>
        </a>

        {/* Calendar */}
        <a
          href="#"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-sunset/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-sunset/20 transition-colors">
            <span className="text-2xl">📅</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Family Calendar</h3>
          <p className="text-midnight/60 text-sm">Upcoming events</p>
        </a>

        {/* Recipes */}
        <a
          href="#"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-terracotta/20 transition-colors">
            <span className="text-2xl">🍳</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Family Recipes</h3>
          <p className="text-midnight/60 text-sm">Our favorite dishes</p>
        </a>

        {/* Kids' Corner */}
        <a
          href="#"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-ocean/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-ocean/20 transition-colors">
            <span className="text-2xl">🎨</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Kids' Corner</h3>
          <p className="text-midnight/60 text-sm">Art, achievements & more</p>
        </a>

        {/* Tools - Jasper's build space */}
        <Link
          href="/family/tools"
          className="bg-cream rounded-2xl p-6 hover:shadow-lg transition-shadow group"
        >
          <div className="w-12 h-12 bg-midnight/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-midnight/20 transition-colors">
            <span className="text-2xl">🛠️</span>
          </div>
          <h3 className="font-semibold text-midnight mb-2">Tools</h3>
          <p className="text-midnight/60 text-sm">Jasper-built utilities</p>
        </Link>
      </div>
    </div>
  )
}
