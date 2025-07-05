import { useEffect, useState, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, User, Heart, ShoppingCart, X, Package, Grid, MessageCircle, Send, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { CartContext } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { isCustomerLoggedIn } from '@/lib/firebase'
import CategorySheet from './CategorySheet'

// Define the ChatMessage type
type ChatMessage = {
  id: number
  type: 'bot' | 'user'
  message: string
  timestamp: Date
}

const quickQuestions = [
  "How do I care for succulents?",
  "What's the best soil for indoor plants?",
  "How often should I water my plants?",
  "My plant has yellow leaves, what should I do?",
  "What plants are good for beginners?"
]

const supportOptions = [
  {
    icon: Phone,
    title: "Call Us",
    subtitle: "Speak to an expert",
    action: "+91 98765 43210"
  },
  {
    icon: Mail,
    title: "Email Support",
    subtitle: "Get detailed help",
    action: "support@bagicha.com"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    subtitle: "Instant assistance",
    action: "Start Chat"
  }
]

export default function StickyFooter() {
  const router = useRouter()
  const { cartCount, addToCart } = useContext(CartContext)
  const { wishlist, wishlistCount, removeFromWishlist } = useWishlist()
  const [show, setShow] = useState(false)
  const [active, setActive] = useState('Home')
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isWishlistDrawerOpen, setIsWishlistDrawerOpen] = useState(false)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'support'>('chat')
  const [message, setMessage] = useState('')
  const footerRef = useRef<HTMLDivElement>(null)
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false)
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm your gardening assistant. How can I help you today? 🌱",
      timestamp: new Date()
    }
  ])
  
  // Remove search icon, add search bar
  const nav = [
    { name: 'Home', icon: Home, badge: null },
    { name: 'Categories', icon: Grid, badge: null },
    { name: 'Orders', icon: Package, badge: null },
    { name: 'Chat', icon: MessageCircle, badge: null },
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
  
  useEffect(() => {
    const anchor = document.getElementById('footer-observer-anchor');
    if (!anchor) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        console.log('Footer anchor visible:', entry.isIntersecting);
        window.dispatchEvent(new CustomEvent('footer-visibility', { detail: { visible: entry.isIntersecting } }));
      },
      { threshold: 0.1 }
    );
    observer.observe(anchor);
    return () => observer.disconnect();
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

  const handleSendMessage = () => {
    if (!message.trim()) return

    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: message,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setMessage('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'bot',
        message: "Thanks for your question! Our gardening experts will get back to you soon. In the meantime, check out our care guides for helpful tips! 📚",
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleQuickQuestion = (question: string) => {
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: question,
      timestamp: new Date()
    }

    setChatMessages(prev => [...prev, userMessage])
    setActiveTab('chat')

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: chatMessages.length + 2,
        type: 'bot',
        message: "Great question! Let me help you with that. Our team will provide a detailed response shortly. 🌿",
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  const handleNavigation = (itemName: string) => {
    setActive(itemName)
    if (itemName === 'Categories') {
      setIsCategorySheetOpen(true);
    } else if (itemName === 'Chat') {
      setIsChatOpen(true)
    } else if (itemName === 'Orders') {
      // Check if user is logged in
      if (isCustomerLoggedIn()) {
        router.push('/account?tab=orders')
      } else {
        router.push('/auth/login')
      }
    } else if (itemName === 'Profile') {
      // Check if user is logged in
      if (isCustomerLoggedIn()) {
        router.push('/account')
      } else {
        router.push('/auth/login')
      }
    }
  }
  
  return (
    <>
      <CategorySheet open={isCategorySheetOpen} onClose={() => setIsCategorySheetOpen(false)} />
      <AnimatePresence>
        {show && (
          <motion.footer 
            ref={footerRef}
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
                    onClick={() => handleNavigation(item.name)}
                    className={`relative flex flex-col items-center text-[10px] transition-all duration-300 min-w-[48px] min-h-[40px] py-0 px-0 ${
                      active === item.name 
                        ? 'text-green-600 font-semibold' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`relative w-7 h-7 rounded-full flex items-center justify-center mb-0 transition-all duration-300 ${
                      active === item.name 
                        ? 'bg-green-50' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <item.icon 
                        className={`w-4 h-4 ${active === item.name ? 'text-green-600' : 'text-gray-500'}`} 
                      />
                      {/* Badge for cart/wishlist */}
                      {item.badge && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                        >
                          {item.badge}
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium mt-0.5 leading-none">{item.name}</span>
                    {/* Active indicator */}
                    {active === item.name && (
                      <motion.div
                        className="absolute -bottom-0.5 w-1 h-1 bg-green-600 rounded-full"
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

      {/* Chat/Help Drawer */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsChatOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Chat Window */}
            <motion.div
              className="relative w-full max-w-sm h-[500px] bg-white rounded-t-2xl shadow-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <HelpCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Need Help?</h3>
                    <p className="text-xs text-gray-500">We're here to help!</p>
                  </div>
                </div>
                <motion.button
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  onClick={() => setIsChatOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100">
                {[
                  { key: 'chat', label: 'Chat', icon: MessageCircle },
                  { key: 'faq', label: 'Quick Help', icon: HelpCircle },
                  { key: 'support', label: 'Contact', icon: Phone }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.key
                        ? 'text-green-600 border-b-2 border-green-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab(tab.key as 'chat' | 'faq' | 'support')}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {activeTab === 'chat' && (
                  <div className="space-y-4">
                    {/* Chat Messages */}
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg text-sm ${
                              msg.type === 'user'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Questions</h4>
                    {quickQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900 mb-3">Contact Options</h4>
                    {supportOptions.map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <option.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm text-gray-900">{option.title}</div>
                          <div className="text-xs text-gray-500">{option.subtitle}</div>
                        </div>
                      </div>
                    ))}
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