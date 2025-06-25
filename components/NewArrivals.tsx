'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Heart, ArrowRight, Clock, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'
import ProductDetails from './ProductDetails'

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
  const [selectedProduct, setSelectedProduct] = useState<NewProduct | null>(null)

  const handleAddToCart = (product: NewProduct) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    })
  }

  const handleProductClick = (product: NewProduct) => {
    setSelectedProduct(product)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
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
                  className="card card-hover group cursor-pointer"
                  onClick={() => handleProductClick(product)}
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
                    <div onClick={(e) => e.stopPropagation()}>
                      <WishlistButton 
                        product={product} 
                        className="absolute top-6 right-1"
                        size="sm"
                      />
                    </div>
                    
                    {/* Discount Badge */}
                    {product.originalPrice && product.originalPrice > product.price && (
                      <div className="absolute bottom-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-bold text-green-600">₹{product.price}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Add to Cart Button */}
                    <motion.button
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleAddToCart(product)
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ShoppingCart className="w-3 h-3" />
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
              className="inline-flex items-center gap-2 bg-white border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors"
              onClick={handleViewAll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-md w-full relative my-8 max-h-[90vh] max-w-[95vw] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
          </div>
        </div>
      )}
    </>
  )
} 