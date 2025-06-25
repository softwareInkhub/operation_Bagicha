import { ShoppingCart, Star, Heart, X, Truck, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
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
  const { addToCart } = useCart()
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const [showCartSuccess, setShowCartSuccess] = useState(false)
  const [showWishlistSuccess, setShowWishlistSuccess] = useState(false)

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

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-auto font-sans relative">
      {/* Close button */}
      {onClose && (
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 z-10"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Success Messages */}
      {showCartSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold z-20"
        >
          ✓ Added to cart!
        </motion.div>
      )}

      {showWishlistSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-4 left-4 bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-semibold z-20"
        >
          ✓ Added to wishlist!
        </motion.div>
      )}

      {/* Product Image */}
      <div className="w-40 h-40 rounded-xl bg-gray-50 flex items-center justify-center mb-4 mx-auto border border-gray-100">
        <img src={product.image} alt={product.name} className="w-32 h-32 object-contain" />
      </div>

      {/* Product Name */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">{product.name}</h2>

      {/* Rating */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
          ))}
        </div>
        <span className="text-sm text-gray-600">{product.rating} out of 5</span>
      </div>

      {/* Reviews */}
      <div className="text-sm text-gray-500 text-center mb-4">
        ({product.reviews} customer reviews)
      </div>

      {/* Price */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900">₹{product.price}</div>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-lg text-gray-500 line-through">M.R.P: ₹{mrp}</span>
          <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">({discount}% off)</span>
        </div>
      </div>

      {/* Stock & Delivery */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-2 text-sm">
          {inStock ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : (
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          )}
          <span className={inStock ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Truck className="w-4 h-4" />
          <span>{delivery}</span>
        </div>
      </div>

      {/* About this item */}
      {product.description && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">About this item:</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Features */}
      {product.features && product.features.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
          <ul className="space-y-1">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Additional Details */}
      {product.details && product.details.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2">Care Instructions:</h3>
          <ul className="space-y-1">
            {product.details.map((detail, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <span>{detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Brand */}
      <div className="text-sm text-gray-500 mb-6 text-center">
        Brand: <span className="font-semibold text-gray-700">{brand}</span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!inStock}
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </motion.button>
        <motion.button
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg"
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
        className={`w-full mt-3 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow ${
          isInWishlist(productId) 
            ? 'bg-red-50 border border-red-200 text-red-600 hover:bg-red-100' 
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
        onClick={handleWishlistToggle}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Heart className={`w-5 h-5 ${isInWishlist(productId) ? 'fill-red-500' : ''}`} />
        {isInWishlist(productId) ? 'Remove from Wishlist' : 'Add to Wishlist'}
      </motion.button>
    </div>
  )
} 