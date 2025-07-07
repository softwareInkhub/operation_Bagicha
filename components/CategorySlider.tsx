'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getCategories } from '@/lib/firebase'

interface Category {
  id?: string
  name: string
  icon: string
  sectionId?: string
}

export default function CategorySlider() {
  const [categories, setCategories] = useState<Category[]>([])
  const [active, setActive] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories() as Category[]
      
      // Add default categories that are essential for navigation
      const defaultCategories: Category[] = [
        { name: 'All', icon: '🌱', sectionId: 'top' },
        { name: 'Soil', icon: '🪨', sectionId: 'soils-section' },
        { name: 'Fertilizer', icon: '🧪', sectionId: 'fertilizer-section' },
        { name: 'Seeds', icon: '🌾', sectionId: 'seeds-section' },
        { name: 'Planters', icon: '🏺', sectionId: 'planters-section' },
        { name: 'Tools', icon: '🛠️', sectionId: 'tools-and-accessories' },
        { name: 'Accessories', icon: '🎍', sectionId: 'tools-and-accessories' },
        { name: 'Offers', icon: '🎁', sectionId: 'offers-section' },
      ]

      // Map Firebase categories to include navigation sections
      const firebaseCategories: Category[] = categoriesData.map(cat => ({
        ...cat,
        sectionId: getSectionId(cat.name)
      }))

      // Combine categories and remove duplicates by name
      const allCategories = [...defaultCategories]
      
      // Add Firebase categories only if they don't already exist
      firebaseCategories.forEach(firebaseCat => {
        const exists = allCategories.some(cat => cat.name.toLowerCase() === firebaseCat.name.toLowerCase())
        if (!exists) {
          allCategories.push(firebaseCat)
        }
      })
      
      setCategories(allCategories)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to default categories if Firebase fails
      const defaultCategories: Category[] = [
        { name: 'All', icon: '🌱', sectionId: 'top' },
        { name: 'Plants', icon: '🪴', sectionId: 'trending-plants' },
        { name: 'Planters', icon: '🏺', sectionId: 'planters-section' },
        { name: 'Soil', icon: '🪨', sectionId: 'soils-section' },
        { name: 'Fertilizer', icon: '🧪', sectionId: 'fertilizer-section' },
        { name: 'Seeds', icon: '🌾', sectionId: 'seeds-section' },
        { name: 'Tools', icon: '🛠️', sectionId: 'tools-and-accessories' },
        { name: 'Accessories', icon: '🎍', sectionId: 'tools-and-accessories' },
        { name: 'Offers', icon: '🎁', sectionId: 'offers-section' },
      ]
      setCategories(defaultCategories)
    } finally {
      setLoading(false)
    }
  }

  const getSectionId = (categoryName: string) => {
    const sectionMap: { [key: string]: string } = {
      'Indoor Plants': 'trending-plants',
      'Flowering Plants': 'bestseller-section',
      'Outdoor Plants': 'new-arrivals',
      'Tools': 'tools-and-accessories',
      'Soil & Fertilizer': 'fertilizer-section',
      'Soil': 'soils-section',
      'Pots & Planters': 'planters-section',
      'Planters': 'planters-section',
      'Seeds': 'seeds-section',
    }
    return sectionMap[categoryName] || 'product-catalog'
  }

  const handleCategoryClick = (cat: Category) => {
    setActive(cat.name)
    const section = document.getElementById(cat.sectionId || 'product-catalog')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="overflow-x-auto flex gap-2 px-3 py-2 my-0 bg-white border-b">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="w-18 flex flex-col items-center justify-center px-2 py-1 animate-pulse">
            <div className="w-10 h-10 bg-gray-200 rounded-full mb-1"></div>
            <div className="w-12 h-3 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto flex gap-2 px-3 py-0 my-0 leading-none h-auto min-h-0 bg-white border-b scrollbar-none snap-x snap-mandatory">
      {categories.map((cat, idx) => (
        <motion.button
          key={cat.id || cat.name}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: idx * 0.05 }}
          onClick={() => handleCategoryClick(cat)}
          className={`w-18 flex flex-col items-center justify-center px-2 py-1 snap-start transition-all duration-300 hover:scale-105 focus:outline-none ${
            active === cat.name 
              ? 'font-semibold text-green-600' 
              : 'text-gray-700 font-medium hover:text-green-500'
          }`}
        >
          <motion.span 
            className={`mb-1 flex items-center justify-center rounded-full w-10 h-10 ${
              active === cat.name 
                ? 'bg-green-500 text-white shadow-md' 
                : 'bg-green-50 text-gray-700 hover:bg-green-100'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.icon}
          </motion.span>
          <span className={`mt-1 text-xs ${
            active === cat.name 
              ? 'font-semibold text-green-600' 
              : 'text-gray-700 font-medium'
          }`}>
            {cat.name}
          </span>
        </motion.button>
      ))}
    </div>
  )
} 