'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useState } from 'react'
import WishlistButton from './WishlistButton'

interface ProductItem {
  id?: string
  name: string
  image: string
  price: number
  rating: number
  reviews: number
  description?: string
  features?: string[]
  wishlistButton?: React.ReactNode
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  icon: string
  items: ProductItem[]
  onProductClick?: (product: ProductItem) => void
}

export default function ProductModal({ isOpen, onClose, title, icon, items, onProductClick }: ProductModalProps) {
  const { cart, addToCart, removeFromCart } = useCart()
  const [showDrawer, setShowDrawer] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)

  const handleAddToCart = (name: string, image: string, price: number) => {
    addToCart({
      name,
      image,
      price,
      qty: 1
    })
    
    // Show success message
    setShowCartSuccess(name)
    setTimeout(() => setShowCartSuccess(null), 2000)
  }
  
  const handleRemoveFromCart = (name: string) => {
    removeFromCart(name)
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

  return (
    <>
      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg w-80 max-w-full relative max-h-[80vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.button 
                className="absolute top-3 right-3 text-white hover:text-gray-200 w-8 h-8 rounded-full hover:bg-black/30 z-30 bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-lg border border-white/20 transition-all duration-200"
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
              
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 z-10">
              <motion.h3 
                  className="text-lg font-semibold text-gray-900 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span>{icon}</span>
                {title}
              </motion.h3>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              
              <div className="grid grid-cols-2 gap-1.5">
                {items.map((item, idx) => (
                  <motion.div 
                    key={item.name} 
                    className="bg-white border border-gray-200 rounded-lg p-2 hover:border-green-300 hover:shadow-md transition-all duration-200 relative cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onProductClick && onProductClick(item)}
                  >
                    <div className="absolute top-1 right-1 z-10">
                      <WishlistButton 
                        product={{ 
                          id: item.id || item.name, 
                          name: item.name, 
                          price: item.price, 
                          image: item.image 
                        }} 
                        size="sm"
                        className="w-6 h-6 bg-white/90 hover:bg-white shadow-sm hover:shadow-md border border-gray-100"
                      />
                    </div>
                    
                    <div className="w-full h-20 bg-gray-50 rounded mb-2 overflow-hidden flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs font-medium text-gray-800 block mb-1 line-clamp-2">{item.name}</span>
                    
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] text-gray-600">{item.rating}</span>
                      </div>
                      <div className="text-xs font-bold text-green-600">₹{item.price}</div>
                    </div>
                    
                    <motion.button
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-1.5 rounded transition-all duration-200 flex items-center justify-center gap-1"
                      onClick={e => { e.stopPropagation(); handleAddToCart(item.name, item.image, item.price); }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </motion.button>
                  </motion.div>
                ))}
              </div>
              </div>
            </motion.div>
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
                          onClick={() => handleRemoveFromCart(item.name)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
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
    </>
  )
} 