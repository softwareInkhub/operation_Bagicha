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

export default function GardeningCategoriesRow() {
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
      <section className="py-6 bg-white">
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Gardening Categories</h2>
            <button className="text-green-600 font-medium text-sm hover:text-green-700">
              View All
            </button>
          </div>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="flex-shrink-0 animate-pulse">
                <div className="flex flex-col items-center space-y-2 p-3 rounded-xl min-w-[80px] bg-white border border-gray-100">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
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
    <section className="py-6 bg-white">
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">Gardening Categories</h2>
          <button className="text-green-600 font-medium text-sm hover:text-green-700">
            View All
          </button>
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <button className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:shadow-md transition-all duration-200 min-w-[80px] bg-white border border-gray-100">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center overflow-hidden">
                  {(category as any).image ? (
                    <img
                      src={(category as any).image}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-xl">{category.icon}</span>
                  )}
                </div>
                <span className="text-xs font-normal text-green-600 text-center leading-tight">
                  {category.name}
                </span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 