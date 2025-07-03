'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Clock } from 'lucide-react'
import { useComponentConfig } from '@/lib/useComponentConfig'

const offers = [
  {
    id: 1,
    title: 'First Order',
    subtitle: 'Get 50% OFF',
    description: 'Up to ₹100 off on your first order',
    color: 'from-pink-500 to-rose-500',
    icon: '🎉',
    timeLeft: '2 days left'
  },
  {
    id: 2,
    title: 'Free Delivery',
    subtitle: 'On orders above ₹199',
    description: 'No delivery charges on orders above ₹199',
    color: 'from-blue-500 to-indigo-500',
    icon: '🚚',
    timeLeft: 'Always available'
  },
  {
    id: 3,
    title: 'Fresh Vegetables',
    subtitle: '20% OFF',
    description: 'On all fresh vegetables this week',
    color: 'from-green-500 to-emerald-500',
    icon: '🥬',
    timeLeft: '5 days left'
  }
]

export default function Offers() {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0)
  
  // Load admin configuration
  const { config } = useComponentConfig('offers', {
    autoRotate: true,
    rotationInterval: 5000,
    showTimer: true,
    maxOffers: 6,
    showDiscountPercentage: true,
    enableHover: true
  })

  // Auto-rotation effect
  useEffect(() => {
    if (config.autoRotate && offers.length > 1) {
      const interval = setInterval(() => {
        setCurrentOfferIndex((prev) => (prev + 1) % Math.min(offers.length, config.maxOffers))
      }, config.rotationInterval)
      
      return () => clearInterval(interval)
    }
  }, [config.autoRotate, config.rotationInterval, config.maxOffers])

  // Filter offers based on maxOffers setting
  const displayedOffers = offers.slice(0, config.maxOffers)

  return (
    <section className="py-8 bg-gray-50">
      <div className="mobile-container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Best Offers</h2>
          <button className="text-primary-600 font-medium text-sm hover:text-primary-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedOffers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative overflow-hidden"
            >
              <div className={`bg-gradient-to-br ${offer.color} rounded-xl p-6 text-white relative overflow-hidden ${config.enableHover ? 'hover:scale-105 transition-transform duration-200' : ''}`}>
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{offer.icon}</span>
                        <div>
                          <h3 className="font-semibold text-base">{offer.title}</h3>
                          <p className="text-xs opacity-90">{offer.subtitle}</p>
                        </div>
                      </div>
                      <p className="text-xs opacity-90 mb-4">{offer.description}</p>
                      
                      <div className="flex items-center justify-between">
                        {config.showTimer && (
                          <div className="flex items-center space-x-1 text-xs opacity-80">
                            <Clock className="w-3 h-3" />
                            <span>{offer.timeLeft}</span>
                          </div>
                        )}
                        <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg text-xs font-normal transition-all duration-200">
                          Claim Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Refer & Earn</h3>
              <p className="text-sm opacity-90 mb-4">Get ₹100 for every friend who joins Bagicha</p>
              <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Invite Friends
              </button>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-3xl">🎁</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 