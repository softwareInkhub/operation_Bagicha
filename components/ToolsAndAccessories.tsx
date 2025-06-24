'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Wrench, Scissors, Droplets, Shield } from 'lucide-react'
import { useCart } from '../context/CartContext'

const tools = [
  {
    id: 1,
    name: 'Professional Pruner',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 156,
    icon: Scissors,
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
    icon: Wrench,
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
    icon: Droplets,
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
    icon: Shield,
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
    icon: Droplets,
    category: 'Watering',
    features: ['Fine Mist', '500ml Capacity', 'Adjustable Nozzle']
  },
  {
    id: 6,
    name: 'Soil pH Tester',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 399,
    originalPrice: 549,
    rating: 4.9,
    reviews: 78,
    icon: Wrench,
    category: 'Testing',
    features: ['Digital Display', 'Moisture Test', 'Light Test']
  }
]

export default function ToolsAndAccessories() {
  const [hoveredTool, setHoveredTool] = useState<number | null>(null)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { addToCart } = useCart()

  const handleAddToCart = (tool: typeof tools[0]) => {
    addToCart({
      name: tool.name,
      image: tool.image,
      price: tool.price,
      qty: 1
    })
    
    setToastMessage(`${tool.name} added to cart!`)
    setShowToast(true)
    
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  return (
    <motion.section 
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4">
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Tools & Accessories</h2>
          </div>
          <button className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors">
            View All Tools
          </button>
        </motion.div>

        <div className="grid grid-cols-2 gap-4">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              onHoverStart={() => setHoveredTool(tool.id)}
              onHoverEnd={() => setHoveredTool(null)}
              whileHover={{ y: -5 }}
            >
              {/* Image Container */}
              <div className="relative h-40 bg-gradient-to-br from-green-50 to-blue-50">
                <img 
                  src={tool.image} 
                  alt={tool.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Animated Icon Overlay */}
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredTool === tool.id ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <tool.icon className="w-8 h-8 text-green-600" />
                  </motion.div>
                </motion.div>
                
                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full text-gray-700">
                  {tool.category}
                </div>
                
                {/* Discount Badge */}
                {tool.originalPrice > tool.price && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((tool.originalPrice - tool.price) / tool.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {tool.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{tool.rating}</span>
                  <span className="text-xs text-gray-400">({tool.reviews})</span>
                </div>
                
                {/* Features */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {tool.features.slice(0, 2).map((feature, idx) => (
                    <span 
                      key={idx}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-green-600">₹{tool.price}</span>
                  {tool.originalPrice > tool.price && (
                    <span className="text-sm text-gray-400 line-through">₹{tool.originalPrice}</span>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                <motion.button
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(tool)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View More Button */}
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm px-6 py-3 rounded-lg transition-all duration-200">
            Explore More Tools
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
} 