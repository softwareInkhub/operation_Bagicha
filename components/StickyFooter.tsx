import { useEffect, useState, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  User, 
  Heart, 
  ShoppingCart, 
  X, 
  Package, 
  Grid, 
  MessageCircle, 
  Send, 
  HelpCircle, 
  Phone, 
  Mail, 
  MessageSquare,
  Sparkles,
  Leaf,
  ShoppingBag,
  FileText,
  Clock,
  Star,
  Zap,
  Shield,
  Gift,
  ChevronRight,
  ExternalLink,
  Bot,
  Lightbulb,
  Headphones,
  Calendar,
  Settings,
  Bell
} from 'lucide-react'
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
  {
    question: "How do I care for succulents?",
    icon: Leaf,
    color: "text-green-500"
  },
  {
    question: "What's the best soil for indoor plants?",
    icon: Sparkles,
    color: "text-brown-500"
  },
  {
    question: "How often should I water my plants?",
    icon: Zap,
    color: "text-blue-500"
  },
  {
    question: "My plant has yellow leaves, what should I do?",
    icon: Lightbulb,
    color: "text-yellow-500"
  },
  {
    question: "What plants are good for beginners?",
    icon: Star,
    color: "text-purple-500"
  }
]

const supportOptions = [
  {
    icon: Phone,
    title: "Call Us",
    subtitle: "Speak to an expert",
    action: "+91 98765 43210",
    color: "bg-green-100 text-green-600",
    bgColor: "bg-green-50"
  },
  {
    icon: Mail,
    title: "Email Support",
    subtitle: "Get detailed help",
    action: "support@bagicha.com",
    color: "bg-blue-100 text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    icon: Headphones,
    title: "Live Chat",
    subtitle: "Instant assistance",
    action: "Start Chat",
    color: "bg-purple-100 text-purple-600",
    bgColor: "bg-purple-50"
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
  
  // Enhanced navigation with modern icons and badges
  const nav = [
    { name: 'Home', icon: Home, badge: null, color: 'text-blue-500' },
    { name: 'Categories', icon: Leaf, badge: null, color: 'text-green-500' },
    { name: 'Orders', icon: ShoppingBag, badge: null, color: 'text-orange-500' },
    { name: 'Chat', icon: MessageCircle, badge: null, color: 'text-purple-500' },
    { name: 'Profile', icon: User, badge: null, color: 'text-indigo-500' },
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

  const handleQuickQuestion = (questionObj: any) => {
    const userMessage: ChatMessage = {
      id: chatMessages.length + 1,
      type: 'user',
      message: questionObj.question,
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
            className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-200"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="flex flex-col w-full px-2 pt-0.5 pb-0.5 gap-1">
              <nav className="flex justify-around items-center py-1 px-0">
                {nav.map((item, idx) => (
                  <motion.button
                    key={item.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    onClick={() => handleNavigation(item.name)}
                    className={`relative flex flex-col items-center text-[10px] transition-all duration-300 min-w-[48px] min-h-[44px] py-0 px-0 ${
                      active === item.name 
                        ? 'text-green-600 font-semibold' 
                        : 'text-gray-500 hover:text-green-500'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`relative w-8 h-8 rounded-xl flex items-center justify-center mb-1 transition-all duration-300 ${
                      active === item.name 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm' 
                        : 'hover:bg-gray-50'
                    }`}>
                      <item.icon 
                        className={`w-5 h-5 ${active === item.name ? item.color : 'text-gray-500'}`} 
                      />
                      {/* Badge for cart/wishlist */}
                      {item.badge && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-sm"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.1, type: "spring" }}
                        >
                          {item.badge}
                        </motion.div>
                      )}
                    </div>
                    <span className="text-[10px] font-medium leading-none">{item.name}</span>
                    {/* Active indicator */}
                    {active === item.name && (
                      <motion.div
                        className="absolute -bottom-1 w-2 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
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
              <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-sm">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Garden Assistant</h3>
                    <p className="text-xs text-gray-600">Your plant care expert! 🌱</p>
                  </div>
                </div>
                <motion.button
                  className="w-8 h-8 rounded-full hover:bg-white/80 flex items-center justify-center transition-colors"
                  onClick={() => setIsChatOpen(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </motion.button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-100 bg-white">
                {[
                  { key: 'chat', label: 'Chat', icon: MessageCircle, color: 'text-purple-500' },
                  { key: 'faq', label: 'Quick Help', icon: Lightbulb, color: 'text-yellow-500' },
                  { key: 'support', label: 'Contact', icon: Headphones, color: 'text-blue-500' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.key
                        ? `${tab.color} border-b-2 border-current shadow-sm`
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
                        placeholder="Ask about plant care..."
                        className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-300 transition-all"
                      />
                      <motion.button
                        onClick={handleSendMessage}
                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Send className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      <h4 className="font-bold text-gray-900">Quick Questions</h4>
                    </div>
                    {quickQuestions.map((questionObj, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleQuickQuestion(questionObj)}
                        className="w-full p-4 text-left bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl text-sm transition-all duration-200 border border-gray-200 hover:border-gray-300"
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${questionObj.color.replace('text-', 'bg-')} bg-opacity-10`}>
                            <questionObj.icon className={`w-4 h-4 ${questionObj.color}`} />
                          </div>
                          <span className="font-medium text-gray-800">{questionObj.question}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Headphones className="w-5 h-5 text-blue-500" />
                      <h4 className="font-bold text-gray-900">Contact Options</h4>
                    </div>
                    {supportOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        className={`flex items-center gap-4 p-4 ${option.bgColor} rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200`}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`w-12 h-12 ${option.color.replace('text-', 'bg-').replace('bg-blue-100', 'bg-blue-100').replace('bg-green-100', 'bg-green-100').replace('bg-purple-100', 'bg-purple-100')} rounded-xl flex items-center justify-center shadow-sm`}>
                          <option.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="font-bold text-sm text-gray-900">{option.title}</div>
                          <div className="text-xs text-gray-600 mb-1">{option.subtitle}</div>
                          <div className="text-xs font-medium text-gray-700">{option.action}</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
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
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl border border-green-400 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Added "{showCartSuccess}" to cart!
        </motion.div>
      )}
    </>
  )
} 