"use client"

import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

export default function GardeningBlogs() {
  return (
    <motion.section
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="px-4">
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Gardening Blogs</h2>
        </motion.div>
        <div className="bg-blue-50 rounded-xl p-6 text-center text-blue-800 font-medium shadow-sm">
          🌱 Exciting gardening blog content coming soon!
        </div>
      </div>
    </motion.section>
  )
} 