'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
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
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

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

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setModalOpen(false)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
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
    return icons[badge] || '🌿'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    const categoryPlants = groupedPlants[selectedCategory] || []
    return categoryPlants.map((plant, index) => ({
      ...plant,
      wishlistButton: <WishlistButton product={{ 
        id: plant.id, 
        name: plant.name, 
        price: plant.price, 
        image: plant.image 
      }} />
    }))
  }

  return (
    <motion.section 
      className="mt-0 pt-0 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        🌿 Trending Plants
      </motion.h2>
      
      {/* Two-row slider */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map(([badge, plants], index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (rowIndex * 0.1) + (index * 0.1) }}
                  className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start"
                  onClick={() => handleCardClick(badge)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full mb-2 aspect-square">
                    {plants.slice(0, 4).map((plant, idx) => (
                      <div key={plant.id} className="aspect-square overflow-hidden rounded-sm bg-gray-50 border border-gray-100">
                        <img
                          src={plant.image}
                          alt={plant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {/* +X more badge */}
                  <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">+{plants.length} more</div>
                  {/* Category name */}
                  <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{badge}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Modal */}
      {modalOpen && !selectedProduct && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedProduct(null)
          }}
          title={selectedCategory || ''}
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🌿'}
          items={getModalItems()}
          onProductClick={handleProductClick}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
        </div>
      )}
    </motion.section>
  )
} 