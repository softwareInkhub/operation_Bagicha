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

        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
          {trendingPlants.map((plant, index) => (
            <motion.div
              key={plant.id}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[200px] snap-start bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              whileHover={{ y: -5 }}
            >
              {/* Image Container */}
              <div className="relative">
                <img 
                  src={plant.image} 
                  alt={plant.name} 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badge */}
                <div className={`absolute top-2 left-2 ${plant.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                  {plant.badge}
                </div>
                
                {/* Wishlist Button */}
                <motion.button
                  className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  onClick={() => toggleWishlist(plant.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart 
                    className={`w-4 h-4 ${wishlist.includes(plant.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                  />
                </motion.button>
                
                {/* Discount Badge */}
                {plant.originalPrice > plant.price && (
                  <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-1">
                  {plant.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{plant.rating}</span>
                  <span className="text-xs text-gray-400">({plant.reviews})</span>
                </div>
                
                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-green-600">₹{plant.price}</span>
                  {plant.originalPrice > plant.price && (
                    <span className="text-sm text-gray-400 line-through">₹{plant.originalPrice}</span>
                  )}
                </div>
                
                {/* Add to Cart Button */}
                <motion.button
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(plant)}
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
      </div>
    </motion.section>
  )
} 