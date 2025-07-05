import { ShoppingCart, Star, Heart, X, Truck, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useState } from 'react'

interface ProductItem {
  id?: string
  name: string
  image: string
  price: number
  mrp?: number
  rating: number
  reviews: number
  description?: string
  features?: string[]
  brand?: string
  inStock?: boolean
  deliveryEstimate?: string
  details?: string[]
  category?: string
  badge?: string
}

interface ProductDetailsProps {
  product: ProductItem
  onClose?: () => void
  products?: ProductItem[]
  currentIndex?: number
  onNavigate?: (direction: 'prev' | 'next') => void
}

export default function ProductDetails({ product, onClose, products, currentIndex, onNavigate }: ProductDetailsProps) {
  const { cart, addToCart, removeFromCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [tab, setTab] = useState<'about' | 'features' | 'care'>('about')

  const inStock = product.inStock !== false
  const delivery = product.deliveryEstimate || 'FREE delivery by Tomorrow'
  const brand = product.brand || 'Bagicha'
  const mrp = product.mrp || Math.round(product.price * 1.3)
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const productId = product.id || Math.random().toString() // fallback ID if not provided

  const handleAddToCart = () => {
    if (!inStock) return
    
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1,
      category: product.category,
      description: product.description
    })
    
    setShowCartSuccess(true)
    setTimeout(() => setShowCartSuccess(false), 2000)
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId)
      setShowWishlistSuccess(false)
    } else {
      addToWishlist({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image
      })
      setShowWishlistSuccess(true)
      setTimeout(() => setShowWishlistSuccess(false), 2000)
    }
  }

  const handleQty = (name: string, delta: number) => {
    const item = cart.find(i => i.name === name)
    if (item) {
      const newQty = Math.max(1, item.qty + delta)
      if (newQty === 1) {
        removeFromCart(name)
      } else {
        addToCart({ ...item, qty: newQty })
      }
    }
  }
  
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <>
      <div className="bg-white rounded-lg shadow-xl p-0 w-full max-w-xs mx-auto font-sans relative flex flex-col overflow-hidden">
        {/* Close button */}
        {onClose && (
          <button
            className="absolute top-2 right-2 text-white hover:text-gray-200 p-1 rounded-full hover:bg-black/20 z-50 transition-colors bg-black/30"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Success Messages */}
        {showCartSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs font-semibold z-20"
          >
            ✓ Added to cart!
          </motion.div>
        )}

        {showWishlistSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-2 left-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-xs font-semibold z-20"
          >
            ✓ Added to wishlist!
          </motion.div>
        )}

        {/* Full-Image Hero Section */}
        <div className="relative w-full h-auto bg-gray-50 flex items-center justify-center overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
          {/* Left Arrow (on image, shifted up) */}
          {onNavigate && (
            <button
              className="absolute left-2 top-1/3 bg-white/60 hover:bg-green-100/80 rounded-full w-8 h-8 flex items-center justify-center shadow border border-green-100 z-[9999] pointer-events-auto transition"
              onClick={() => onNavigate('prev')}
              aria-label="Previous product"
            >
              <ChevronLeft className="w-4 h-4 text-green-600" />
            </button>
          )}
          {/* Right Arrow (on image, shifted up) */}
          {onNavigate && (
            <button
              className="absolute right-2 top-1/3 bg-white/60 hover:bg-green-100/80 rounded-full w-8 h-8 flex items-center justify-center shadow border border-green-100 z-[9999] pointer-events-auto transition"
              onClick={() => onNavigate('next')}
              aria-label="Next product"
            >
              <ChevronRight className="w-4 h-4 text-green-600" />
            </button>
          )}
          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent px-4 pt-8 pb-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              {product.badge && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{product.badge}</span>
              )}
              <span className="text-lg font-bold text-white text-center leading-tight drop-shadow">{product.name}</span>
        </div>
            <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
              <span className="text-xs text-gray-100">{product.rating} ({product.reviews})</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-green-300 drop-shadow">₹{product.price}</span>
              <span className="text-xs text-gray-200 line-through">₹{mrp}</span>
              <span className="text-xs font-semibold text-green-100 bg-green-600/60 px-1.5 py-0.5 rounded-full">{discount}% off</span>
            </div>
            {/* Wishlist icon at bottom of image */}
            <div className="absolute bottom-2 right-2">
              <motion.button
                className={`p-2 rounded-full shadow-lg transition-colors ${
                  isInWishlist(productId) 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white/80 text-gray-700 hover:bg-white'
                }`}
                onClick={handleWishlistToggle}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart className={`w-4 h-4 ${isInWishlist(productId) ? 'fill-white' : ''}`} />
              </motion.button>
        </div>
          </div>
        </div>
        {/* Details Section */}
        <div className="px-4 pt-4 pb-2 flex-1 flex flex-col">
        {/* Stock & Delivery */}
        <div className="flex flex-col gap-1 mb-2">
          <div className="flex items-center gap-1.5 text-xs">
            {inStock ? (
              <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
            )}
            <span className={inStock ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
              {inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Truck className="w-3 h-3" />
            <span>{delivery}</span>
          </div>
        </div>
        {/* About this item */}
        {product.description && (
          <div className="mb-2">
              <h3 className="font-semibold text-gray-900 mb-1 text-xs">About this item:</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{product.description}</p>
          </div>
        )}
        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-2">
              <h3 className="font-semibold text-gray-900 mb-1 text-xs">Key Features:</h3>
            <ul className="space-y-0.5">
                {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                    <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
          {/* Care Instructions */}
        {product.details && product.details.length > 0 && (
          <div className="mb-2">
              <h3 className="font-semibold text-gray-900 mb-1 text-xs">Care Instructions:</h3>
            <ul className="space-y-0.5">
                {product.details.map((detail, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                    <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Brand */}
        <div className="text-xs text-gray-500 mb-3 text-center">
          Brand: <span className="font-semibold text-gray-700">{brand}</span>
        </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-1.5 mb-1.5 px-4">
          <motion.button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1 shadow-md disabled:opacity-60 disabled:cursor-not-allowed text-xs"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!inStock}
          >
            <ShoppingCart className="w-3 h-3" />
            Add to Cart
          </motion.button>
          <motion.button
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1 shadow-md text-xs"
            onClick={handleAddToCart}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={!inStock}
          >
            Buy Now
          </motion.button>
        </div>

      </div>
    </>
  )
} 