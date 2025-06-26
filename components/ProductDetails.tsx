import { ShoppingCart, Star, Heart, X, Truck, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useState } from 'react'

interface ProductItem {
  id?: number
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
}

interface ProductDetailsProps {
  product: ProductItem
  onClose?: () => void
}

export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
  const { cart, addToCart, removeFromCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)

  const inStock = product.inStock !== false
  const delivery = product.deliveryEstimate || 'FREE delivery by Tomorrow'
  const brand = product.brand || 'Bagicha'
  const mrp = product.mrp || Math.round(product.price * 1.3)
  const discount = Math.round(((mrp - product.price) / mrp) * 100)
  const productId = product.id || Math.random() // fallback ID if not provided

  const handleAddToCart = () => {
    if (!inStock) return
    
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
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
      <div className="bg-white rounded-lg shadow-xl p-3 w-full max-w-xs mx-auto font-sans relative">
        {/* Close button */}
        {onClose && (
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 z-10 transition-colors"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
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

        {/* Product Image */}
        <div className="w-24 h-24 rounded-lg bg-gray-50 flex items-center justify-center mb-2 mx-auto border border-gray-100">
          <img src={product.image} alt={product.name} className="w-20 h-20 object-contain" />
        </div>

        {/* Product Name */}
        <h2 className="text-base font-bold text-gray-900 mb-1.5 text-center leading-tight">{product.name}</h2>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mb-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="text-center mb-2">
          <div className="text-xl font-bold text-gray-900">₹{product.price}</div>
          <div className="flex items-center justify-center gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500 line-through">M.R.P: ₹{mrp}</span>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{discount}% off</span>
          </div>
        </div>

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
            <h3 className="font-semibold text-gray-900 mb-0.5 text-xs">About this item:</h3>
            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">{product.description}</p>
          </div>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 mb-0.5 text-xs">Key Features:</h3>
            <ul className="space-y-0.5">
              {product.features.slice(0, 2).map((feature, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-green-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Additional Details */}
        {product.details && product.details.length > 0 && (
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 mb-0.5 text-xs">Care Instructions:</h3>
            <ul className="space-y-0.5">
              {product.details.slice(0, 1).map((detail, index) => (
                <li key={index} className="flex items-start gap-1 text-xs text-gray-600">
                  <div className="w-1 h-1 bg-blue-500 rounded-full mt-1 flex-shrink-0"></div>
                  <span className="line-clamp-1">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Brand */}
        <div className="text-xs text-gray-500 mb-3 text-center">
          Brand: <span className="font-semibold text-gray-700">{brand}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 mb-1.5">
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

        {/* Wishlist Button */}
        <motion.button
          className={`w-full font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-1 shadow-sm text-xs ${
            isInWishlist(productId) 
              ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
          onClick={handleWishlistToggle}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <Heart className={`w-3 h-3 ${isInWishlist(productId) ? 'fill-red-500' : ''}`} />
          {isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </motion.button>
      </div>
    </>
  )
} 