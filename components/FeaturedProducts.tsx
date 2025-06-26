'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Star, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'

const products = [
  {
    id: 1,
    name: 'Fresh Tomatoes',
    price: 40,
    originalPrice: 60,
    rating: 4.5,
    reviews: 128,
    image: '🍅',
    category: 'Vegetables',
    discount: 33
  },
  {
    id: 2,
    name: 'Organic Bananas',
    price: 50,
    originalPrice: 50,
    rating: 4.8,
    reviews: 89,
    image: '🍌',
    category: 'Fruits',
    discount: 0
  },
  {
    id: 3,
    name: 'Fresh Milk',
    price: 65,
    originalPrice: 75,
    rating: 4.6,
    reviews: 156,
    image: '🥛',
    category: 'Dairy',
    discount: 13
  },
  {
    id: 4,
    name: 'Whole Wheat Bread',
    price: 35,
    originalPrice: 45,
    rating: 4.3,
    reviews: 67,
    image: '🍞',
    category: 'Bread',
    discount: 22
  },
  {
    id: 5,
    name: 'Fresh Onions',
    price: 30,
    originalPrice: 40,
    rating: 4.4,
    reviews: 94,
    image: '🧅',
    category: 'Vegetables',
    discount: 25
  },
  {
    id: 6,
    name: 'Sweet Potatoes',
    price: 45,
    originalPrice: 55,
    rating: 4.7,
    reviews: 73,
    image: '🍠',
    category: 'Vegetables',
    discount: 18
  }
]

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)

  const handleAddToCart = (product: typeof products[0]) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    })
    
    // Show success message
    setShowCartSuccess(product.name)
    setTimeout(() => setShowCartSuccess(null), 2000)
  }

  return (
    <section className="py-8 bg-white">
      <div className="mobile-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
          <button className="text-primary-600 font-medium text-sm hover:text-primary-700">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group"
            >
              <div className="card p-4 relative">
                {/* Wishlist Button */}
                <WishlistButton 
                  product={product} 
                  className="absolute top-3 right-3"
                  size="sm"
                />

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    {product.discount}% OFF
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors">
                  <span className="text-4xl">{product.image}</span>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <span>{product.category}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-800">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
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
    </section>
  )
} 