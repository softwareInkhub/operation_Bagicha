'use client'

import { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { Home, Search, ShoppingCart, User, Heart } from 'lucide-react'
import { CartContext } from '../context/CartContext'
import { useRouter } from 'next/navigation'

export default function BottomNavigation() {
  const [activeTab, setActiveTab] = useState('home')
  const { cartCount } = useContext(CartContext)
  const router = useRouter()

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'profile', label: 'Profile', icon: User },
  ]

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId)
    
    if (tabId === 'cart' && cartCount > 0) {
      router.push('/checkout')
    } else if (tabId === 'home') {
      router.push('/')
    } else if (tabId === 'wishlist') {
      // Scroll to wishlist section
      document.getElementById('wishlist')?.scrollIntoView({ behavior: 'smooth' })
    }
    // Add other navigation logic as needed
  }

  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <div className="flex items-center justify-around py-2">
        {tabs.map((tab, index) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <motion.button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`relative flex flex-col items-center py-2 px-3 transition-all duration-300 ${
                isActive 
                  ? 'text-green-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1 }}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                
                {/* Badge for cart */}
                {tab.badge && tab.badge > 0 && (
                  <motion.span 
                    className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </motion.span>
                )}
              </div>
              
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                {tab.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div 
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-600 rounded-full"
                  layoutId="activeTab"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
} 