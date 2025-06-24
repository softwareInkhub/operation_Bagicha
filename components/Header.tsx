'use client'

import { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Heart, Menu, X, Bell, 
  ChevronDown, Package, Truck, Shield, Clock, Star, Mic 
} from 'lucide-react'
import SearchModal from './SearchModal'
import { CartContext } from '../context/CartContext'

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [wishlistCount, setWishlistCount] = useState(7)
  const [notifications, setNotifications] = useState(2)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount } = useContext(CartContext)
  const [searchFocused, setSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestions = [
    'Search for plants, tools, seeds...',
    'Try "Indoor Plants"',
    'Try "Gardening Kits"',
    'Try "Planters"',
    'Try "Soil & Fertilizer"',
    'Try "Plant Care Tips"',
  ]
  const [suggestionIndex, setSuggestionIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!searchFocused) {
      const interval = setInterval(() => {
        setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [searchFocused, suggestions.length])

  const features = [
    { icon: Truck, text: 'Free Delivery', subtext: 'Above ₹499' },
    { icon: Package, text: 'Easy Returns', subtext: '30 Days' },
    { icon: Shield, text: 'Secure Payment', subtext: '100% Safe' },
    { icon: Clock, text: '24/7 Support', subtext: 'Always Here' }
  ]

  return (
    <>
      {/* Top Bar */}
      <motion.div 
        className="bg-gradient-to-r from-green-600 to-green-700 text-white py-2"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.text}
                  className="hidden md:flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <feature.icon className="w-4 h-4" />
                  <div>
                    <span className="font-medium">{feature.text}</span>
                    <span className="text-green-100 ml-1">• {feature.subtext}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <motion.a 
                href="tel:+91-98765-43210" 
                className="hidden sm:flex items-center gap-1 hover:text-green-200 transition-colors"
                whileHover={{ scale: 1.05 }}
            >
                <span>📞 +91 98765 43210</span>
              </motion.a>
              <motion.a 
                href="mailto:support@bagicha.com" 
                className="hidden sm:flex items-center gap-1 hover:text-green-200 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <span>✉️ support@bagicha.com</span>
              </motion.a>
            </div>
          </div>
            </div>
      </motion.div>

      {/* Main Header */}
      <motion.header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
            : 'bg-white'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="container-responsive">
          <div className="flex items-center justify-between py-2">
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🌱</span>
          </div>
              <div>
                <h1 className="text-lg font-semibold text-gradient">Bagicha</h1>
                <p className="text-xs font-normal -mt-1">Garden Essentials</p>
        </div>
            </motion.div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Desktop Actions */}
              <div className="hidden md:flex items-center gap-3 md:gap-4">
                {/* Notifications */}
                <motion.button
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-6 h-6 text-gray-600" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </motion.button>

                {/* Wishlist */}
                <motion.button
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Heart className="w-6 h-6 text-gray-600" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </motion.button>

                {/* Cart - only show if cartCount > 0 */}
                {cartCount > 0 && (
                  <motion.button
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4" /><circle cx="7" cy="21" r="1" /><circle cx="20" cy="21" r="1" /></svg>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  </motion.button>
                )}

                {/* User Account */}
                <motion.div className="relative group">
                  <motion.button
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
          >
                    <User className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Account</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        My Profile
                      </a>
                      <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        My Orders
                      </a>
                      <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Wishlist
                      </a>
                      <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                        Settings
                      </a>
                      <hr className="my-2" />
                      <a href="#" className="block px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        Sign Out
                      </a>
          </div>
        </div>
                </motion.div>
                </div>

              {/* Mobile Actions: Only menu button */}
              <div className="flex md:hidden items-center gap-2">
                <motion.button
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Animated Search Bar below navbar */}
          <div className="w-full flex justify-center pb-2">
            <div className="relative w-full max-w-xl">
              <input
                ref={searchInputRef}
                type="text"
                placeholder=" "
                className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-full focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/90 backdrop-blur-sm text-base shadow-sm whitespace-nowrap overflow-hidden text-ellipsis"
                style={{ minHeight: 48, maxHeight: 48 }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                onClick={() => setIsSearchOpen(true)}
                readOnly
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              {/* Microphone icon on the right */}
              <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-green-50 transition-colors">
                <Mic className="w-5 h-5 text-green-500" />
              </button>
              {/* Animated placeholder/label with suggestions */}
              <motion.label
                htmlFor="search-bar"
                initial={false}
                animate={searchFocused ? { top: 6, left: 44, fontSize: '0.75rem', color: '#059669' } : { top: '50%', left: 44, fontSize: '1rem', color: '#6b7280', translateY: '-50%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="absolute pointer-events-none select-none font-medium"
                style={{
                  position: 'absolute',
                  zIndex: 2,
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  cursor: 'text',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: 'calc(100% - 90px)',
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={suggestionIndex}
                    initial={{ y: 16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -16, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="block"
                  >
                    {suggestions[suggestionIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.label>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden border-t border-gray-100"
              >
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Account</span>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Wishlist</span>
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-gray-400" />
                      {wishlistCount > 0 && (
                        <span className="w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Notifications</span>
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-gray-400" />
                      {notifications > 0 && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {notifications}
                        </span>
        )}
      </div>
                  </div>
                  <hr className="border-gray-100" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {features.map((feature) => (
                      <div key={feature.text} className="flex items-center gap-2">
                        <feature.icon className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-normal text-base font-semibold text-gray-700">{feature.text}</div>
                          <div className="text-gray-500">{feature.subtext}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
} 