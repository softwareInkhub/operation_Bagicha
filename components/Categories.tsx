'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCategories } from '@/lib/firebase'

interface Category {
  id: string
  name: string
  icon: string
  description?: string
}

let curatedCategories: Category[] = [
  { id: 'all', name: 'All', icon: '🌱' },
  { id: 'soil', name: 'Soil', icon: '🪨' },
  { id: 'fertilizer', name: 'Fertilizer', icon: '🧪' },
  { id: 'seeds', name: 'Seeds', icon: '🌾' },
  { id: 'tools', name: 'Tools', icon: '🛠️' },
  { id: 'accessories', name: 'Accessories', icon: '🎍' },
  { id: 'offers', name: 'Offers', icon: '🎁' },
  { id: 'wishlist', name: 'Wishlist', icon: '❤️' },
]

// Remove duplicates by name+icon and filter out 'wishlist'
curatedCategories = curatedCategories.filter((cat, idx, arr) =>
  cat.name.toLowerCase() !== 'wishlist' &&
  arr.findIndex(c => c.name === cat.name && c.icon === cat.icon) === idx
)

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories() as Category[]
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to some default categories if Firebase fails
      setCategories([
        { id: '1', name: 'Indoor Plants', icon: '🪴' },
        { id: '2', name: 'Outdoor Plants', icon: '🌳' },
        { id: '3', name: 'Flowering Plants', icon: '🌸' },
        { id: '4', name: 'Succulents', icon: '🌵' },
        { id: '5', name: 'Tools', icon: '🛠️' },
        { id: '6', name: 'Pots & Planters', icon: '🏺' },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-4 bg-white overflow-x-hidden">
        <div className="mobile-container">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-base font-semibold text-gray-800">Shop Gardening Items</h2>
            <button className="text-primary-600 font-medium text-xs sm:text-sm hover:text-primary-700 whitespace-nowrap">
              View All
            </button>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 animate-pulse">
                <div className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-xl min-w-[70px] sm:min-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                  <div className="w-16 h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-4 bg-white overflow-x-hidden">
      <div className="mobile-container">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <h2 className="text-base font-semibold text-gray-800 truncate max-w-[70vw] sm:max-w-none">Shop Gardening Items</h2>
          <button className="text-primary-600 font-medium text-xs sm:text-sm hover:text-primary-700 whitespace-nowrap">
            View All
          </button>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2">
          {curatedCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <button className="flex flex-col items-center space-y-2 p-2 sm:p-4 rounded-xl hover:shadow-md transition-all duration-200 min-w-[70px] sm:min-w-[80px]">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  <span className="text-xl sm:text-2xl">{category.icon}</span>
                </div>
                <span className="text-xs font-normal text-green-600">{category.name}</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 