'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'
import PlaceholderImage from './PlaceholderImage'
import { getProducts } from '@/lib/firebase'

interface Product {
  id: string
  name: string
  image: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  badge?: string
  badgeColor?: string
  category: string
  features: string[]
}

export default function TrendingPlants() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [modalProductList, setModalProductList] = useState<Product[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  useEffect(() => {
    loadTrendingProducts()
  }, [])

  const loadTrendingProducts = async () => {
    try {
      const allProducts = await getProducts() as Product[]
      
      // Filter and sort to get trending products
      const trendingProducts = allProducts
        .filter(product => product.category?.includes('Plant') || product.category?.includes('Indoor') || product.category?.includes('Outdoor'))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 12) // Take top 12 trending plants
        .map(product => ({
          ...product,
          badge: getTrendingBadge(product),
          badgeColor: getBadgeColor(product)
        }))
      
      setProducts(trendingProducts)
    } catch (error) {
      console.error('Error loading trending products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTrendingBadge = (product: Product) => {
    if (product.rating >= 4.8) return 'Top Rated'
    if (product.rating >= 4.5) return 'Trending'
    if (product.category?.includes('Air')) return 'Air Purifier'
    if (product.category?.includes('Lucky')) return 'Lucky'
    if (product.category?.includes('Medicinal')) return 'Medicinal'
    if (product.features?.includes('Pet Safe')) return 'Pet Friendly'
    return 'Popular'
  }

  const getBadgeColor = (product: Product) => {
    const badge = getTrendingBadge(product)
    const colorMap: { [key: string]: string } = {
      'Top Rated': 'bg-green-500',
      'Trending': 'bg-red-500',
      'Air Purifier': 'bg-blue-500',
      'Lucky': 'bg-yellow-400',
      'Medicinal': 'bg-lime-500',
      'Pet Friendly': 'bg-pink-400',
      'Popular': 'bg-purple-500'
    }
    return colorMap[badge] || 'bg-gray-500'
  }

  // Group plants by badge
  const groupedPlants: { [badge: string]: Product[] } = {}
  products.forEach(product => {
    const badge = product.badge || 'Popular'
    if (!groupedPlants[badge]) groupedPlants[badge] = []
    groupedPlants[badge].push(product)
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

  const handleProductClick = (product: Product, productList: Product[]) => {
    setModalProductList(productList)
    setModalProductIndex(productList.findIndex(p => p.id === product.id))
    setSelectedProduct(product)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
    setModalProductList([])
    setModalProductIndex(null)
  }

  const getCategoryIcon = (badge: string) => {
    const icons: { [key: string]: string } = {
      'Top Rated': '⭐',
      'Trending': '🔥',
      'Air Purifier': '💨',
      'Lucky': '🍀',
      'Medicinal': '💊',
      'Pet Friendly': '🐾',
      'Popular': '🌟',
      'Low Maintenance': '🛡️',
      'Statement': '🎭',
      'Decorative': '🎨'
    }
    return icons[badge] || '🌱'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    const categoryProducts = groupedPlants[selectedCategory] || []
    return categoryProducts.map(product => ({
      ...product,
      wishlistButton: <WishlistButton product={{ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image 
      }} />
    }))
  }

  if (loading) {
    return (
      <motion.section 
        className="mt-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🌱 Trending Plants
        </h2>
        <div className="space-y-4">
          {[0, 1].map(rowIndex => (
            <div key={rowIndex} className="relative flex items-center">
              <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
                {[...Array(3)].map((_, index) => (
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
          ))}
        </div>
      </motion.section>
    )
  }

  if (products.length === 0) {
    return (
      <motion.section 
        className="mt-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🌱 Trending Plants
        </h2>
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">No trending plants available at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin.</p>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.section 
      className="mt-6 mb-6"
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
        🌱 Trending Plants
      </motion.h2>
      
      {/* Two-row slider */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map(([badge, categoryProducts], index) => (
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
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                    {categoryProducts.slice(0, 4).map((product, idx) => (
                      product.image ? (
                        <img
                          key={product.id}
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                        />
                      ) : (
                        <PlaceholderImage
                          key={product.id}
                          width={40}
                          height={40}
                          text="No Image"
                          className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                        />
                      )
                    ))}
                    {/* Fill empty slots if less than 4 products */}
                    {Array.from({ length: Math.max(0, 4 - categoryProducts.length) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                    ))}
                  </div>
                  {/* +X more badge */}
                  <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">
                    {categoryProducts.length} plant{categoryProducts.length !== 1 ? 's' : ''}
                  </div>
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
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🌱'}
          items={getModalItems()}
          onProductClick={(product) => {
            const categoryProducts = groupedPlants[selectedCategory || ''] || [];
            setModalProductList(categoryProducts);
            setModalProductIndex(categoryProducts.findIndex(p => p.id === product.id));
            setSelectedProduct(product);
            setModalOpen(false);
          }}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails
            product={selectedProduct}
            onClose={closeProductDetails}
            products={modalProductList}
            currentIndex={modalProductIndex ?? 0}
            onNavigate={direction => {
              if (!modalProductList.length || modalProductIndex === null) return;
              let newIndex = modalProductIndex;
              if (direction === 'prev' && modalProductIndex > 0) newIndex--;
              if (direction === 'next' && modalProductIndex < modalProductList.length - 1) newIndex++;
              setSelectedProduct(modalProductList[newIndex]);
              setModalProductIndex(newIndex);
            }}
          />
        </div>
      )}
    </motion.section>
  )
} 