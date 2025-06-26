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
  const { cart, addToCart, removeFromCart } = useCart()
  const { isInWishlist } = useWishlist()
  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<NewProduct | null>(null)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)

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

  const isAnyModalOpen = !!showDrawer || !!showModal || !!selectedProduct || !!showCartSuccess;

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
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
        </div>
      )}

      {/* Cart Success Message */}
      {showCartSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg border border-green-200"
        >
          ✓ Added "{showCartSuccess}" to cart!
        </motion.div>
      )}

      {/* Add to Cart Toast */}
      <AnimatePresence>
        {cart.length > 0 && !isAnyModalOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-4 right-4 mb-40 flex items-center gap-2 bg-green-100 text-green-900 rounded-lg px-4 py-3 shadow-lg z-[60] cursor-pointer transition-all duration-300 border border-green-200"
            onClick={() => setShowDrawer(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-semibold">View Cart ({cart.reduce((sum, i) => sum + i.qty, 0)})</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Drawer */}
      <AnimatePresence>
        {showDrawer && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 bottom-0 z-[70] bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col p-4">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-lg text-gray-900">Your Cart</span>
                <motion.button 
                  className="text-gray-400 hover:text-gray-700 text-2xl p-1 rounded-full hover:bg-gray-100"
                  onClick={() => setShowDrawer(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  ×
                </motion.button>
              </div>
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  Your cart is empty.
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {cart.map((item, index) => (
                    <motion.div 
                      key={item.name} 
                      className="flex justify-between items-center p-3 border-b border-gray-100 rounded-lg hover:bg-gray-50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <span className="text-sm font-medium text-gray-800">{item.name}</span>
                          <div className="text-sm text-green-600 font-semibold">₹{item.price}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.button 
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-200"
                          onClick={() => handleQty(item.name, -1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          -
                        </motion.button>
                        <span className="text-base font-semibold text-gray-800 min-w-[20px] text-center">{item.qty}</span>
                        <motion.button 
                          className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-200"
                          onClick={() => handleQty(item.name, 1)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          +
                        </motion.button>
                        <span className="ml-2 text-green-700 font-semibold">₹{item.price * item.qty}</span>
                        <motion.button 
                          className="ml-2 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                          onClick={() => removeFromCart(item.name)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
              {cart.length > 0 && (
                <motion.div 
                  className="mt-6 border-t pt-4 flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>
                  <motion.button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Proceed to Checkout
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 