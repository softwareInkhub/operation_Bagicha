import { useState } from 'react'
import { ShoppingCart, Trash2, Star, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

const bestsellers = [
  { title: 'Indoor Plants', icon: '🪴', items: [
    { name: 'Areca Palm', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 299, rating: 4.5, reviews: 128 },
    { name: 'Snake Plant', image: 'https://cdn-icons-png.flaticon.com/512/766/766083.png', price: 199, rating: 4.8, reviews: 89 },
    { name: 'Peace Lily', image: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', price: 349, rating: 4.6, reviews: 156 },
    { name: 'ZZ Plant', image: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', price: 249, rating: 4.7, reviews: 203 },
  ] },
  { title: 'Flowering Plants', icon: '🌸', items: [
    { name: 'Rose', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 399, rating: 4.9, reviews: 234 },
    { name: 'Jasmine', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 299, rating: 4.4, reviews: 167 },
    { name: 'Hibiscus', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 199, rating: 4.3, reviews: 98 },
    { name: 'Bougainvillea', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 449, rating: 4.6, reviews: 145 },
  ] },
  { title: 'Pots & Gamlas', icon: '🏺', items: [
    { name: 'Clay Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 149, rating: 4.2, reviews: 78 },
    { name: 'Plastic Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 99, rating: 4.0, reviews: 56 },
    { name: 'Ceramic Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 299, rating: 4.5, reviews: 123 },
    { name: 'Hanging Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 199, rating: 4.3, reviews: 87 },
  ] },
  { title: 'Soil & Fertilizer', icon: '🪨', items: [
    { name: 'Potting Mix', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 199, rating: 4.7, reviews: 189 },
    { name: 'Vermicompost', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 149, rating: 4.8, reviews: 234 },
    { name: 'Cocopeat', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 99, rating: 4.4, reviews: 156 },
    { name: 'Bone Meal', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 179, rating: 4.6, reviews: 98 },
  ] },
  { title: 'Seeds', icon: '🌾', items: [
    { name: 'Tomato Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 49, rating: 4.5, reviews: 267 },
    { name: 'Chili Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 39, rating: 4.3, reviews: 189 },
    { name: 'Marigold Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 29, rating: 4.7, reviews: 145 },
    { name: 'Basil Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 59, rating: 4.6, reviews: 98 },
  ] },
  { title: 'Gardening Tools', icon: '🛠️', items: [
    { name: 'Pruner', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 399, rating: 4.8, reviews: 178 },
    { name: 'Trowel', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 199, rating: 4.4, reviews: 123 },
    { name: 'Gloves', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 149, rating: 4.6, reviews: 234 },
    { name: 'Watering Can', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 299, rating: 4.5, reviews: 167 },
  ] },
]

export default function BestsellerSection() {
  const [open, setOpen] = useState<string | null>(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const { cart, addToCart, removeFromCart } = useCart()

  // Add to cart with quantity and price
  const handleAddToCart = (name: string, image: string, price: number) => {
    addToCart({
      name,
      image,
      price,
      qty: 1
    })
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
  const selected = bestsellers.find(b => b.title === open)

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
        🌟 Bestsellers
      </motion.h2>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-0 px-4 scrollbar-none justify-center">
        {Array.from({ length: Math.ceil(bestsellers.length / 2) }).map((_, slideIdx) => (
          <div
            key={slideIdx}
            className="min-w-full max-w-full snap-center flex justify-center"
          >
            <div className="grid grid-cols-2 gap-4 w-fit">
              {bestsellers.slice(slideIdx * 2, slideIdx * 2 + 2).map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white shadow-sm rounded-xl p-3 flex flex-col items-center hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
                  onClick={() => setOpen(item.title)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                    {item.items.slice(0, 4).map((prod, idx) => (
                      <img
                        key={prod.name}
                        src={prod.image}
                        alt={prod.name}
                        className="w-12 h-12 object-contain rounded bg-gray-50 border border-gray-100"
                      />
                    ))}
                  </div>
                  {/* +X more badge */}
                  <div className="text-xs text-gray-500 font-medium mb-1">+{item.items.length} more</div>
                  {/* Category name */}
                  <div className="text-sm font-semibold text-gray-800 text-center leading-tight">{item.title}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Modal for showing more options */}
      <AnimatePresence>
      {open && selected && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 w-80 max-w-full relative max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <motion.button 
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl p-1 rounded-full hover:bg-gray-100"
                onClick={() => setOpen(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                ×
              </motion.button>
              
              <motion.h3 
                className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
              <span>{selected.icon}</span>
              {selected.title}
              </motion.h3>
              
            <div className="grid grid-cols-2 gap-4">
                {selected.items.map((opt, idx) => (
                  <motion.div 
                    key={opt.name} 
                    className="flex flex-col items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <img src={opt.image} alt={opt.name} className="w-14 h-14 object-cover rounded mb-2" />
                  <span className="text-xs font-medium text-gray-800 text-center mb-1">{opt.name}</span>
                    
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs text-gray-600">{opt.rating}</span>
                      <span className="text-xs text-gray-400">({opt.reviews})</span>
                    </div>
                    
                    <div className="text-sm font-bold text-green-600 mb-2">₹{opt.price}</div>
                    
                    <motion.button
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-1"
                      onClick={() => handleAddToCart(opt.name, opt.image, opt.price)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                    </motion.button>
                  </motion.div>
              ))}
            </div>
            </motion.div>
          </motion.div>
      )}
      </AnimatePresence>
      
      {/* Add to Cart Toast */}
      <AnimatePresence>
        {cart.length > 0 && !showDrawer && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-100 text-green-900 rounded-lg px-4 py-3 shadow-lg z-50 cursor-pointer transition-all duration-300 border border-green-200"
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
            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto"
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
    </motion.section>
  )
} 