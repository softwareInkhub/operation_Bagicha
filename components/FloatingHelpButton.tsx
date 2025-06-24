'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react'

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

export default function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'chat' | 'faq' | 'support'>('chat')
  const [message, setMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      type: 'bot',
      message: "Hi! I'm your gardening assistant. How can I help you today? 🌱",
      timestamp: new Date()
    }
  ])

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

  return (
    <>
      {/* Floating Help Button */}
      <motion.button
        className="fixed bottom-20 right-4 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg z-40 flex items-center justify-center"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring" }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>

      {/* Chat/Help Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/20"
              onClick={() => setIsOpen(false)}
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
                  onClick={() => setIsOpen(false)}
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
                    onClick={() => setActiveTab(tab.key as any)}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content */}
              <div className="h-[350px] overflow-hidden">
                {activeTab === 'chat' && (
                  <div className="h-full flex flex-col">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {chatMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div
                            className={`max-w-[80%] p-3 rounded-lg ${
                              msg.type === 'user'
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <motion.button
                          className="w-10 h-10 bg-green-500 text-white rounded-lg flex items-center justify-center"
                          onClick={handleSendMessage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="p-4 space-y-3">
                    <h4 className="font-medium text-gray-900 mb-3">Quick Questions</h4>
                    {quickQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
                        onClick={() => handleQuickQuestion(question)}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                )}

                {activeTab === 'support' && (
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-gray-900 mb-3">Get in Touch</h4>
                    {supportOptions.map((option, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <option.icon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 text-sm">{option.title}</h5>
                          <p className="text-xs text-gray-500">{option.subtitle}</p>
                        </div>
                        <button className="text-green-600 text-sm font-medium hover:text-green-700">
                          {option.action}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 