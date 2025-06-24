import { useEffect, useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Heart, ShoppingCart } from 'lucide-react'
import { CartContext } from '../context/CartContext'

export default function StickyFooter() {
  const { cartCount } = useContext(CartContext)
  const [show, setShow] = useState(false)
  const [active, setActive] = useState('Home')
  const [lastScrollY, setLastScrollY] = useState(0)
  
  // Remove search icon, add search bar
  const nav = [
    { name: 'Home', icon: Home, badge: null },
    { name: 'Wishlist', icon: Heart, badge: null },
    ...(cartCount > 0 ? [{ name: 'Cart', icon: ShoppingCart, badge: cartCount }] : []),
    { name: 'Profile', icon: User, badge: null },
  ]
  
  useEffect(() => {
    const onScroll = () => {
      const currentScrollY = window.scrollY
      
      // Show footer when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(true)
      } else if (currentScrollY < lastScrollY) {
        setShow(false)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [lastScrollY])
  
  return (
    <AnimatePresence>
      {show && (
    <motion.footer 
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-200"
      initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col w-full px-2 pt-1 pb-1 gap-1">
            <nav className="flex justify-around items-center py-1 px-0">
        {nav.map((item, idx) => (
          <motion.button
            key={item.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            onClick={() => setActive(item.name)}
                  className={`relative flex flex-col items-center text-xs transition-all duration-300 ${
              active === item.name 
                ? 'text-green-600 font-semibold' 
                : 'text-gray-500 hover:text-green-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
                  <div className={`relative w-8 h-8 rounded-full flex items-center justify-center mb-0 transition-all duration-300 ${
              active === item.name 
                ? 'bg-green-50' 
                : 'hover:bg-gray-50'
            }`}>
                    <item.icon 
                className={`w-5 h-5 ${active === item.name ? 'text-green-600' : 'text-gray-500'}`} 
                    />
                    
                    {/* Badge for cart */}
                    {item.badge && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                      >
                        {item.badge}
                      </motion.div>
                    )}
            </div>
                  <span className="text-xs font-medium mt-0.5">{item.name}</span>
                  
                  {/* Active indicator */}
                  {active === item.name && (
                    <motion.div
                      className="absolute -bottom-1 w-1 h-1 bg-green-600 rounded-full"
                      layoutId="activeIndicator"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
          </motion.button>
        ))}
      </nav>
          </div>
    </motion.footer>
      )}
    </AnimatePresence>
  )
} 