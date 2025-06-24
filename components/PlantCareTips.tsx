'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, Droplets, Sun, Leaf } from 'lucide-react'

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

  const toggleTip = (id: number) => {
    setOpenTip(openTip === id ? null : id)
  }

  return (
    <motion.section 
      className="py-6 bg-gray-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
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

        <div className="space-y-3">
          {careTips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
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
          <button className="text-green-600 font-medium text-sm hover:text-green-700 transition-colors">
            View All Care Guides →
          </button>
        </motion.div>
      </div>
    </motion.section>
  )
} 