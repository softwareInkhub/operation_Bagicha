'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'
import { useComponentConfig } from '@/lib/useComponentConfig'

const tools = [
  {
    id: '1',
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
    id: '2',
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
    id: '3',
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
    id: '4',
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
    id: '5',
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
    id: '6',
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
    id: '7',
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
    id: '8',
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
    id: '9',
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
    id: '10',
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
    id: '11',
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
    id: '12',
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Load admin configuration
  const { config } = useComponentConfig('tools-accessories', {
    showCategories: true,
    showPrices: true,
    showRatings: true,
    maxItems: 12,
    enableHover: true,
    showBadges: true
  })

  // Filter tools based on maxItems setting
  const filteredTools = tools.slice(0, config.maxItems)

  // Group tools by category
  const groupedTools: { [category: string]: typeof filteredTools } = {}
  filteredTools.forEach(tool => {
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

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setModalOpen(false)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
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
    const categoryTools = groupedTools[selectedCategory] || []
    return categoryTools.map((tool, index) => ({
      ...tool,
      wishlistButton: <WishlistButton product={{ 
        id: tool.id, 
        name: tool.name, 
        price: tool.price, 
        image: tool.image 
      }} />
    }))
  }

  return (
    <motion.section 
      className="mt-0 pt-0 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        🛠️ Tools & Accessories
      </motion.h2>
      
      {/* Two-row slider */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map(([category, categoryTools], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (rowIndex * 0.1) + (index * 0.1) }}
                  className={`bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start ${
                    config.enableHover ? 'hover:scale-105 hover:shadow-2xl' : ''
                  }`}
                  onClick={() => handleCardClick(category)}
                  whileHover={config.enableHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                    {categoryTools.slice(0, 4).map((tool, idx) => (
                      <img
                        key={tool.id}
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    ))}
                    {/* Fill empty slots if less than 4 products */}
                    {Array.from({ length: Math.max(0, 4 - categoryTools.length) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                    ))}
                  </div>
                  {/* +X more badge */}
                  {config.showBadges && (
                    <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">+{categoryTools.length} more</div>
                  )}
                  {/* Category name */}
                  {config.showCategories && (
                    <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{category}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Modal */}
      {modalOpen && !selectedProduct && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedProduct(null)
          }}
          title={selectedCategory || ''}
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🛠️'}
          items={getModalItems()}
          onProductClick={handleProductClick}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
        </div>
      )}
    </motion.section>
  )
} 