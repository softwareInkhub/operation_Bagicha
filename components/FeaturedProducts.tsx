'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Star, Heart } from 'lucide-react'

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
  const [favorites, setFavorites] = useState<number[]>([])

  const toggleFavorite = (productId: number) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
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
                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      favorites.includes(product.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400'
                    }`} 
                  />
                </button>

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
                  <button className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
} 