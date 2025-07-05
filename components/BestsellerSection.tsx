'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import WishlistButton from './WishlistButton'
import ProductDetails from './ProductDetails'
import { getProducts } from '@/lib/firebase'

interface Product {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  badge?: string
  inStock: boolean
}

export default function BestsellerSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const productsData = await getProducts() as Product[]
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Group products by category and select top-rated ones
  const getBestsellersByCategory = () => {
    const categoryGroups: { [key: string]: Product[] } = {}
    
    products.forEach(product => {
      if (!categoryGroups[product.category]) {
        categoryGroups[product.category] = []
      }
      categoryGroups[product.category].push(product)
    })

    // For each category, sort by rating and take top 4
    const bestsellers = Object.entries(categoryGroups).map(([categoryName, categoryProducts]) => {
      const sortedProducts = categoryProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4)

      return {
        title: categoryName,
        icon: getCategoryIcon(categoryName),
        items: sortedProducts
      }
    })

    return bestsellers
  }

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: string } = {
      'Indoor Plants': '🪴',
      'Outdoor Plants': '🌿',
      'Flowering Plants': '🌸',
      'Medicinal Plants': '🌿',
      'Air Purifying': '💨',
      'Lucky Plants': '🍀',
      'Succulents': '🌵',
      'Tools': '🛠️',
      'Soil & Fertilizer': '🪨',
      'Pots & Planters': '🏺',
      'Seeds': '🌾',
      'Fertilizers': '🧪',
      'Gardening Tools': '🛠️'
    }
    return iconMap[category] || '🌱'
  }

  const handleCardClick = (category: string) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    
    const categoryProducts = products.filter(product => product.category === selectedCategory)
    
    return categoryProducts.map((product) => ({
      ...product,
      wishlistButton: <WishlistButton product={{ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image 
      }} />
    }))
  }

  const handleProductClick = (product: any) => {
    setSelectedProduct(product)
    setModalOpen(false)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
  }

  const bestsellers = getBestsellersByCategory()

  if (loading) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🌟 Bestsellers
        </h2>
        <div className="relative flex items-center">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start animate-pulse"
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    )
  }

  if (bestsellers.length === 0) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🌟 Bestsellers
        </h2>
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">No bestsellers available at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin.</p>
        </div>
      </motion.section>
    )
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
        🌟 Bestsellers
      </motion.h2>
      <div className="relative flex items-center">
        {/* Slider */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
          {bestsellers.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start"
              onClick={() => handleCardClick(item.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* 2x2 image grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                {item.items.slice(0, 4).map((prod, idx) => (
                  <img
                    key={prod.id}
                    src={prod.image || 'https://via.placeholder.com/40x40?text=No+Image'}
                    alt={prod.name}
                    className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                  />
                ))}
                {/* Fill empty slots if less than 4 products */}
                {Array.from({ length: Math.max(0, 4 - item.items.length) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                ))}
              </div>
              {/* +X more badge */}
              <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">
                {item.items.length} product{item.items.length !== 1 ? 's' : ''}
              </div>
              {/* Category name */}
              <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{item.title}</div>
            </motion.div>
          ))}
        </div>
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
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🌟'}
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