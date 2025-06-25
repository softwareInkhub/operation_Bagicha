import { useState } from 'react'
import { motion } from 'framer-motion'

interface Category {
  name: string;
  icon: string;
  sectionId: string;
}

const categories: Category[] = [
  { name: 'All', icon: '🌱', sectionId: 'top' },
  { name: 'Indoor Plants', icon: '🪴', sectionId: 'trending-plants' },
  { name: 'Flowering Plants', icon: '🌸', sectionId: 'bestseller-section' },
  { name: 'Pots & Gamlas', icon: '🏺', sectionId: 'product-catalog' },
  { name: 'Seeds', icon: '🌾', sectionId: 'product-catalog' },
  { name: 'Fertilizers', icon: '🧪', sectionId: 'fertilizer-section' },
  { name: 'Tools', icon: '🛠️', sectionId: 'tools-and-accessories' },
  { name: 'Offers', icon: '🎁', sectionId: 'offers-section' },
  { name: 'Wishlist', icon: '❤️', sectionId: 'wishlist' },
]

export default function CategorySlider() {
  const [active, setActive] = useState('All')

  const handleCategoryClick = (cat: Category) => {
    setActive(cat.name)
    const section = document.getElementById(cat.sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="overflow-x-auto flex gap-2 px-3 py-0 my-0 leading-none h-auto min-h-0 bg-white border-b scrollbar-none snap-x snap-mandatory">
      {categories.map((cat, idx) => (
        <motion.button
          key={cat.name}
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