import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SUGGESTIONS = [
  'Search for plants...',
  'Search for pots...',
  'Search for soil...',
  'Search for seeds...',
  'Search for fertilizers...',
  'Search for gardening tools...'
]

export default function SearchBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % SUGGESTIONS.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-inner w-full">
        <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <div className="relative w-full">
          <AnimatePresence mode="wait">
            <motion.input
              key={SUGGESTIONS[index]}
              className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
              placeholder={SUGGESTIONS[index]}
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