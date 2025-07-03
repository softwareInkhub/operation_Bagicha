'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, X, Clock, TrendingUp, Filter, Star, 
  ShoppingCart, Heart, Eye, ArrowRight 
} from 'lucide-react'
import { getCategories } from '@/lib/firebase'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
  badgeColor?: string
  inStock: boolean
}

const searchResults: SearchResult[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=100&h=100&fit=crop',
    badge: 'Trending',
    badgeColor: 'bg-red-500',
    inStock: true
  },
  {
    id: 2,
    name: 'Snake Plant',
    category: 'Indoor Plants',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=100&h=100&fit=crop',
    badge: 'Best Seller',
    badgeColor: 'bg-green-500',
    inStock: true
  },
  {
    id: 3,
    name: 'Professional Pruner',
    category: 'Tools',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=100&h=100&fit=crop',
    badge: 'Premium',
    badgeColor: 'bg-purple-500',
    inStock: true
  }
]

const recentSearches = [
  'monstera plant',
  'gardening tools',
  'organic soil',
  'flower seeds',
  'plant pots'
]

const trendingSearches = [
  'succulents',
  'air purifying plants',
  'herb garden',
  'bonsai trees',
  'vertical garden'
]

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
      setSearchQuery('')
      setShowResults(false)
      if (categories.length === 0) {
        loadCategories()
      }
    }
  }, [isOpen])

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to some default categories if Firebase fails
      setCategories([
        { name: 'Indoor Plants', icon: '🪴' },
        { name: 'Outdoor Plants', icon: '🌳' },
        { name: 'Gardening Tools', icon: '🛠️' },
        { name: 'Soil & Fertilizer', icon: '🪨' },
        { name: 'Pots & Planters', icon: '🏺' },
        { name: 'Seeds', icon: '🌾' },
        { name: 'Plant Care', icon: '🌿' }
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false)
      setShowResults(true)
    }, 500)
  }

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result)
    onClose()
  }

  const filteredResults = searchResults.filter(result =>
    result.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    result.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search for plants, tools, seeds..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      if (e.target.value.length > 0) {
                        handleSearch(e.target.value)
                      } else {
                        setShowResults(false)
                      }
                    }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  />
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setSearchQuery('')}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </motion.button>
              </div>
            </div>

            {/* Search Content */}
            <div className="max-h-[70vh] overflow-y-auto">
              {!showResults ? (
                <div className="p-6">
                  {/* Categories */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Browse Categories</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {categoriesLoading ? (
                        // Loading skeleton
                        [...Array(8)].map((_, index) => (
                          <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-xl animate-pulse">
                            <div className="w-20 h-4 bg-gray-200 rounded mb-2"></div>
                            <div className="w-16 h-3 bg-gray-200 rounded"></div>
                          </div>
                        ))
                      ) : (
                        categories.map((category, index) => (
                          <motion.button
                            key={category.id || category.name}
                            className="p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-green-200 rounded-xl text-left transition-all duration-200"
                            onClick={() => handleSearch(category.name)}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              {(category as any).image ? (
                                <div className="w-6 h-6 rounded-full overflow-hidden bg-green-100 flex items-center justify-center">
                                  <img
                                    src={(category as any).image}
                                    alt={category.name}
                                    className="w-full h-full object-cover rounded-full"
                                  />
                                </div>
                              ) : (
                                <span className="text-lg">{category.icon}</span>
                              )}
                              <div className="text-sm font-medium text-gray-900">{category.name}</div>
                            </div>
                            <div className="text-xs text-gray-500">Explore products</div>
                          </motion.button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Recent Searches */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Searches</h3>
                      <button className="text-sm text-green-600 hover:text-green-700">Clear All</button>
                    </div>
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <motion.button
                          key={search}
                          className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => handleSearch(search)}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{search}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Trending Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">Trending Searches</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trendingSearches.map((search, index) => (
                        <motion.button
                          key={search}
                          className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-full text-sm font-medium transition-colors"
                          onClick={() => handleSearch(search)}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {search}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  {/* Search Results */}
                  {isSearching ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-gray-600">Searching...</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Search Results for "{searchQuery}"
                        </h3>
                        <span className="text-sm text-gray-500">
                          {filteredResults.length} results found
                        </span>
                      </div>

                      {filteredResults.length > 0 ? (
                        <div className="space-y-4">
                          {filteredResults.map((result, index) => (
                            <motion.div
                              key={result.id}
                              className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer transition-colors"
                              onClick={() => handleResultClick(result)}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="relative w-16 h-16 flex-shrink-0">
                                <img 
                                  src={result.image} 
                                  alt={result.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                {result.badge && (
                                  <div className={`absolute -top-1 -left-1 ${result.badgeColor} text-white text-xs px-2 py-1 rounded-full`}>
                                    {result.badge}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 truncate">{result.name}</h4>
                                <p className="text-sm text-gray-500">{result.category}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-xs text-gray-600">{result.rating}</span>
                                    <span className="text-xs text-gray-400">({result.reviews})</span>
                                  </div>
                                  <span className="text-xs text-gray-400">•</span>
                                  <span className="text-xs text-gray-600">
                                    {result.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="font-semibold text-green-600">₹{result.price}</div>
                                {result.originalPrice && result.originalPrice > result.price && (
                                  <div className="text-sm text-gray-400 line-through">₹{result.originalPrice}</div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <Heart className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <ShoppingCart className="w-4 h-4 text-gray-400" />
                                </button>
                                <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                  <Eye className="w-4 h-4 text-gray-400" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                          <p className="text-gray-600 mb-4">Try adjusting your search terms</p>
                          <button
                            onClick={() => setShowResults(false)}
                            className="btn-outline"
                          >
                            Back to Search
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 