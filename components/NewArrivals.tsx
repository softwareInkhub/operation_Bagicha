'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Heart, ArrowRight, Clock, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'

interface NewProduct {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  daysSinceAdded: number
  features: string[]
  description: string
}

const newProducts: NewProduct[] = [
  {
    id: 1,
    name: 'Rare Variegated Monstera',
    category: 'Indoor Plants',
    price: 2499,
    originalPrice: 3499,
    rating: 4.9,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=400&fit=crop',
    daysSinceAdded: 2,
    features: ['Rare Variety', 'Air Purifying', 'Statement Piece'],
    description: 'Stunning variegated leaves with unique patterns. A true collector\'s item.'
  },
  {
    id: 2,
    name: 'Smart Garden Kit',
    category: 'Garden Tech',
    price: 1899,
    originalPrice: 2499,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop',
    daysSinceAdded: 5,
    features: ['Smart Monitoring', 'Auto Watering', 'LED Grow Lights'],
    description: 'Complete smart gardening solution with app control and monitoring.'
  },
  {
    id: 3,
    name: 'Organic Herb Collection',
    category: 'Herbs',
    price: 399,
    originalPrice: 599,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=400&fit=crop',
    daysSinceAdded: 1,
    features: ['Organic', 'Kitchen Ready', 'Fast Growing'],
    description: 'Fresh organic herbs perfect for your kitchen garden.'
  },
  {
    id: 4,
    name: 'Premium Bonsai Set',
    category: 'Bonsai',
    price: 899,
    originalPrice: 1299,
    rating: 4.6,
    reviews: 78,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop',
    daysSinceAdded: 3,
    features: ['Aged Tree', 'Care Guide', 'Traditional Pot'],
    description: 'Beautiful aged bonsai with traditional styling and care instructions.'
  },
  {
    id: 5,
    name: 'Vertical Garden System',
    category: 'Garden Systems',
    price: 1599,
    originalPrice: 2199,
    rating: 4.5,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop',
    daysSinceAdded: 7,
    features: ['Space Saving', 'Modular Design', 'Easy Assembly'],
    description: 'Perfect for small spaces with modular vertical gardening system.'
  },
  {
    id: 6,
    name: 'Rare Succulent Pack',
    category: 'Succulents',
    price: 299,
    originalPrice: 449,
    rating: 4.7,
    reviews: 167,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=400&h=400&fit=crop',
    daysSinceAdded: 4,
    features: ['Rare Varieties', 'Low Maintenance', 'Collector\'s Pack'],
    description: 'Exclusive collection of rare and beautiful succulents.'
  }
]

export default function NewArrivals() {
  const { addToCart } = useCart()
  const { isInWishlist } = useWishlist()
  const [showModal, setShowModal] = useState(false)

  const handleAddToCart = (product: NewProduct) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    })
  }

  const handleViewAll = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const getTimeAgo = (days: number) => {
    if (days === 1) return 'Added today'
    if (days === 2) return 'Added yesterday'
    return `Added ${days} days ago`
  }

  return (
    <>
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="mobile-container">
          {/* Header */}
          <motion.div 
            className="text-center mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] font-medium mb-2">
              <Clock className="w-2 h-2" />
              Fresh Arrivals
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">New Arrivals</h2>
            <p className="text-gray-600 max-w-md mx-auto text-xs">
              Discover our latest additions - from rare plants to innovative gardening solutions
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <AnimatePresence>
              {newProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card card-hover group"
                >
                  {/* Product Image */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    {/* NEW Badge */}
                    <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                      NEW
                    </div>
                    
                    {/* Time Badge */}
                    <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[9px] px-1.5 py-0.5 rounded-full">
                      {getTimeAgo(product.daysSinceAdded)}
                    </div>
                    
                    {/* Wishlist Button */}
                    <WishlistButton 
                      product={product} 
                      className="absolute top-6 right-1"
                      size="sm"
                    />
                    
                    {/* Discount Badge */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute bottom-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Content */}
                  <div className="p-2">
                    {/* Category */}
                    <div className="text-[10px] text-green-600 font-medium mb-0.5">
                      {product.category}
                    </div>
                    
                    {/* Product Name */}
                    <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] font-medium text-gray-900">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-500">({product.reviews} reviews)</span>
                    </div>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-0.5 mb-1">
                      {product.features.map((feature, idx) => (
                        <span 
                          key={idx}
                          className="text-[9px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-base font-bold text-green-600">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[9px] text-gray-400 line-through">₹{product.originalPrice}</span>
                      )}
                    </div>
                    
                    {/* Add to Cart Button */}
                    <motion.button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-1.5 rounded-md transition-all duration-300 flex items-center justify-center gap-1.5 group-hover:shadow-lg text-xs"
                      onClick={() => handleAddToCart(product)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View All Button */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <motion.button
              className="btn-outline inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleViewAll}
            >
              View All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">All New Arrivals</h2>
                    <p className="text-sm text-gray-600">{newProducts.length} fresh products</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {newProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Product Image */}
                      <div className="relative h-24 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        
                        {/* NEW Badge */}
                        <div className="absolute top-1 left-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                          NEW
                        </div>
                        
                        {/* Time Badge */}
                        <div className="absolute top-1 right-1 bg-black/70 backdrop-blur-sm text-white text-[8px] px-1 py-0.5 rounded-full">
                          {getTimeAgo(product.daysSinceAdded)}
                        </div>
                        
                        {/* Wishlist Button */}
                        <WishlistButton 
                          product={product} 
                          className="absolute top-4 right-1"
                          size="sm"
                        />
                        
                        {/* Discount Badge */}
                        {product.originalPrice && product.originalPrice > product.price && (
                          <div className="absolute bottom-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded-full">
                            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>

                      {/* Product Content */}
                      <div className="p-2">
                        {/* Category */}
                        <div className="text-[8px] text-green-600 font-medium mb-0.5">
                          {product.category}
                        </div>
                        
                        {/* Product Name */}
                        <h3 className="font-semibold text-gray-900 text-xs mb-0.5 line-clamp-2 leading-tight">
                          {product.name}
                        </h3>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
                            <span className="text-[8px] font-medium text-gray-900">{product.rating}</span>
                          </div>
                          <span className="text-[8px] text-gray-500">({product.reviews})</span>
                        </div>
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-0.5 mb-1">
                          {product.features.slice(0, 2).map((feature, idx) => (
                            <span 
                              key={idx}
                              className="text-[7px] bg-gray-100 text-gray-600 px-1 py-0.5 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm font-bold text-green-600">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <span className="text-[8px] text-gray-400 line-through">₹{product.originalPrice}</span>
                          )}
                        </div>
                        
                        {/* Add to Cart Button */}
                        <motion.button
                          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-1 rounded text-[10px] transition-all duration-300 flex items-center justify-center gap-1 group-hover:shadow-md"
                          onClick={() => handleAddToCart(product)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Add to Cart
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 