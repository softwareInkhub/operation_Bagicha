'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'
import PlaceholderImage from './PlaceholderImage'
import { getProducts, getCategories } from '@/lib/firebase'

interface Product {
  id: string
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

interface Category {
  id: string
  name: string
  icon: string
}

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [modalProductList, setModalProductList] = useState<Product[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      
      setProducts(productsData as Product[])
      setCategories(categoriesData as Category[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getProductsByCategory = () => {
    const categoryGroups: { [key: string]: Product[] } = {}
    
    products.forEach(product => {
      if (!categoryGroups[product.category]) {
        categoryGroups[product.category] = []
      }
      categoryGroups[product.category].push(product)
    })
    
    return categoryGroups
  }

  const productsByCategory = getProductsByCategory()
  const categoryNames = Object.keys(productsByCategory)

  if (loading) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🛍️ Product Catalog
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

  if (categoryNames.length === 0) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🛍️ Product Catalog
        </h2>
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">No products available at the moment.</p>
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
        🛍️ Product Catalog
      </motion.h2>
      <div className="relative flex items-center">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
          {categoryNames.map((categoryName, index) => {
            const categoryProducts = productsByCategory[categoryName]
            const displayProducts = categoryProducts.slice(0, 4)
            
            return (
              <motion.div
                key={categoryName}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start"
                onClick={() => handleCardClick(categoryName)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* 2x2 product grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                  {displayProducts.map((product, idx) => (
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
                  {Array.from({ length: Math.max(0, 4 - displayProducts.length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                  ))}
                </div>
                
                {/* Product count badge */}
                <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">
                  {displayProducts.length} product{displayProducts.length !== 1 ? 's' : ''}
                </div>
                
                {/* Category name */}
                <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">
                  {categoryName}
                </div>
              </motion.div>
            )
          })}
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
          icon={getCategoryIcon(selectedCategory || '')}
          items={getModalItems()}
          onProductClick={(product) => {
            const categoryProducts = products.filter(p => p.category === selectedCategory);
            const actualProduct = products.find(p => p.name === product.name && p.category === selectedCategory);
            setModalProductList(categoryProducts);
            setModalProductIndex(categoryProducts.findIndex(p => p.id === actualProduct?.id));
            setSelectedProduct(actualProduct || null);
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
            onNavigate={(direction) => {
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