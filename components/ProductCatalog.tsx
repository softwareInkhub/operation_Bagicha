'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, Star, Heart, Filter, Search, Grid, List, 
  ChevronDown, X, SlidersHorizontal, SortAsc, SortDesc 
} from 'lucide-react'
import { useCart } from '../context/CartContext'

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
  }
]

const categories = ['All', 'Indoor Plants', 'Tools', 'Soil & Fertilizer', 'Pots & Planters', 'Seeds']
const subcategories = ['Tropical', 'Succulent', 'Cutting', 'Potting Mix', 'Ceramic', 'Vegetables']
const priceRanges = [
  { label: 'Under ₹100', min: 0, max: 100 },
  { label: '₹100 - ₹500', min: 100, max: 500 },
  { label: '₹500 - ₹1000', min: 500, max: 1000 },
  { label: 'Above ₹1000', min: 1000, max: Infinity }
]

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest'

export default function ProductCatalog() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedSubcategory, setSelectedSubcategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [wishlist, setWishlist] = useState<number[]>([])
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [filters, setFilters] = useState({
    inStock: false,
    fastDelivery: false,
    organic: false
  })

  const { addToCart } = useCart()

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Category filter
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
      
      // Subcategory filter
      const matchesSubcategory = selectedSubcategory === 'All' || product.subcategory === selectedSubcategory
      
      // Price range filter
      const priceRange = priceRanges[selectedPriceRange!]
      const matchesPrice = !selectedPriceRange || (product.price >= priceRange.min && product.price <= priceRange.max)
      
      // Additional filters
      const matchesStock = !filters.inStock || product.inStock
      const matchesDelivery = !filters.fastDelivery || product.fastDelivery
      const matchesOrganic = !filters.organic || product.organic
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice && 
             matchesStock && matchesDelivery && matchesOrganic
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating-desc':
          return b.rating - a.rating
        case 'newest':
          return b.id - a.id
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, selectedCategory, selectedSubcategory, selectedPriceRange, sortBy, filters])

  const toggleWishlist = (id: number) => {
    setWishlist(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    })
    
    setToastMessage(`${product.name} added to cart!`)
    setShowToast(true)
    
    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedSubcategory('All')
    setSelectedPriceRange(null)
    setFilters({ inStock: false, fastDelivery: false, organic: false })
  }

  return (
    <motion.section 
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
            <p className="text-gray-600 mt-1">Discover our complete collection of gardening essentials</p>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
            </motion.button>
            <motion.button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowFilters(!showFilters)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search"
            />
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="input-field pr-10"
            >
              <option value="newest">Newest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price Low to High</option>
              <option value="price-desc">Price High to Low</option>
              <option value="rating-desc">Highest Rated</option>
            </select>
            <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Clear All
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="input-field"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Subcategory Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="input-field"
                  >
                    <option value="All">All</option>
                    {subcategories.map(subcategory => (
                      <option key={subcategory} value={subcategory}>{subcategory}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={selectedPriceRange || ''}
                    onChange={(e) => setSelectedPriceRange(e.target.value ? Number(e.target.value) : null)}
                    className="input-field"
                  >
                    <option value="">All Prices</option>
                    {priceRanges.map((range, index) => (
                      <option key={index} value={index}>{range.label}</option>
                    ))}
                  </select>
                </div>

                {/* Additional Filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.fastDelivery}
                        onChange={(e) => setFilters(prev => ({ ...prev, fastDelivery: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Fast Delivery</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.organic}
                        onChange={(e) => setFilters(prev => ({ ...prev, organic: e.target.checked }))}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Organic</span>
                    </label>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {Object.values(filters).some(Boolean) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.inStock && <span className="badge badge-success">In Stock</span>}
              {filters.fastDelivery && <span className="badge badge-accent">Fast Delivery</span>}
              {filters.organic && <span className="badge badge-primary">Organic</span>}
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        <div className={viewMode === 'grid' ? 'grid-responsive' : 'space-y-4'}>
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={viewMode === 'grid' ? 'card card-hover' : 'card flex flex-row'}
              >
                {/* Product Image */}
                <div className={viewMode === 'grid' ? 'relative h-48' : 'relative w-32 h-32 flex-shrink-0'}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Badge */}
                  {product.badge && (
                    <div className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs font-semibold px-2 py-1 rounded-full`}>
                      {product.badge}
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <motion.button
                    className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    onClick={() => toggleWishlist(product.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart 
                      className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
                    />
                  </motion.button>
                  
                  {/* Discount Badge */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute bottom-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Product Content */}
                <div className={viewMode === 'grid' ? 'p-4' : 'p-4 flex-1'}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{product.rating}</span>
                    <span className="text-xs text-gray-400">({product.reviews})</span>
                  </div>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <span 
                        key={idx}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-green-600">₹{product.price}</span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                    )}
                  </div>
                  
                  {/* Add to Cart Button */}
                  <motion.button
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => handleAddToCart(product)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div 
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <button
              onClick={clearFilters}
              className="btn-outline"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
} 