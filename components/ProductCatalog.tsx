'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'

interface Product {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
  badgeColor?: string
  inStock: boolean
  fastDelivery: boolean
  organic: boolean
  features: string[]
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    subcategory: 'Tropical',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    badge: 'Trending',
    badgeColor: 'bg-red-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Low Maintenance', 'Pet Safe'],
    description: 'Large, glossy leaves with distinctive holes and splits. Perfect for modern interiors.'
  },
  {
    id: 2,
    name: 'Snake Plant',
    category: 'Indoor Plants',
    subcategory: 'Succulent',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    badge: 'Best Seller',
    badgeColor: 'bg-green-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Low Maintenance', 'Drought Tolerant'],
    description: 'Tall, upright leaves with yellow edges. Excellent for beginners.'
  },
  {
    id: 3,
    name: 'Professional Pruner',
    category: 'Tools',
    subcategory: 'Cutting',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Premium',
    badgeColor: 'bg-purple-500',
    inStock: true,
    fastDelivery: false,
    organic: false,
    features: ['Sharp Blades', 'Ergonomic Grip', 'Safety Lock'],
    description: 'Professional-grade pruner for precise cutting and trimming.'
  },
  {
    id: 4,
    name: 'Organic Potting Mix',
    category: 'Soil & Fertilizer',
    subcategory: 'Potting Mix',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Organic',
    badgeColor: 'bg-emerald-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Organic', 'Well Draining', 'Nutrient Rich'],
    description: 'Premium organic potting mix enriched with natural nutrients.'
  },
  {
    id: 5,
    name: 'Ceramic Plant Pot',
    category: 'Pots & Planters',
    subcategory: 'Ceramic',
    price: 299,
    originalPrice: 449,
    rating: 4.5,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'New',
    badgeColor: 'bg-blue-500',
    inStock: true,
    fastDelivery: false,
    organic: false,
    features: ['Drainage Hole', 'Modern Design', 'Durable'],
    description: 'Beautiful ceramic pot with modern design and drainage hole.'
  },
  {
    id: 6,
    name: 'Tomato Seeds Pack',
    category: 'Seeds',
    subcategory: 'Vegetables',
    price: 49,
    originalPrice: 79,
    rating: 4.5,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Heirloom',
    badgeColor: 'bg-orange-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Heirloom', 'High Yield', 'Disease Resistant'],
    description: 'Organic heirloom tomato seeds for home gardening.'
  },
  {
    id: 7,
    name: 'Bamboo Plant',
    category: 'Lucky Plants',
    subcategory: 'Indoor',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Easy Care', 'Symbolic', 'Air Purifying'],
    description: 'Lucky bamboo for prosperity and good fortune.'
  },
  {
    id: 8,
    name: 'Aloe Vera',
    category: 'Medicinal Plants',
    subcategory: 'Succulent',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Medicinal',
    badgeColor: 'bg-lime-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Healing', 'Low Maintenance', 'Air Purifying'],
    description: 'Aloe Vera for skin care and healing.'
  },
  {
    id: 9,
    name: 'Areca Palm',
    category: 'Air Purifying',
    subcategory: 'Indoor',
    price: 799,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Air Purifier',
    badgeColor: 'bg-cyan-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Pet Safe', 'Low Light'],
    description: 'Areca Palm for clean indoor air.'
  },
  {
    id: 10,
    name: 'Jade Plant',
    category: 'Succulents',
    subcategory: 'Indoor',
    price: 399,
    originalPrice: 599,
    rating: 4.5,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Low Maintenance', 'Symbolic', 'Air Purifying'],
    description: 'Jade Plant for good luck and prosperity.'
  },
  {
    id: 11,
    name: 'Spider Plant',
    category: 'Pet Friendly',
    subcategory: 'Indoor',
    price: 299,
    originalPrice: 399,
    rating: 4.4,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Pet Friendly',
    badgeColor: 'bg-pink-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Safe for Pets', 'Air Purifying', 'Easy Care'],
    description: 'Spider Plant is safe for pets and purifies air.'
  },
  {
    id: 12,
    name: 'Rubber Plant',
    category: 'Statement Plants',
    subcategory: 'Indoor',
    price: 599,
    originalPrice: 899,
    rating: 4.7,
    reviews: 175,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Statement',
    badgeColor: 'bg-indigo-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Large Leaves', 'Air Purifying', 'Modern Look'],
    description: 'Rubber Plant for a bold, modern statement.'
  },
  {
    id: 13,
    name: 'Calathea',
    category: 'Decorative Plants',
    subcategory: 'Indoor',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviews: 130,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Decorative',
    badgeColor: 'bg-fuchsia-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Patterned Leaves', 'Air Purifying', 'Pet Safe'],
    description: 'Calathea with beautiful patterned leaves.'
  }
]

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Group products by category
  const groupedProducts: { [category: string]: Product[] } = {}
  products.forEach(product => {
    if (!groupedProducts[product.category]) groupedProducts[product.category] = []
    groupedProducts[product.category].push(product)
  })

  // Prepare cards for two-row slider
  const cardEntries = Object.entries(groupedProducts)
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Indoor Plants': '🪴',
      'Tools': '🛠️',
      'Soil & Fertilizer': '🪨',
      'Pots & Planters': '🏺',
      'Seeds': '🌾',
      'Lucky Plants': '🍀',
      'Medicinal Plants': '💊',
      'Air Purifying': '🌿',
      'Succulents': '🌵',
      'Flowering Plants': '🌸',
      'Herbs': '🌱',
      'Bonsai': '🌳'
    }
    return icons[category] || '🛍️'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    const categoryProducts = groupedProducts[selectedCategory] || []
    return categoryProducts.map((product, index) => ({
      ...product,
      wishlistButton: <WishlistButton product={{ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image 
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
        🛍️ Product Catalog
      </motion.h2>
      
      {/* Two-row slider */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map(([category, categoryProducts], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (rowIndex * 0.1) + (index * 0.1) }}
                  className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start"
                  onClick={() => handleCardClick(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                    {categoryProducts.slice(0, 4).map((product, idx) => (
                      <img
                        key={product.id}
                        src={product.image}
                        alt={product.name}
                        className="w-8 h-8 md:w-10 md:h-10 object-cover rounded bg-gray-50 border border-gray-100 mx-auto"
                      />
                    ))}
                  </div>
                  {/* +X more badge */}
                  <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">+{categoryProducts.length} more</div>
                  {/* Category name */}
                  <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{category}</div>
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
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🛍️'}
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