'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch, 
  FiFilter,
  FiEye,
  FiX,
  FiSave,
  FiUpload,
  FiStar,
  FiPackage,
  FiTruck,
  FiShield,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi'
import { getProducts, addProduct, updateProduct, deleteProduct, getCategories, createSampleProducts, createSampleSearchData } from '@/lib/firebase'
import ImageUpload from '@/components/ImageUpload'
import PlaceholderImage from '@/components/PlaceholderImage'

interface Product {
  id?: string
  name: string
  category: string
  subcategory?: string
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
  createdAt?: any
  updatedAt?: any
}

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [imageUploadError, setImageUploadError] = useState<string>('')
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([])

  const [productForm, setProductForm] = useState<Product>({
    name: '',
    category: '',
    subcategory: '',
    price: 0,
    originalPrice: 0,
    rating: 0,
    reviews: 0,
    image: '',
    badge: '',
    badgeColor: 'bg-green-500',
    inStock: true,
    fastDelivery: false,
    organic: false,
    features: [],
    description: ''
  })

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
      setCategories(categoriesData as any[])
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    setProductForm({
      name: '',
      category: '',
      subcategory: '',
      price: 0,
      originalPrice: 0,
      rating: 0,
      reviews: 0,
      image: '',
      badge: '',
      badgeColor: 'bg-green-500',
      inStock: true,
      fastDelivery: false,
      organic: false,
      features: [],
      description: ''
    })
    setEditingProduct(null)
    setAvailableSubcategories([])
    setImageUploadError('')
    setShowAddModal(true)
  }

  const handleCategoryChange = (categoryName: string) => {
    setProductForm({ ...productForm, category: categoryName, subcategory: '' })
    
    // Find the selected category and update subcategories
    const selectedCategory = categories.find(cat => cat.name === categoryName)
    if (selectedCategory && selectedCategory.subcategories) {
      setAvailableSubcategories(selectedCategory.subcategories)
    } else {
      setAvailableSubcategories([])
    }
  }

  const handleEditProduct = (product: Product) => {
    setProductForm(product)
    setEditingProduct(product)
    
    // Load subcategories for the selected category
    const selectedCategory = categories.find(cat => cat.name === product.category)
    if (selectedCategory && selectedCategory.subcategories) {
      setAvailableSubcategories(selectedCategory.subcategories)
    } else {
      setAvailableSubcategories([])
    }
    
    setImageUploadError('')
    setShowAddModal(true)
  }

  const handleSaveProduct = async () => {
    try {
      // Validation
      if (!productForm.name.trim()) {
        alert('Product name is required')
        return
      }
      if (!productForm.category) {
        alert('Please select a category')
        return
      }
      if (!productForm.image) {
        alert('Please upload a product image')
        return
      }
      
      // Validate category-subcategory relationship
      const selectedCategory = categories.find(cat => cat.name === productForm.category)
      if (selectedCategory && selectedCategory.subcategories && selectedCategory.subcategories.length > 0) {
        if (!productForm.subcategory) {
          alert('Please select a subcategory for this category')
          return
        }
        if (!selectedCategory.subcategories.includes(productForm.subcategory)) {
          alert('Selected subcategory is not valid for this category')
          return
        }
      }

      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, productForm)
      } else {
        await addProduct(productForm)
      }
      await loadData()
      setShowAddModal(false)
      setEditingProduct(null)
      setAvailableSubcategories([])
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId)
      await loadData()
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting product:', error)
    }
  }

  const handleFeatureAdd = (feature: string) => {
    if (feature.trim() && !productForm.features.includes(feature.trim())) {
      setProductForm({
        ...productForm,
        features: [...productForm.features, feature.trim()]
      })
    }
  }

  const handleFeatureRemove = (index: number) => {
    setProductForm({
      ...productForm,
      features: productForm.features.filter((_, i) => i !== index)
    })
  }

  const handleCreateSampleProducts = async () => {
    if (confirm('This will create sample products with proper category-subcategory relationships. Continue?')) {
      try {
        setLoading(true)
        const success = await createSampleProducts()
        if (success) {
          alert('Sample products created successfully!')
          await loadData()
        } else {
          alert('Failed to create sample products.')
        }
      } catch (error) {
        console.error('Error creating sample products:', error)
        alert('Error creating sample products. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleCreateSampleSearchData = async () => {
    if (confirm('This will create sample search suggestions, recent searches, and trending searches. Continue?')) {
      try {
        setLoading(true)
        const success = await createSampleSearchData()
        if (success) {
          alert('Sample search data created successfully!')
        } else {
          alert('Failed to create sample search data.')
        }
      } catch (error) {
        console.error('Error creating sample search data:', error)
        alert('Error creating sample search data. Please try again.')
      } finally {
        setLoading(false)
      }
    }
  }

  const badgeColors = [
    { label: 'Green', value: 'bg-green-500' },
    { label: 'Blue', value: 'bg-blue-500' },
    { label: 'Red', value: 'bg-red-500' },
    { label: 'Yellow', value: 'bg-yellow-500' },
    { label: 'Purple', value: 'bg-purple-500' },
    { label: 'Orange', value: 'bg-orange-500' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage your product catalog</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
          <button
            onClick={handleCreateSampleProducts}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiPackage size={20} />
            <span>Create Sample Products</span>
          </button>
          <button
            onClick={handleCreateSampleSearchData}
            className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiSearch size={20} />
            <span>Create Search Data</span>
          </button>
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiPlus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[160px]"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {filteredProducts.length} products
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="relative mb-4">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg bg-gray-100"
                />
              ) : (
                <PlaceholderImage
                  width={200}
                  height={200}
                  text="No Image"
                  className="w-full h-32 object-cover rounded-lg bg-gray-100"
                />
              )}
              {product.badge && (
                <span className={`absolute top-2 left-2 ${product.badgeColor} text-white text-xs px-2 py-1 rounded-full font-medium`}>
                  {product.badge}
                </span>
              )}
              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditProduct(product)}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FiEdit2 className="text-gray-600" size={14} />
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(product.id!)}
                  className="p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FiTrash2 className="text-red-500" size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
              <div className="text-xs text-gray-600">
                <p className="font-medium">{product.category}</p>
                {product.subcategory && (
                  <p className="text-gray-500">• {product.subcategory}</p>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                <FiStar className="text-yellow-400 fill-current" size={12} />
                <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">₹{product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className={`px-2 py-1 rounded-full ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.organic && (
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">Organic</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <FiPackage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No products found</p>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                    <select
                      value={productForm.subcategory}
                      onChange={(e) => setProductForm({ ...productForm, subcategory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      disabled={!productForm.category || availableSubcategories.length === 0}
                    >
                      <option value="">
                        {!productForm.category 
                          ? 'Select category first' 
                          : availableSubcategories.length === 0 
                            ? 'No subcategories available' 
                            : 'Select subcategory'
                        }
                      </option>
                      {availableSubcategories.map((subcategory, index) => (
                        <option key={index} value={subcategory}>
                          {subcategory}
                        </option>
                      ))}
                    </select>
                    {productForm.category && availableSubcategories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        This category has no subcategories defined. You can add them in the Categories section.
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <ImageUpload
                      value={productForm.image}
                      onChange={(url) => setProductForm({ ...productForm, image: url })}
                      onError={(error) => setImageUploadError(error)}
                      folder="products"
                      placeholder="Upload product image"
                      className="w-full"
                    />
                    {imageUploadError && (
                      <p className="text-red-500 text-sm mt-2">{imageUploadError}</p>
                    )}
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      value={productForm.originalPrice || ''}
                      onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Rating & Reviews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={productForm.rating}
                      onChange={(e) => setProductForm({ ...productForm, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="4.5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Number of Reviews</label>
                    <input
                      type="number"
                      value={productForm.reviews}
                      onChange={(e) => setProductForm({ ...productForm, reviews: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Badge */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge (Optional)</label>
                    <input
                      type="text"
                      value={productForm.badge || ''}
                      onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      placeholder="e.g., Trending, Best Seller"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
                    <select
                      value={productForm.badgeColor}
                      onChange={(e) => setProductForm({ ...productForm, badgeColor: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    >
                      {badgeColors.map((color) => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productForm.inStock}
                      onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productForm.fastDelivery}
                      onChange={(e) => setProductForm({ ...productForm, fastDelivery: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Fast Delivery</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={productForm.organic}
                      onChange={(e) => setProductForm({ ...productForm, organic: e.target.checked })}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Organic</span>
                  </label>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="space-y-2">
                    {productForm.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">{feature}</span>
                        <button
                          onClick={() => handleFeatureRemove(index)}
                          className="p-1 text-red-500 hover:text-red-700"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Add a feature"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleFeatureAdd((e.target as HTMLInputElement).value)
                            ;(e.target as HTMLInputElement).value = ''
                          }
                        }}
                      />
                      <button
                        onClick={(e) => {
                          const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement
                          handleFeatureAdd(input.value)
                          input.value = ''
                        }}
                        className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    placeholder="Enter product description"
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                  >
                    <FiSave size={16} />
                    <span>{editingProduct ? 'Update' : 'Create'} Product</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <FiTrash2 className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Product</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(showDeleteConfirm)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 