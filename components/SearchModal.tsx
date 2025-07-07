'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, Star, ShoppingCart } from 'lucide-react'
import { getCategories, searchProducts, getRecentSearches, getTrendingSearches, addRecentSearch } from '@/lib/firebase'
import PlaceholderImage from './PlaceholderImage'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SearchResult {
  id: string
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

interface RecentSearch {
  id: string
  term: string
  timestamp: any
}

interface TrendingSearch {
  id: string
  term: string
  count: number
  trend: 'up' | 'down' | 'stable'
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([])
  const [searchDataLoading, setSearchDataLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus()
      setSearchQuery('')
      setShowResults(false)
      if (categories.length === 0) {
        loadCategories()
      }
      if (recentSearches.length === 0) {
        loadSearchData()
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

  const loadSearchData = async () => {
    try {
      setSearchDataLoading(true)
      const [recentData, trendingData] = await Promise.all([
        getRecentSearches(),
        getTrendingSearches()
      ])
      
      // Sort recent searches by timestamp (most recent first)
      const sortedRecent = recentData.sort((a: any, b: any) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp)
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp)
        return bTime.getTime() - aTime.getTime()
      }).slice(0, 5) // Show only 5 most recent
      
      // Sort trending searches by count (highest first)
      const sortedTrending = trendingData.sort((a: any, b: any) => b.count - a.count).slice(0, 5)
      
      setRecentSearches(sortedRecent as RecentSearch[])
      setTrendingSearches(sortedTrending as TrendingSearch[])
    } catch (error) {
      console.error('Error loading search data:', error)
      // Fallback data
      setRecentSearches([
        { id: '1', term: 'monstera plant', timestamp: new Date() },
        { id: '2', term: 'gardening tools', timestamp: new Date() },
        { id: '3', term: 'organic soil', timestamp: new Date() }
      ])
      setTrendingSearches([
        { id: '1', term: 'succulents', count: 156, trend: 'up' },
        { id: '2', term: 'air purifying plants', count: 134, trend: 'up' },
        { id: '3', term: 'herb garden', count: 98, trend: 'up' }
      ])
    } finally {
      setSearchDataLoading(false)
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

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    setIsSearching(true)
    
    try {
      const results = await searchProducts(query)
      setSearchResults(results as SearchResult[])
      
      // Add to recent searches
      if (query.trim()) {
        await addRecentSearch(query.trim())
        // Reload recent searches
        await loadSearchData()
      }
    } catch (error) {
      console.error('Error searching:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
      setShowResults(true)
    }
  }

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result)
    onClose()
  }

  const handleSearchSuggestionClick = (term: string) => {
    setSearchQuery(term)
    handleSearch(term)
  }

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Just now'
    
    const time = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

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
              {isSearching ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Searching...</p>
                </div>
              ) : showResults ? (
                // Search Results
                <div className="p-4">
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Search Results ({searchResults.length})
                    </h3>
                  </div>
                  
                  {searchResults.length > 0 ? (
                    <div className="space-y-3">
                      {searchResults.map((result) => (
                        <motion.div
                          key={result.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleResultClick(result)}
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {result.image ? (
                              <img 
                                src={result.image} 
                                alt={result.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <PlaceholderImage 
                                width={48}
                                height={48}
                                text={result.name.charAt(0)}
                                className="w-full h-full"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm truncate">{result.name}</h4>
                            <p className="text-xs text-gray-500">{result.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-xs text-gray-600">{result.rating}</span>
                              </div>
                              <span className="text-xs text-gray-400">({result.reviews})</span>
                              <span className="text-sm font-medium text-green-600">₹{result.price}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No results found for "{searchQuery}"</p>
                      <p className="text-sm text-gray-400 mt-2">Try different keywords</p>
                    </div>
                  )}
                </div>
              ) : (
                // Default Search View
                <div className="p-4">
                  {/* Categories */}
                  {!categoriesLoading && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3">Browse Categories</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.slice(0, 6).map((category) => (
                          <motion.button
                            key={category.id || category.name}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors"
                            onClick={() => handleSearchSuggestionClick(category.name)}
                          >
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-700">{category.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Searches */}
                  {!searchDataLoading && recentSearches.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Recent Searches
                      </h3>
                      <div className="space-y-2">
                        {recentSearches.map((search) => (
                          <motion.button
                            key={search.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => handleSearchSuggestionClick(search.term)}
                          >
                            <span className="text-sm text-gray-700">{search.term}</span>
                            <span className="text-xs text-gray-400">{formatTimeAgo(search.timestamp)}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  {!searchDataLoading && trendingSearches.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trending Searches
                      </h3>
                      <div className="space-y-2">
                        {trendingSearches.map((trend, index) => (
                          <motion.button
                            key={trend.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => handleSearchSuggestionClick(trend.term)}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-400 w-4">#{index + 1}</span>
                              <span className="text-sm text-gray-700">{trend.term}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-400">{trend.count}</span>
                              <span className={`text-xs ${
                                trend.trend === 'up' ? 'text-green-500' : 
                                trend.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                              }`}>
                                {trend.trend === 'up' ? '↗' : trend.trend === 'down' ? '↘' : '→'}
                              </span>
                            </div>
                          </motion.button>
                        ))}
                      </div>
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