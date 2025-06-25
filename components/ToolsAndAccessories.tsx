'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import WishlistButton from './WishlistButton'

const tools = [
  {
    id: 1,
    name: 'Professional Pruner',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 156,
    icon: '✂️',
    category: 'Cutting Tools',
    features: ['Sharp Blades', 'Ergonomic Grip', 'Safety Lock']
  },
  {
    id: 2,
    name: 'Garden Trowel Set',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 89,
    icon: '🛠️',
    category: 'Digging Tools',
    features: ['Stainless Steel', '3 Sizes', 'Comfortable Handle']
  },
  {
    id: 3,
    name: 'Watering Can',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 449,
    originalPrice: 599,
    rating: 4.7,
    reviews: 234,
    icon: '💧',
    category: 'Watering',
    features: ['2L Capacity', 'Fine Rose', 'Ergonomic Design']
  },
  {
    id: 4,
    name: 'Garden Gloves',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 199,
    originalPrice: 299,
    rating: 4.5,
    reviews: 167,
    icon: '🧤',
    category: 'Protection',
    features: ['Leather Palm', 'Breathable', 'Touch Compatible']
  },
  {
    id: 5,
    name: 'Plant Mister',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 149,
    originalPrice: 199,
    rating: 4.4,
    reviews: 98,
    icon: '💧',
    category: 'Watering',
    features: ['Fine Mist', '500ml Capacity', 'Adjustable Nozzle']
  },
  {
    id: 6,
    name: 'Garden Fork',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 249,
    originalPrice: 349,
    rating: 4.3,
    reviews: 76,
    icon: '🛠️',
    category: 'Digging Tools',
    features: ['Sturdy Design', '4 Prongs', 'Wooden Handle']
  },
  {
    id: 7,
    name: 'Garden Rake',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 199,
    originalPrice: 299,
    rating: 4.2,
    reviews: 54,
    icon: '🛠️',
    category: 'Raking Tools',
    features: ['Wide Head', 'Lightweight', 'Durable']
  },
  {
    id: 8,
    name: 'Garden Shears',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 399,
    originalPrice: 549,
    rating: 4.6,
    reviews: 112,
    icon: '✂️',
    category: 'Cutting Tools',
    features: ['Sharp Blades', 'Spring Loaded', 'Safety Lock']
  },
  {
    id: 9,
    name: 'Garden Sprayer',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 349,
    originalPrice: 449,
    rating: 4.5,
    reviews: 88,
    icon: '💧',
    category: 'Watering',
    features: ['2L Capacity', 'Adjustable Spray', 'Pump Action']
  },
  {
    id: 10,
    name: 'Garden Apron',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 179,
    originalPrice: 249,
    rating: 4.4,
    reviews: 67,
    icon: '🧤',
    category: 'Protection',
    features: ['Waterproof', 'Multiple Pockets', 'Adjustable Straps']
  },
  {
    id: 11,
    name: 'Garden Hoe',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.4,
    reviews: 41,
    icon: '🛠️',
    category: 'Hoeing Tools',
    features: ['Sharp Edge', 'Wooden Handle']
  },
  {
    id: 12,
    name: 'Leaf Blower',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 67,
    icon: '🛠️',
    category: 'Blowing Tools',
    features: ['Electric', 'Lightweight']
  }
]

export default function ToolsAndAccessories() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Group tools by category
  const groupedTools: { [category: string]: typeof tools } = {}
  tools.forEach(tool => {
    if (!groupedTools[tool.category]) groupedTools[tool.category] = []
    groupedTools[tool.category].push(tool)
  })

  // Prepare cards for two-row slider
  const cardEntries = Object.entries(groupedTools)
  const cardsPerRow = Math.ceil(cardEntries.length / 2)
  const rows = [
    cardEntries.slice(0, cardsPerRow),
    cardEntries.slice(cardsPerRow)
  ]

  const handleCardClick = (category: string) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Cutting Tools': '✂️',
      'Digging Tools': '🛠️',
      'Watering': '💧',
      'Protection': '🧤',
      'Raking Tools': '🛠️',
      'Hoeing Tools': '🛠️',
      'Blowing Tools': '🛠️'
    }
    return icons[category] || '🛠️'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    return groupedTools[selectedCategory].slice(0, 4).map(tool => ({
      name: tool.name,
      image: tool.image,
      price: tool.price,
      rating: tool.rating,
      reviews: tool.reviews,
      description: tool.features.join(', '),
      wishlistButton: <WishlistButton product={tool} />
    }))
  }

  return (
    <motion.section 
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="px-4">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Tools & Accessories</h2>
            <p className="text-gray-600 mt-1">Professional gardening tools for every need</p>
          </div>
        </motion.div>
        
        <div className="flex flex-col gap-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 pb-2 scrollbar-none w-full">
              {row.map(([category, items], idx) => {
                const images = [
                  ...items.slice(0, 4),
                  ...Array(4 - items.length).fill({ image: '/placeholder.png', name: 'Placeholder', id: `ph-${category}-${idx}` })
                ].slice(0, 4)
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white shadow-lg border border-gray-100 rounded-2xl p-4 flex flex-col items-center min-w-[140px] max-w-[160px] mx-auto snap-start cursor-pointer"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCardClick(category)}
                  >
                    {/* 2x2 image grid */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                      {images.map((product, iidx) => (
                        <img
                          key={product.id || iidx}
                          src={product.image}
                          alt={product.image === '/placeholder.png' ? 'Placeholder' : product.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain rounded bg-gray-50 border border-gray-100 mx-auto"
                        />
                      ))}
                    </div>
                    {/* +X more badge */}
                    <div className="text-[11px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-2 py-0.5 rounded-full shadow-sm">
                      +{items.length} more
                    </div>
                    {/* Category name */}
                    <div className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight mt-0.5">
                      {category}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory || ''}
        icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🛠️'}
        items={getModalItems()}
      />
    </motion.section>
  )
} 