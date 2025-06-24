'use client'

import { motion } from 'framer-motion'

const gardeningCategories = [
  { id: 1, name: 'Indoor Plants', icon: '🪴', color: 'bg-green-100', textColor: 'text-green-600' },
  { id: 2, name: 'Outdoor Plants', icon: '🌳', color: 'bg-emerald-100', textColor: 'text-emerald-600' },
  { id: 3, name: 'Flowering Plants', icon: '🌸', color: 'bg-pink-100', textColor: 'text-pink-600' },
  { id: 4, name: 'Succulents', icon: '🌵', color: 'bg-orange-100', textColor: 'text-orange-600' },
  { id: 5, name: 'Herbs', icon: '🌿', color: 'bg-lime-100', textColor: 'text-lime-600' },
  { id: 6, name: 'Pots & Planters', icon: '🏺', color: 'bg-amber-100', textColor: 'text-amber-600' },
  { id: 7, name: 'Soil & Fertilizer', icon: '🪨', color: 'bg-brown-100', textColor: 'text-brown-600' },
  { id: 8, name: 'Gardening Tools', icon: '🛠️', color: 'bg-gray-100', textColor: 'text-gray-600' },
  { id: 9, name: 'Seeds', icon: '🌾', color: 'bg-yellow-100', textColor: 'text-yellow-600' },
  { id: 10, name: 'Watering', icon: '💧', color: 'bg-blue-100', textColor: 'text-blue-600' },
]

export default function GardeningCategoriesRow() {
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
          {gardeningCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex-shrink-0"
            >
              <button className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:shadow-md transition-all duration-200 min-w-[80px] bg-white border border-gray-100">
                <div className={`w-10 h-10 ${category.color} rounded-full flex items-center justify-center`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <span className={`text-xs font-normal ${category.textColor} text-center leading-tight`}>
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