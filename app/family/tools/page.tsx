'use client'

import { motion } from 'framer-motion'

export default function ToolsPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl text-midnight mb-2">Tools</h1>
        <p className="text-midnight/60">
          Utilities built by Jasper
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-cream rounded-2xl p-8 text-center"
      >
        <div className="w-16 h-16 bg-midnight/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🛠️</span>
        </div>
        <h2 className="font-display text-xl text-midnight mb-2">Jasper's Workshop</h2>
        <p className="text-midnight/60 max-w-md mx-auto">
          This is where Jasper will deploy tools and features for you.
          New tools will appear here as they're built.
        </p>
      </motion.div>
    </div>
  )
}
