'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Heart, ArrowRight, Clock, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'
import ProductDetails from './ProductDetails'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/lib/firebase'

interface NewProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  daysSinceAdded?: number
  features: string[]
  description: string
  createdAt?: any
}

export default function NewArrivals() {
  const { cart, addToCart, removeFromCart } = useCart()
  const { isInWishlist } = useWishlist()
  const [newProducts, setNewProducts] = useState<NewProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<NewProduct | null>(null)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadNewArrivals()
  }, [])

  const loadNewArrivals = async () => {
    try {
      const allProducts = await getProducts() as NewProduct[]
      
      // Sort by creation date (if available) or just take the latest 6 products
      const sortedProducts = allProducts
        .map(product => ({
          ...product,
          daysSinceAdded: getDaysSinceAdded(product.createdAt)
        }))
        .sort((a, b) => {
          // Sort by createdAt if available, otherwise by rating
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt.seconds * 1000).getTime() - new Date(a.createdAt.seconds * 1000).getTime()
          }
          return (b.rating || 0) - (a.rating || 0)
        })
        .slice(0, 6) // Take latest 6 products
      
      setNewProducts(sortedProducts)
    } catch (error) {
      console.error('Error loading new arrivals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysSinceAdded = (createdAt: any) => {
    if (!createdAt) return Math.floor(Math.random() * 7) + 1 // Random 1-7 days if no date
    
    const createdDate = new Date(createdAt.seconds * 1000)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const handleAddToCart = (product: NewProduct) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    })
    setShowCartSuccess(product.name)
    setTimeout(() => setShowCartSuccess(null), 2000)
  }

  const handleQty = (name: string, delta: number) => {
    const item = cart.find(i => i.name === name)
    if (item) {
      const newQty = Math.max(1, item.qty + delta)
      if (newQty === 1) {
        removeFromCart(name)
      } else {
        addToCart({ ...item, qty: newQty })
      }
    }
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

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

  const isAnyModalOpen = !!showDrawer || !!showModal || !!selectedProduct

  if (loading) {
    return (
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mobile-container">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] font-medium mb-2">
              <Clock className="w-2 h-2" />
              Fresh Arrivals
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">New Arrivals</h2>
            <p className="text-gray-600 max-w-md mx-auto text-xs">
              Discover our latest additions - from rare plants to innovative gardening solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-pulse"
              >
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  if (newProducts.length === 0) {
    return (
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="mobile-container">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] font-medium mb-2">
              <Clock className="w-2 h-2" />
              Fresh Arrivals
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">New Arrivals</h2>
          </div>
          
          <div className="text-center py-8">
            <p className="text-gray-500">No new arrivals available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin.</p>
          </div>
        </div>
      </motion.section>
    )
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
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden border border-gray-100 group transition-all duration-300"
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square overflow-hidden cursor-pointer"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image || 'https://via.placeholder.com/400x400?text=No+Image'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* New Badge */}
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-[10px] font-medium">
                      New
                    </div>
                    
                    {/* Days Since Added */}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-[10px]">
                      {getTimeAgo(product.daysSinceAdded || 1)}
                    </div>
                    
                    {/* Wishlist Button */}
                    <WishlistButton product={product} />
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <div className="text-[10px] text-green-600 font-medium mb-1">{product.category}</div>
                    <h3 
                      className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 cursor-pointer hover:text-green-600 transition-colors"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    
                    {/* Features */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {product.features?.slice(0, 2).map((feature, idx) => (
                        <span key={idx} className="text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {feature}
                        </span>
                      ))}
                    </div>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-gray-600 ml-1">{product.rating}</span>
                      </div>
                      <span className="text-[10px] text-gray-400">({product.reviews} reviews)</span>
                    </div>
                    
                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-[10px] text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      
                      {/* Add to Cart Button */}
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ShoppingCart className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View All Button */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button
              onClick={handleViewAll}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              View All New Arrivals
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Success Toast */}
      <AnimatePresence>
        {showCartSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            Added {showCartSuccess} to cart!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
        </div>
      )}

      {/* View All Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">All New Arrivals</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {newProducts.map((product) => (
                  <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x200?text=No+Image'}
                      alt={product.name}
                      className="w-full aspect-square object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-sm mb-1">{product.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{product.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">₹{product.price}</span>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs transition-colors"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 