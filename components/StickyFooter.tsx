import { useEffect, useState, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Heart, ShoppingCart, X } from 'lucide-react'
import { CartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

export default function StickyFooter() {
  const { cartCount, addToCart } = useContext(CartContext)
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist()
  const [show, setShow] = useState(false)
  const [active, setActive] = useState('Home')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  
  // Remove search icon, add search bar
  const nav = [
    { name: 'Home', icon: Home, badge: null },
    { name: 'Wishlist', icon: Heart, badge: wishlistCount },
    { name: 'Profile', icon: User, badge: null },
  ]
  
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const onScroll = () => {
      const currentScrollY = window.scrollY;
      // Show footer only when scrolling down (not up), and only if scrolled more than 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShow(true);
        window.dispatchEvent(new CustomEvent('footer-visibility', { detail: { visible: true } }));
      } else if (currentScrollY < lastScrollY) {
        setShow(false);
        window.dispatchEvent(new CustomEvent('footer-visibility', { detail: { visible: false } }));
      }
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  
  const handleAddToCart = (product: any) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    });
    
    // Show success message
    setShowCartSuccess(product.name);
    setTimeout(() => setShowCartSuccess(null), 2000);
  };
  
  return (
    <>
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
                    onClick={() => {
                      setActive(item.name)
                      if (item.name === 'Wishlist') setIsWishlistDrawerOpen(true)
                    }}
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
                      {/* Badge for cart/wishlist */}
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
      {/* Wishlist Drawer */}
      <AnimatePresence>
        {isWishlistDrawerOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 right-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl border-t border-gray-200 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex flex-col h-full">
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
              <div className="flex-1 overflow-y-auto p-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-4">Start adding your favorite plants and gardening items!</p>
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
            </div>
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