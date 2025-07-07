import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getSearchSuggestions } from '@/lib/firebase'

interface SearchSuggestion {
  id: string
  term: string
  type: 'product' | 'category'
  category: string
}

export default function SearchBar() {
  const [index, setIndex] = useState(0)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSearchSuggestions()
  }, [])

  const loadSearchSuggestions = async () => {
    try {
      setLoading(true)
      const suggestionsData = await getSearchSuggestions()
      
      // Filter to get only product and category suggestions
      const filteredSuggestions = suggestionsData
        .filter((suggestion: any) => suggestion.type === 'product' || suggestion.type === 'category')
        .slice(0, 6) // Show only 6 suggestions
      
      setSuggestions(filteredSuggestions as SearchSuggestion[])
    } catch (error) {
      console.error('Error loading search suggestions:', error)
      // Fallback suggestions
      setSuggestions([
        { id: '1', term: 'Search for plants...', type: 'product', category: 'Indoor Plants' },
        { id: '2', term: 'Search for pots...', type: 'product', category: 'Pots & Planters' },
        { id: '3', term: 'Search for soil...', type: 'product', category: 'Soil & Fertilizer' },
        { id: '4', term: 'Search for seeds...', type: 'product', category: 'Seeds' },
        { id: '5', term: 'Search for fertilizers...', type: 'category', category: 'Soil & Fertilizer' },
        { id: '6', term: 'Search for gardening tools...', type: 'category', category: 'Tools' }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (suggestions.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % suggestions.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [suggestions.length])

  if (loading) {
    return (
      <div className="relative w-full">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner w-full">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <div className="bg-gray-200 h-4 w-32 rounded animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner w-full">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.input
              key={suggestions[index]?.term || 'default'}
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
              placeholder={suggestions[index]?.term || 'Search for plants, tools, seeds...'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              // No value or onChange, this is just for placeholder cycling
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
} 