'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Heart, TrendingUp } from 'lucide-react'
import { useCart } from '../context/CartContext'

const trendingPlants = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    badge: 'Trending',
    badgeColor: 'bg-red-500'
  },
  {
    id: 2,
    name: 'Fiddle Leaf Fig',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 699,
    originalPrice: 999,
    rating: 4.6,
    reviews: 189,
    badge: 'Popular',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 3,
    name: 'Snake Plant',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 456,
    badge: 'Best Seller',
    badgeColor: 'bg-green-500'
  },
  {
    id: 4,
    name: 'Peace Lily',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 549,
    originalPrice: 799,
    rating: 4.7,
    reviews: 167,
    badge: 'New',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 5,
    name: 'ZZ Plant',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 449,
    originalPrice: 649,
    rating: 4.5,
    reviews: 298,
    badge: 'Low Maintenance',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 6,
    name: 'Pothos Golden',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 449,
    rating: 4.8,
    reviews: 312,
    badge: 'Fast Growing',
    badgeColor: 'bg-teal-500'
  }
]

export default function TrendingPlants() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const { addToCart } = useCart()

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleAddToCart = (plant: typeof trendingPlants[0]) => {
    addToCart({
      name: plant.name,
      image: plant.image,
      price: plant.price,
      qty: 1
    })
    
    setToastMessage(`${plant.name} added to cart!`)
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
            <TrendingUp className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-semibold text-gray-900">Trending Plants</h2>
          </div>
          <button className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors">
            View All
          </button>
        </motion.div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 pb-4 scrollbar-none w-full">
          {trendingPlants.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white rounded-2xl shadow-xl border border-gray-100 p-3 flex flex-col items-center min-w-[140px] max-w-[160px] md:min-w-[170px] md:max-w-[200px] mx-auto snap-start transition-all duration-200 hover:shadow-2xl hover:scale-105"
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                <span className={`${plant.badgeColor} text-white text-[11px] px-2 py-0.5 rounded-full font-semibold shadow`}>{plant.badge}</span>
                {plant.originalPrice > plant.price && (
                  <span className="bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full font-semibold shadow">{Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)}% OFF</span>
                )}
              </div>
              {/* Heart Icon */}
              <button className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:scale-110 transition z-10">
                <Heart className={`w-4 h-4 ${wishlist.includes(plant.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
              {/* Product Image */}
              <div className="w-20 h-20 rounded-xl bg-gray-50 flex items-center justify-center shadow-md -mt-8 mb-2 border border-gray-100 overflow-hidden">
                <img src={plant.image} alt={plant.name} className="object-contain w-16 h-16" />
              </div>
              {/* Product Name */}
              <div className="text-xs font-semibold text-gray-900 text-center mb-1 tracking-wide line-clamp-2">{plant.name}</div>
              {/* Rating */}
              <div className="flex items-center text-[11px] text-gray-500 mb-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                {plant.rating} <span className="ml-1 text-gray-400">({plant.reviews})</span>
              </div>
              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-600 font-bold text-base">₹{plant.price}</span>
                {plant.originalPrice > plant.price && (
                  <span className="text-xs text-gray-400 line-through">₹{plant.originalPrice}</span>
                )}
              </div>
              {/* Add to Cart Button */}
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-semibold py-2 rounded-2xl shadow flex items-center justify-center gap-2 transition-all duration-200 mt-auto"
                onClick={() => handleAddToCart(plant)}>
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
} 