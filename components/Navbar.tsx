import SearchBar from './SearchBar'
import CategorySlider from './CategorySlider'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-3 py-2">
        {/* Logo */}
        <motion.span 
          className="text-2xl text-green-600 font-bold"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          🌱
        </motion.span>
        {/* Full-width search bar */}
        <div className="flex-1 mx-3">
          <SearchBar />
        </div>
        {/* Profile icon */}
        <Link href="/auth/login">
          <motion.button 
            className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-green-50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path d="M16 20v-1a4 4 0 0 0-8 0v1" />
            </svg>
          </motion.button>
        </Link>
      </div>
      {/* Category Slider below search bar */}
      <CategorySlider />
    </nav>
  )
} 