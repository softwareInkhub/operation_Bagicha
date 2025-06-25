'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, Droplets, Sun, Leaf, X } from 'lucide-react'

const careTips = [
  {
    id: 1,
    question: "How often should I water my indoor plants?",
    answer: "Most indoor plants prefer to dry out slightly between waterings. Check the soil with your finger - if it's dry 1-2 inches below the surface, it's time to water. Overwatering is the most common cause of plant death!",
    icon: Droplets,
    category: "Watering"
  },
  {
    id: 2,
    question: "What's the best lighting for succulents?",
    answer: "Succulents thrive in bright, indirect sunlight. Place them near a south or west-facing window. They need at least 6 hours of light per day. If they start stretching, they need more light!",
    icon: Sun,
    category: "Lighting"
  },
  {
    id: 3,
    question: "How do I know if my plant needs repotting?",
    answer: "Look for roots growing out of drainage holes, soil that dries out very quickly, or if the plant has stopped growing. Spring is the best time to repot most plants.",
    icon: Leaf,
    category: "Care"
  },
  {
    id: 4,
    question: "What's the ideal humidity for tropical plants?",
    answer: "Tropical plants prefer 60-80% humidity. You can increase humidity by grouping plants together, using a humidifier, or placing plants on a tray with pebbles and water.",
    icon: Droplets,
    category: "Environment"
  },
  {
    id: 5,
    question: "How do I fertilize my plants?",
    answer: "Use a balanced fertilizer during the growing season (spring and summer). Dilute to half strength for most houseplants. Don't fertilize in winter when plants are dormant.",
    icon: Leaf,
    category: "Fertilizing"
  },
  {
    id: 6,
    question: "What causes yellow leaves on my plants?",
    answer: "Yellow leaves can indicate overwatering, underwatering, nutrient deficiency, or natural aging. Check the soil moisture first, then consider other factors like light and fertilizer.",
    icon: Lightbulb,
    category: "Troubleshooting"
  }
]

export default function PlantCareTips() {
  const [openTip, setOpenTip] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)

  const toggleTip = (id: number) => {
    setOpenTip(openTip === id ? null : id)
  }

  const handleViewAllCareGuides = () => {
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <motion.section 
        className="py-6 bg-gray-50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        data-section="plant-care"
      >
        <div className="px-4">
          <motion.div 
            className="flex items-center justify-between mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg font-semibold text-gray-900">Plant Care Tips</h2>
            </div>
            <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">
              {careTips.length} tips
            </span>
          </motion.div>
          
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {careTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-w-[260px] max-w-[90vw] flex-shrink-0"
              >
                <motion.button
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  onClick={() => toggleTip(tip.id)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <tip.icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 text-sm">{tip.question}</h3>
                      <span className="text-xs text-gray-500">{tip.category}</span>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: openTip === tip.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {openTip === tip.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="border-t border-gray-100 pt-3">
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {tip.answer}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button 
              className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors"
              onClick={handleViewAllCareGuides}
            >
              View All Care Guides →
            </button>
          </motion.div>
        </div>
      </motion.section>

      {/* Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">All Care Guides</h2>
                    <p className="text-sm text-gray-600">{careTips.length} helpful tips</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Modal Content - Scrollable Grid */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {careTips.map((tip, index) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                    >
                      {/* Tip Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <tip.icon className="w-4 h-4 text-green-600" />
                          </div>
                          <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                            {tip.category}
                          </span>
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">
                          {tip.question}
                        </h3>
                      </div>

                      {/* Tip Answer */}
                      <div className="p-4">
                        <p className="text-xs text-gray-700 leading-relaxed line-clamp-4">
                          {tip.answer}
                        </p>
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <button className="text-green-600 text-xs font-medium hover:text-green-700 transition-colors">
                            Read More →
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
} 