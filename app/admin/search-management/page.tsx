'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiTrendingUp, FiClock, FiX, FiSave,
  FiArrowUp, FiArrowDown, FiMinus
} from 'react-icons/fi'
import { 
  getSearchSuggestions, 
  getRecentSearches, 
  getTrendingSearches,
  createSampleSearchData,
  db
} from '@/lib/firebase'
import { 
  addDoc, 
  collection, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore'

interface SearchSuggestion {
  id: string
  term: string
  type: 'product' | 'category'
  category: string
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

export default function SearchManagement() {
  const [activeTab, setActiveTab] = useState<'suggestions' | 'recent' | 'trending'>('suggestions')
  const [loading, setLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [trendingSearches, setTrendingSearches] = useState<TrendingSearch[]>([])
  
  // Form states
  const [showAddSuggestion, setShowAddSuggestion] = useState(false)
  const [showAddTrending, setShowAddTrending] = useState(false)
  const [editingSuggestion, setEditingSuggestion] = useState<SearchSuggestion | null>(null)
  const [editingTrending, setEditingTrending] = useState<TrendingSearch | null>(null)
  
  // Form data
  const [suggestionForm, setSuggestionForm] = useState({
    term: '',
    type: 'product' as 'product' | 'category',
    category: ''
  })
  
  const [trendingForm, setTrendingForm] = useState({
    term: '',
    count: 0,
    trend: 'stable' as 'up' | 'down' | 'stable'
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [suggestionsData, recentData, trendingData] = await Promise.all([
        getSearchSuggestions(),
        getRecentSearches(),
        getTrendingSearches()
      ])
      
      setSuggestions(suggestionsData as SearchSuggestion[])
      setRecentSearches(recentData as RecentSearch[])
      setTrendingSearches(trendingData as TrendingSearch[])
    } catch (error) {
      console.error('Error loading search data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSampleData = async () => {
    if (confirm('This will create sample search suggestions, recent searches, and trending searches. Continue?')) {
      try {
        setLoading(true)
        const success = await createSampleSearchData()
        if (success) {
          alert('Sample search data created successfully!')
          await loadData()
        } else {
          alert('Failed to create sample search data.')
        }
      } catch (error) {
        console.error('Error creating sample search data:', error)
        alert('Error creating sample search data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddSuggestion = async () => {
    if (!suggestionForm.term.trim()) {
      alert('Please enter a search term')
      return
    }

    try {
      await addDoc(collection(db, 'searchSuggestions'), {
        term: suggestionForm.term.trim(),
        type: suggestionForm.type,
        category: suggestionForm.category.trim()
      })
      
      setSuggestionForm({ term: '', type: 'product', category: '' })
      setShowAddSuggestion(false)
      await loadData()
    } catch (error) {
      console.error('Error adding suggestion:', error)
      alert('Error adding suggestion. Please try again.')
    }
  }

  const handleAddTrending = async () => {
    if (!trendingForm.term.trim()) {
      alert('Please enter a search term')
      return
    }

    try {
      await addDoc(collection(db, 'trendingSearches'), {
        term: trendingForm.term.trim(),
        count: trendingForm.count,
        trend: trendingForm.trend
      })
      
      setTrendingForm({ term: '', count: 0, trend: 'stable' })
      setShowAddTrending(false)
      await loadData()
    } catch (error) {
      console.error('Error adding trending search:', error)
      alert('Error adding trending search. Please try again.')
    }
  }

  const handleDeleteSuggestion = async (id: string) => {
    if (confirm('Are you sure you want to delete this suggestion?')) {
      try {
        await deleteDoc(doc(db, 'searchSuggestions', id))
        await loadData()
      } catch (error) {
        console.error('Error deleting suggestion:', error)
        alert('Error deleting suggestion. Please try again.')
      }
    }
  }

  const handleDeleteTrending = async (id: string) => {
    if (confirm('Are you sure you want to delete this trending search?')) {
      try {
        await deleteDoc(doc(db, 'trendingSearches', id))
        await loadData()
      } catch (error) {
        console.error('Error deleting trending search:', error)
        alert('Error deleting trending search. Please try again.')
      }
    }
  }

  const handleDeleteRecent = async (id: string) => {
    if (confirm('Are you sure you want to delete this recent search?')) {
      try {
        await deleteDoc(doc(db, 'recentSearches', id))
        await loadData()
      } catch (error) {
        console.error('Error deleting recent search:', error)
        alert('Error deleting recent search. Please try again.')
      }
    }
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

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <FiArrowUp className="text-green-500" />
      case 'down': return <FiArrowDown className="text-red-500" />
      default: return <FiMinus className="text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Search Management</h1>
          <p className="text-gray-600 mt-1">Manage search suggestions, recent searches, and trending searches</p>
        </div>
        <button
          onClick={handleCreateSampleData}
          className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiSearch size={20} />
          <span>Create Sample Data</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'suggestions' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiSearch className="inline mr-2" />
            Search Suggestions
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'recent' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiClock className="inline mr-2" />
            Recent Searches
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'trending' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiTrendingUp className="inline mr-2" />
            Trending Searches
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        {activeTab === 'suggestions' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Search Suggestions</h2>
              <button
                onClick={() => setShowAddSuggestion(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FiPlus size={16} />
                <span>Add Suggestion</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{suggestion.term}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Type: <span className="font-medium">{suggestion.type}</span>
                      </p>
                      {suggestion.category && (
                        <p className="text-sm text-gray-600">
                          Category: <span className="font-medium">{suggestion.category}</span>
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteSuggestion(suggestion.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {suggestions.length === 0 && (
              <div className="text-center py-12">
                <FiSearch className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No search suggestions found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recent' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Searches</h2>
            </div>

            <div className="space-y-3">
              {recentSearches.map((search) => (
                <motion.div
                  key={search.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <FiClock className="text-gray-400" />
                    <span className="font-medium text-gray-900">{search.term}</span>
                    <span className="text-sm text-gray-500">{formatTimeAgo(search.timestamp)}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteRecent(search.id)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </div>

            {recentSearches.length === 0 && (
              <div className="text-center py-12">
                <FiClock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No recent searches found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'trending' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Trending Searches</h2>
              <button
                onClick={() => setShowAddTrending(true)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <FiPlus size={16} />
                <span>Add Trending</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingSearches.map((trend) => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{trend.term}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-600">Count: {trend.count}</span>
                        {getTrendIcon(trend.trend)}
                        <span className="text-sm text-gray-600 capitalize">{trend.trend}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteTrending(trend.id)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {trendingSearches.length === 0 && (
              <div className="text-center py-12">
                <FiTrendingUp className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500">No trending searches found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Suggestion Modal */}
      <AnimatePresence>
        {showAddSuggestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Search Suggestion</h2>
                <button
                  onClick={() => setShowAddSuggestion(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Term *
                  </label>
                  <input
                    type="text"
                    value={suggestionForm.term}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, term: e.target.value })}
                    placeholder="Enter search term"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type *
                  </label>
                  <select
                    value={suggestionForm.type}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, type: e.target.value as 'product' | 'category' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="product">Product</option>
                    <option value="category">Category</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={suggestionForm.category}
                    onChange={(e) => setSuggestionForm({ ...suggestionForm, category: e.target.value })}
                    placeholder="Enter category (optional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddSuggestion}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add Suggestion
                  </button>
                  <button
                    onClick={() => setShowAddSuggestion(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Trending Modal */}
      <AnimatePresence>
        {showAddTrending && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Trending Search</h2>
                <button
                  onClick={() => setShowAddTrending(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Term *
                  </label>
                  <input
                    type="text"
                    value={trendingForm.term}
                    onChange={(e) => setTrendingForm({ ...trendingForm, term: e.target.value })}
                    placeholder="Enter search term"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Count *
                  </label>
                  <input
                    type="number"
                    value={trendingForm.count}
                    onChange={(e) => setTrendingForm({ ...trendingForm, count: parseInt(e.target.value) || 0 })}
                    placeholder="Enter count"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trend *
                  </label>
                  <select
                    value={trendingForm.trend}
                    onChange={(e) => setTrendingForm({ ...trendingForm, trend: e.target.value as 'up' | 'down' | 'stable' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  >
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                    <option value="stable">Stable</option>
                  </select>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleAddTrending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Add Trending
                  </button>
                  <button
                    onClick={() => setShowAddTrending(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 