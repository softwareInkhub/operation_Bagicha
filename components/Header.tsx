'use client'

import { useState, useEffect, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Heart, Menu, X, Bell, 
  ChevronDown, Package, Truck, Shield, Clock, Star, Mic 
} from 'lucide-react'
import Link from 'next/link'
import SearchModal from './SearchModal'
import { CartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useComponentConfig } from '@/lib/useComponentConfig'
import { getCategories, getCurrentCustomer, clearCurrentCustomer, isCustomerLoggedIn } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
  const [notifications, setNotifications] = useState(2)
  const [isScrolled, setIsScrolled] = useState(false)
  const { cartCount, addToCart } = useContext(CartContext)
  const { wishlistCount, wishlist, removeFromWishlist } = useWishlist()
  const [searchFocused, setSearchFocused] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [currentCustomer, setCurrentCustomer] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  
  // Load admin configuration
  const { config } = useComponentConfig('header', {
    showSearch: true,
    showCart: true,
    showWishlist: true,
    sticky: true,
    showCategories: true,
    showLogo: true
  })
  const suggestions = [
    'Search for plants, tools, seeds...',
    'Try "Indoor Plants"',
    'Try "Gardening Kits"',
    'Try "Planters"',
    'Try "Soil & Fertilizer"',
    'Try "Plant Care Tips"',
  ]
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    loadCategories()
    checkLoginStatus()
  }, [])

  // Check login status and customer info
  useEffect(() => {
    checkLoginStatus()
    
    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = () => {
      checkLoginStatus()
    }
    
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const checkLoginStatus = () => {
    const customer = getCurrentCustomer()
    const loggedIn = isCustomerLoggedIn()
    
    setCurrentCustomer(customer)
    setIsLoggedIn(loggedIn)
  }

  const handleLogout = () => {
    clearCurrentCustomer()
    setCurrentCustomer(null)
    setIsLoggedIn(false)
    router.push('/')
  }

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
      // Fallback to some default categories if Firebase fails
      setCategories([
        { name: 'Indoor Plants', icon: '🪴' },
        { name: 'Flowering Plants', icon: '🌸' },
        { name: 'Pots & Planters', icon: '🏺' },
        { name: 'Seeds', icon: '🌾' },
        { name: 'Fertilizers', icon: '🧪' },
        { name: 'Tools', icon: '🛠️' }
      ])
    } finally {
      setCategoriesLoading(false)
    }
  }

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

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, qty: 1 });
    
    // Show success message
    setShowCartSuccess(product.name);
    setTimeout(() => setShowCartSuccess(null), 2000);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach(product => addToCart({ ...product, qty: 1 }));
    
    // Show success message
    setShowCartSuccess('All items');
    setTimeout(() => setShowCartSuccess(null), 2000);
  };

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
        className={`${config.sticky ? 'sticky' : 'relative'} top-0 z-50 transition-all duration-300 ${
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
            {config.showLogo && (
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
            )}

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
                {config.showWishlist && (
                  <motion.button
                    onClick={() => {
                      document.getElementById('wishlist')?.scrollIntoView({ behavior: 'smooth' });
                    }}
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
                )}

                {/* Cart - only show if cartCount > 0 and config allows */}
                {config.showCart && cartCount > 0 && (
                  <Link href="/checkout">
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
                  </Link>
                )}

                {/* Admin Link */}
                <Link href="/admin">
                  <motion.button
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title="Admin Panel"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </motion.button>
                </Link>

                {/* User Account */}
                <motion.div className="relative group">
                  <motion.button
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
          >
                    <User className="w-6 h-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {isLoggedIn ? currentCustomer?.name?.split(' ')[0] || 'Account' : 'Account'}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </motion.button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      {isLoggedIn ? (
                        <>
                          {/* Logged In User Menu */}
                          <div className="px-3 py-2 border-b border-gray-100 mb-2">
                            <p className="text-sm font-medium text-gray-900">{currentCustomer?.name}</p>
                            <p className="text-xs text-gray-500">{currentCustomer?.phone}</p>
                            {currentCustomer?.loyaltyPoints > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                {currentCustomer.loyaltyPoints} loyalty points
                              </p>
                            )}
                          </div>
                          <Link href="/account" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            My Profile
                          </Link>
                          <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            My Orders
                          </a>
                          <button 
                            onClick={() => setIsWishlistDrawerOpen(true)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            Wishlist ({wishlistCount})
                          </button>
                          <a href="#" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Account Settings
                          </a>
                          <hr className="my-2" />
                          <button 
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Guest User Menu */}
                          <Link href="/auth/login" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Sign In
                          </Link>
                          <Link href="/auth/signup" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                            Create Account
                          </Link>
                          <hr className="my-2" />
                          <button 
                            onClick={() => setIsWishlistDrawerOpen(true)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            Wishlist ({wishlistCount})
                          </button>
                        </>
                      )}
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

          {/* Mobile Menu - Removed the inline expanding menu */}
        </div>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Menu Overlay - New Implementation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-xl">🌱</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                      <p className="text-xs text-gray-600">Bagicha Garden</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-8 h-8 rounded-full bg-white shadow-sm hover:bg-gray-50 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Menu Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* User Section */}
                  <div className="p-4 border-b border-gray-100">
                    {isLoggedIn ? (
                      <>
                        {/* Logged In User */}
                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{currentCustomer?.name}</h3>
                            <p className="text-sm text-gray-600">{currentCustomer?.phone}</p>
                            {currentCustomer?.loyaltyPoints > 0 && (
                              <p className="text-xs text-green-600 mt-1">
                                {currentCustomer.loyaltyPoints} loyalty points
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <Link
                            href="/account"
                            className="w-full bg-green-100 hover:bg-green-200 text-green-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center block"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Guest User */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">Welcome!</h3>
                            <p className="text-sm text-gray-600">Sign in to your account</p>
                          </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                          <Link
                            href="/auth/login"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign In
                          </Link>
                          <Link
                            href="/auth/signup"
                            className="flex-1 bg-white border border-green-600 text-green-600 hover:bg-green-50 text-sm font-medium py-2 px-3 rounded-lg transition-colors text-center"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            Sign Up
                          </Link>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="p-4 space-y-2">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
                    
                    {/* Wishlist */}
                    <motion.button
                      onClick={() => {
                        setIsWishlistDrawerOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                          <Heart className="w-5 h-5 text-pink-600" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-gray-900">Wishlist</span>
                          <p className="text-xs text-gray-500">Your saved items</p>
                        </div>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                          {wishlistCount}
                        </span>
                      )}
                    </motion.button>

                    {/* Notifications */}
                    <motion.button
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <Bell className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-gray-900">Notifications</span>
                          <p className="text-xs text-gray-500">Stay updated</p>
                        </div>
                      </div>
                      {notifications > 0 && (
                        <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {notifications}
                        </span>
                      )}
                    </motion.button>

                    {/* Cart */}
                    {cartCount > 0 && (
                      <Link href="/checkout" onClick={() => setIsMobileMenuOpen(false)}>
                        <motion.button
                          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                                <circle cx="7" cy="21" r="1" />
                                <circle cx="20" cy="21" r="1" />
                              </svg>
                            </div>
                            <div className="text-left">
                              <span className="font-medium text-gray-900">Cart</span>
                              <p className="text-xs text-gray-500">Your items</p>
                            </div>
                          </div>
                          <span className="w-6 h-6 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                            {cartCount}
                          </span>
                        </motion.button>
                      </Link>
                    )}
                  </div>

                  {/* Categories */}
                  <div className="p-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Categories</h4>
                    <div className="space-y-2">
                      {categoriesLoading ? (
                        // Loading skeleton
                        [...Array(6)].map((_, index) => (
                          <div key={index} className="w-full flex items-center gap-3 p-3 rounded-lg animate-pulse">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                            <div className="w-24 h-4 bg-gray-200 rounded"></div>
                          </div>
                        ))
                      ) : (
                        categories.map((category, index) => (
                          <motion.button
                            key={category.id || category.name}
                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              const section = document.getElementById(category.name.toLowerCase().replace(/\s+/g, '-').replace('&', 'and'));
                              if (section) {
                                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          >
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg overflow-hidden">
                              {(category as any).image ? (
                                <img
                                  src={(category as any).image}
                                  alt={category.name}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              ) : (
                                <span>{category.icon}</span>
                              )}
                            </div>
                            <span className="font-medium text-gray-900">{category.name}</span>
                          </motion.button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Why Choose Us</h4>
                    <div className="space-y-3">
                      {features.map((feature) => (
                        <div key={feature.text} className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{feature.text}</div>
                            <div className="text-xs text-gray-500">{feature.subtext}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Contact Us</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>📞</span>
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <span>✉️</span>
                        <span>support@bagicha.com</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium py-3 rounded-lg transition-all duration-300"
                  >
                    Close Menu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistDrawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden"
            onClick={() => setIsWishlistDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <Heart className="w-6 h-6 text-red-500" />
                    <h2 className="text-lg font-semibold text-gray-900">My Wishlist</h2>
                    {wishlistCount > 0 && (
                      <span className="w-6 h-6 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                        {wishlistCount}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsWishlistDrawerOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                      <p className="text-gray-600 mb-4">Start adding your favorite plants and gardening items!</p>
                      <button
                        onClick={() => {
                          setIsWishlistDrawerOpen(false);
                          document.getElementById('trending-plants')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
                      >
                        Explore Products
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {wishlist.map((product) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm truncate">
                              {product.name}
                            </h3>
                            <p className="text-green-600 font-semibold text-sm">
                              ₹{product.price}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded-lg transition-colors"
                            >
                              Add to Cart
                            </button>
                            <button
                              onClick={() => removeFromWishlist(product.id)}
                              className="text-red-600 hover:text-red-700 text-xs px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {wishlist.length > 0 && (
                  <div className="p-4 border-t border-gray-200">
                    <button
                      onClick={handleAddAllToCart}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
                        <circle cx="7" cy="21" r="1" />
                        <circle cx="20" cy="21" r="1" />
                      </svg>
                      Add All to Cart
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
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
    </>
  )
} 