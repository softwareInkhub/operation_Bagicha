import { motion } from 'framer-motion'

const essentials = [
  { name: 'Seeds', icon: '🌾', color: 'bg-yellow-50' },
  { name: 'Fertilizers', icon: '🧪', color: 'bg-green-50' },
  { name: 'Watering', icon: '💧', color: 'bg-blue-50' },
  { name: 'Soil', icon: '🪨', color: 'bg-amber-50' },
  { name: 'Tools', icon: '🛠️', color: 'bg-purple-50' },
  { name: 'Pots', icon: '🪴', color: 'bg-orange-50' },
]

export default function EssentialsSection() {
  return (
    <section className="mt-4 px-4">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="text-base font-semibold mb-2 text-gray-800"
      >
        Gardening Essentials
      </motion.h2>
      <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {essentials.map((item, idx) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="min-w-[80px] bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center py-3 px-2 snap-start transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer group"
          >
            <div className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center mb-2 group-hover:bg-opacity-80 transition-all duration-300`}>
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </span>
            </div>
            <span className="text-xs text-gray-700 text-center font-normal">{item.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
} 