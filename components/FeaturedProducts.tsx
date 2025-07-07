'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Star, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'
import { useComponentConfig } from '@/lib/useComponentConfig'
import { getProducts } from '@/lib/firebase'
import PlaceholderImage from './PlaceholderImage'

interface FeaturedProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  category: string
  subcategory?: string
  badge?: string
  badgeColor?: string
  inStock: boolean
  features?: string[]
  description?: string
}

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)

  // Load admin configuration
  const { config } = useComponentConfig('featured-products', {
    showCategories: true,
    showPrices: true,
    showRatings: true,
    maxItems: 8,
    autoRotate: false,
    rotationInterval: 4000
  })

  useEffect(() => {
    loadFeaturedProducts()
  }, [])

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true)
      const allProducts = await getProducts() as FeaturedProduct[]
      
      // Filter to get featured plant products (high rating, in stock, with images)
      const featuredProducts = allProducts
        .filter((product: FeaturedProduct) => {
          // Must be a plant-related product
          const isPlantProduct = product.category?.toLowerCase().includes('plant') ||
                                product.category?.toLowerCase().includes('indoor') ||
                                product.category?.toLowerCase().includes('outdoor') ||
                                product.category?.toLowerCase().includes('flowering') ||
                                product.name?.toLowerCase().includes('plant') ||
                                product.name?.toLowerCase().includes('tree') ||
                                product.name?.toLowerCase().includes('flower')
          
          return isPlantProduct && 
                 product.inStock !== false && 
                 product.rating >= 4.0 &&
                 product.price > 0
        })
        .sort((a: FeaturedProduct, b: FeaturedProduct) => (b.rating || 0) - (a.rating || 0))
        .slice(0, config.maxItems)
        .map((product: FeaturedProduct) => ({
          ...product,
          badge: getFeaturedBadge(product),
          badgeColor: getBadgeColor(product)
        }))
      
      setProducts(featuredProducts)
    } catch (error) {
      console.error('Error loading featured products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const getFeaturedBadge = (product: FeaturedProduct) => {
    if (product.rating >= 4.8) return 'Top Rated'
    if (product.rating >= 4.5) return 'Featured'
    if (product.category?.includes('Air')) return 'Air Purifier'
    if (product.category?.includes('Lucky')) return 'Lucky'
    if (product.category?.includes('Medicinal')) return 'Medicinal'
    if (product.features?.includes('Pet Safe')) return 'Pet Friendly'
    if (product.originalPrice && product.originalPrice > product.price) return 'On Sale'
    return 'Popular'
  }

  const getBadgeColor = (product: FeaturedProduct) => {
    const badge = getFeaturedBadge(product)
    const colorMap: { [key: string]: string } = {
      'Top Rated': 'bg-green-500',
      'Featured': 'bg-blue-500',
      'Air Purifier': 'bg-cyan-500',
      'Lucky': 'bg-yellow-400',
      'Medicinal': 'bg-lime-500',
      'Pet Friendly': 'bg-pink-400',
      'On Sale': 'bg-red-500',
      'Popular': 'bg-purple-500'
    }
    return colorMap[badge] || 'bg-gray-500'
  }

  // Filter products based on maxItems setting
  const displayedProducts = products.slice(0, config.maxItems)

  // Auto-rotation effect
  useEffect(() => {
    if (config.autoRotate && displayedProducts.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % displayedProducts.length)
      }, config.rotationInterval)
      
      return () => clearInterval(interval)
    }
  }, [config.autoRotate, config.rotationInterval, displayedProducts.length])

  const handleAddToCart = (product: FeaturedProduct) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      category: product.category,
      description: product.description || ''
    })
    
    // Show success message
    setShowCartSuccess(product.name)
    setTimeout(() => setShowCartSuccess(null), 2000)
  }

  if (loading) {
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
            {[...Array(8)].map((_, index) => (
              <div key={index} className="card p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-8 bg-white">
        <div className="mobile-container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
            <button className="text-primary-600 font-medium text-sm hover:text-primary-700">
              View All
            </button>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Featured Products</h3>
            <p className="text-gray-600 mb-4">Add some high-rated plant products to see them here</p>
          </div>
        </div>
      </section>
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
          {displayedProducts.map((product, index) => (
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

                {/* Badge */}
                {product.badge && (
                  <div className={`absolute top-3 left-3 z-10 ${product.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                    {product.badge}
                  </div>
                )}

                {/* Product Image */}
                <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gray-100 transition-colors overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <PlaceholderImage 
                      width={200}
                      height={200}
                      text={product.name.charAt(0)}
                      className="w-full h-full"
                    />
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  {config.showCategories && (
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <span>{product.category}</span>
                      {product.subcategory && (
                        <>
                          <span>•</span>
                          <span>{product.subcategory}</span>
                        </>
                      )}
                    </div>
                  )}
                  
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {config.showRatings && (
                    <div className="flex items-center space-x-1">
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">({product.reviews})</span>
                    </div>
                  )}

                  {/* Price */}
                  {config.showPrices && (
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-800">₹{product.price}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  )}

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

        {/* Success Message */}
        <AnimatePresence>
          {showCartSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{showCartSuccess} added to cart!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
} 