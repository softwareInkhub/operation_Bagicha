'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Star, Heart, ArrowRight, Clock, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import WishlistButton from './WishlistButton'
import ProductDetails from './ProductDetails'
import PlaceholderImage from './PlaceholderImage'
import { useRouter } from 'next/navigation'
import { getProducts } from '@/lib/firebase'
import ProductModal from './ProductModal'

interface NewProduct {
  id: string
  name: string
  category: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  daysSinceAdded?: number
  features: string[]
  description: string
  createdAt?: any
}

export default function NewArrivals() {
  const { cart, addToCart, removeFromCart } = useCart()
  const { isInWishlist } = useWishlist()
  const [newProducts, setNewProducts] = useState<NewProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<NewProduct | null>(null)
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null)
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [modalProductList, setModalProductList] = useState<NewProduct[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  useEffect(() => {
    loadNewArrivals()
  }, [])

  const loadNewArrivals = async () => {
    try {
      const allProducts = await getProducts() as NewProduct[]
      // Sort by creation date (if available) or just take the latest 8 products
      const sortedProducts = allProducts
        .map(product => ({
          ...product,
          daysSinceAdded: getDaysSinceAdded(product.createdAt)
        }))
        .sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt.seconds * 1000).getTime() - new Date(a.createdAt.seconds * 1000).getTime()
          }
          return (b.rating || 0) - (a.rating || 0)
        })
        .slice(0, 8)
      setNewProducts(sortedProducts)
    } catch (error) {
      console.error('Error loading new arrivals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDaysSinceAdded = (createdAt: any) => {
    if (!createdAt) return Math.floor(Math.random() * 7) + 1
    const createdDate = new Date(createdAt.seconds * 1000)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - createdDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const handleAddToCart = (product: NewProduct) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      category: product.category,
      description: product.description
    })
    setShowCartSuccess(product.name)
    setTimeout(() => setShowCartSuccess(null), 2000)
  }

  const handleProductClick = (product: NewProduct) => {
    setModalProductList(newProducts)
    setModalProductIndex(newProducts.findIndex(p => p.id === product.id))
    setSelectedProduct(product)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
    setModalProductList([])
    setModalProductIndex(null)
  }

  // --- HEADER (unchanged, as in the image) ---
  const header = (
    <div className="text-center mb-4 w-full flex flex-col items-center">
      <div className="max-w-xs w-full mx-auto">
        <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px] font-medium mb-2 mx-auto">
          <Clock className="w-3 h-3" />
          Fresh Arrivals
        </div>
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">New Arrivals</h2>
        <p className="text-gray-600 max-w-xs mx-auto text-xs md:text-sm">
          Discover our latest additions - from rare plants to innovative gardening solutions
        </p>
      </div>
    </div>
  )

  // --- LOADING STATE ---
  if (loading) {
    return (
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {header}
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

  // --- EMPTY STATE ---
  if (newProducts.length === 0) {
    return (
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {header}
          <div className="text-center py-8">
            <p className="text-gray-500">No new arrivals available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin.</p>
        </div>
      </motion.section>
    )
  }

  // --- MAIN SECTION: Horizontally scrollable cards like BestsellerSection ---
  return (
      <motion.section 
        className="py-2 bg-gradient-to-br from-green-50 to-emerald-50"
        initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
      {header}
      <div className="relative flex items-center">
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
          {/* Group new arrivals by category, like BestsellerSection */}
          {(() => {
            // Group newProducts by category
            const categoryGroups: { [key: string]: NewProduct[] } = {}
            newProducts.forEach(product => {
              if (!categoryGroups[product.category]) {
                categoryGroups[product.category] = []
              }
              categoryGroups[product.category].push(product)
            })
            return Object.entries(categoryGroups).map(([category, items], index) => (
          <motion.div 
                key={category}
                  initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-1.5 md:p-2 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[110px] max-w-[120px] md:min-w-[120px] md:max-w-[140px] mx-auto snap-start"
                onClick={() => { setSelectedCategory(category); setShowCategoryModal(true); }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* 2x2 image grid */}
                <div className="grid grid-cols-2 grid-rows-2 gap-0.5 w-full h-24 md:h-28 mb-1.5">
                  {items.slice(0, 4).map((prod, idx) => (
                    prod.image ? (
                      <img
                        key={prod.id}
                        src={prod.image}
                        alt={prod.name}
                        className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    ) : (
                      <PlaceholderImage
                        key={prod.id}
                        width={40}
                        height={40}
                        text="No Image"
                        className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    )
                  ))}
                  {/* Fill empty slots if less than 4 products */}
                  {Array.from({ length: Math.max(0, 4 - items.length) }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                      ))}
                    </div>
                {/* +X new badge */}
                <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1 py-0.5 rounded-full shadow-sm">
                  {items.length} new
                      </div>
                {/* Category name */}
                <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0">{category}</div>
                </motion.div>
            ))
          })()}
        </div>
      </div>
      {/* Success Toast */}
      <AnimatePresence>
        {showCartSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            Added {showCartSuccess} to cart!
          </motion.div>
        )}
      </AnimatePresence>
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
      {/* Category Modal for New Arrivals */}
      {showCategoryModal && selectedCategory && (
        <ProductModal
          isOpen={showCategoryModal}
          onClose={() => { setShowCategoryModal(false); setSelectedCategory(null); }}
          title={selectedCategory}
          icon={''}
          items={newProducts.filter(p => p.category === selectedCategory).map(product => ({
            ...product,
            wishlistButton: <WishlistButton product={product} />,
            onAddToCart: (e: React.MouseEvent) => { e.stopPropagation(); handleAddToCart(product); }
          }))}
          onProductClick={product => {
            const found = newProducts.find(p => p.name === product.name);
            if (found) {
              setModalProductList(newProducts.filter(p => p.category === selectedCategory));
              setModalProductIndex(newProducts.filter(p => p.category === selectedCategory).findIndex(p => p.id === found.id));
              setSelectedProduct(found);
            }
            setShowCategoryModal(false);
          }}
        />
      )}
    </motion.section>
  )
} 