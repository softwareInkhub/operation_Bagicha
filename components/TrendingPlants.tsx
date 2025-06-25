'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import WishlistButton from './WishlistButton'

const trendingPlants = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    badge: 'Trending',
    badgeColor: 'bg-red-500',
    category: 'Indoor Plants',
    features: ['Air Purifying', 'Low Maintenance', 'Pet Safe']
  },
  {
    id: 2,
    name: 'Snake Plant',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 456,
    badge: 'Best Seller',
    badgeColor: 'bg-green-500',
    category: 'Indoor Plants',
    features: ['Air Purifying', 'Low Maintenance', 'Drought Tolerant']
  },
  {
    id: 3,
    name: 'Peace Lily',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    price: 499,
    originalPrice: 699,
    rating: 4.7,
    reviews: 189,
    badge: 'Air Purifier',
    badgeColor: 'bg-blue-500',
    category: 'Indoor Plants',
    features: ['Air Purifying', 'Flowering', 'Low Light']
  },
  {
    id: 4,
    name: 'ZZ Plant',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviews: 156,
    badge: 'Low Maintenance',
    badgeColor: 'bg-purple-500',
    category: 'Indoor Plants',
    features: ['Low Maintenance', 'Drought Tolerant', 'Pet Safe']
  },
  {
    id: 5,
    name: 'Pothos',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.5,
    reviews: 267,
    badge: 'Trailing',
    badgeColor: 'bg-orange-500',
    category: 'Indoor Plants',
    features: ['Trailing', 'Air Purifying', 'Easy Care']
  },
  {
    id: 6,
    name: 'Fiddle Leaf Fig',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 1299,
    originalPrice: 1799,
    rating: 4.8,
    reviews: 123,
    badge: 'Statement',
    badgeColor: 'bg-indigo-500',
    category: 'Indoor Plants',
    features: ['Statement Piece', 'Large Leaves', 'Modern Look']
  },
  {
    id: 7,
    name: 'Aloe Vera',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviews: 340,
    badge: 'Medicinal',
    badgeColor: 'bg-lime-500',
    category: 'Succulents',
    features: ['Medicinal', 'Low Maintenance', 'Healing']
  },
  {
    id: 8,
    name: 'Jade Plant',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    price: 399,
    originalPrice: 599,
    rating: 4.5,
    reviews: 145,
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    category: 'Succulents',
    features: ['Lucky Plant', 'Low Maintenance', 'Symbolic']
  },
  {
    id: 9,
    name: 'Spider Plant',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.4,
    reviews: 120,
    badge: 'Pet Friendly',
    badgeColor: 'bg-pink-400',
    category: 'Pet Friendly',
    features: ['Pet Safe', 'Air Purifying', 'Easy Care']
  },
  {
    id: 10,
    name: 'Rubber Plant',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 599,
    originalPrice: 899,
    rating: 4.7,
    reviews: 175,
    badge: 'Statement',
    badgeColor: 'bg-indigo-500',
    category: 'Statement Plants',
    features: ['Large Leaves', 'Air Purifying', 'Modern Look']
  },
  {
    id: 11,
    name: 'Calathea',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviews: 130,
    badge: 'Decorative',
    badgeColor: 'bg-fuchsia-500',
    category: 'Decorative Plants',
    features: ['Patterned Leaves', 'Air Purifying', 'Pet Safe']
  },
  {
    id: 12,
    name: 'Bamboo Plant',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviews: 110,
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    category: 'Lucky Plants',
    features: ['Easy Care', 'Symbolic', 'Air Purifying']
  }
]

export default function TrendingPlants() {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Group plants by badge
  const groupedPlants: { [badge: string]: typeof trendingPlants } = {}
  trendingPlants.forEach(plant => {
    if (!groupedPlants[plant.badge]) groupedPlants[plant.badge] = []
    groupedPlants[plant.badge].push(plant)
  })

  // Prepare cards for two-row slider
  const cardEntries = Object.entries(groupedPlants)
  const cardsPerRow = Math.ceil(cardEntries.length / 2)
  const rows = [
    cardEntries.slice(0, cardsPerRow),
    cardEntries.slice(cardsPerRow)
  ]

  const handleCardClick = (category: string) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const getCategoryIcon = (badge: string) => {
    const icons: { [key: string]: string } = {
      'Trending': '🔥',
      'Best Seller': '⭐',
      'Air Purifier': '🌿',
      'Low Maintenance': '🌱',
      'Trailing': '🌿',
      'Statement': '🌳',
      'Medicinal': '💊',
      'Lucky': '🍀',
      'Pet Friendly': '🐾',
      'Decorative': '🎨'
    }
    return icons[badge] || '🌱'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    return groupedPlants[selectedCategory].slice(0, 4).map(plant => ({
      name: plant.name,
      image: plant.image,
      price: plant.price,
      rating: plant.rating,
      reviews: plant.reviews,
      description: plant.features.join(', '),
      wishlistButton: <WishlistButton product={plant} />
    }))
  }

  return (
    <motion.section 
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="px-4">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trending Plants</h2>
            <p className="text-gray-600 mt-1">Most popular plants this season</p>
          </div>
        </motion.div>
        
        <div className="flex flex-col gap-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 pb-2 scrollbar-none w-full">
              {row.map(([badge, items], idx) => {
                const images = [
                  ...items.slice(0, 4),
                  ...Array(4 - items.length).fill({ image: '/placeholder.png', name: 'Placeholder', id: `ph-${badge}-${idx}` })
                ].slice(0, 4)
                return (
                  <motion.div
                    key={badge}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white shadow-lg border border-gray-100 rounded-2xl p-4 flex flex-col items-center min-w-[140px] max-w-[160px] mx-auto snap-start cursor-pointer"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCardClick(badge)}
                  >
                    {/* 2x2 image grid */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                      {images.map((product, iidx) => (
                        <img
                          key={product.id || iidx}
                          src={product.image}
                          alt={product.image === '/placeholder.png' ? 'Placeholder' : product.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain rounded bg-gray-50 border border-gray-100 mx-auto"
                        />
                      ))}
                    </div>
                    {/* +X more badge */}
                    <div className="text-[11px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-2 py-0.5 rounded-full shadow-sm">
                      +{items.length} more
                    </div>
                    {/* Category name */}
                    <div className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight mt-0.5">
                      {badge}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory || ''}
        icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🌱'}
        items={getModalItems()}
      />
    </motion.section>
  )
} 