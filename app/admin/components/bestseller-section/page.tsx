'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiStar,
  FiSave,
  FiRefreshCw,
  FiArrowLeft,
  FiTrendingUp,
  FiEye,
  FiEdit3,
  FiGrid,
  FiSettings
} from 'react-icons/fi'
import { getProducts, getCategories } from '@/lib/firebase'

interface BestsellerConfig {
  minRating: number
  minReviews: number
  maxProductsPerCategory: number
  showCategoryIcons: boolean
  showRatings: boolean
  showReviewCount: boolean
  showBadges: boolean
  autoUpdate: boolean
  updateInterval: number
  sortBy: 'rating' | 'reviews' | 'sales'
  excludeCategories: string[]
  featuredOnly: boolean
  showEmptyCategories: boolean
}

export default function BestsellerSectionConfig() {
  const [config, setConfig] = useState<BestsellerConfig>({
    minRating: 4.0,
    minReviews: 5,
    maxProductsPerCategory: 6,
    showCategoryIcons: true,
    showRatings: true,
    showReviewCount: true,
    showBadges: true,
    autoUpdate: true,
    updateInterval: 60,
    sortBy: 'rating',
    excludeCategories: [],
    featuredOnly: false,
    showEmptyCategories: false
  })
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState<any[]>([])
  const [stats, setStats] = useState({
    qualifyingProducts: 0,
    categoriesWithBestsellers: 0,
    averageRating: 0,
    lastUpdated: ''
  })

  useEffect(() => {
    loadData()
    loadConfig()
  }, [])

  useEffect(() => {
    generatePreview()
  }, [config, products, categories])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      
      calculateStats(productsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (productsData: any[]) => {
    const qualifying = productsData.filter(p => 
      (p.rating || 0) >= config.minRating && 
      (p.reviews || 0) >= config.minReviews
    )
    
    const categoriesWithProducts = new Set(
      qualifying.map(p => p.category)
    ).size
    
    const avgRating = qualifying.length > 0 
      ? qualifying.reduce((sum, p) => sum + (p.rating || 0), 0) / qualifying.length 
      : 0

    setStats({
      qualifyingProducts: qualifying.length,
      categoriesWithBestsellers: categoriesWithProducts,
      averageRating: Number(avgRating.toFixed(1)),
      lastUpdated: new Date().toLocaleString()
    })
  }

  const generatePreview = () => {
    if (!products.length || !categories.length) return

    const filteredCategories = categories.filter(cat => 
      !config.excludeCategories.includes(cat.id || cat.name)
    )

    const preview = filteredCategories.map(category => {
      const categoryProducts = products.filter(p => 
        p.category === category.name &&
        (p.rating || 0) >= config.minRating &&
        (p.reviews || 0) >= config.minReviews
      )

      let sortedProducts = [...categoryProducts]
      
      switch (config.sortBy) {
        case 'rating':
          sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0))
          break
        case 'reviews':
          sortedProducts.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
          break
        case 'sales':
          sortedProducts.sort((a, b) => (b.sales || 0) - (a.sales || 0))
          break
      }

      return {
        category: category.name,
        products: sortedProducts.slice(0, config.maxProductsPerCategory),
        totalQualifying: categoryProducts.length
      }
    }).filter(item => 
      config.showEmptyCategories || item.products.length > 0
    )

    setPreview(preview)
  }

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('bestsellerSectionConfig')
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig)
      setConfig(prev => ({ ...prev, ...parsed }))
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      localStorage.setItem('bestsellerSectionConfig', JSON.stringify(config))
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (key: keyof BestsellerConfig, value: any) => {
    const newConfig = { ...config, [key]: value }
    setConfig(newConfig)
    calculateStats(products)
  }

  const toggleCategoryExclusion = (categoryId: string) => {
    const isExcluded = config.excludeCategories.includes(categoryId)
    if (isExcluded) {
      updateConfig('excludeCategories', config.excludeCategories.filter(id => id !== categoryId))
    } else {
      updateConfig('excludeCategories', [...config.excludeCategories, categoryId])
    }
  }

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
        <div className="flex items-center space-x-4">
          <a 
            href="/admin/components"
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiArrowLeft size={20} />
          </a>
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <FiStar className="text-yellow-600" size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Bestseller Section</h1>
            </div>
            <p className="text-gray-600">Configure bestselling products display</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadData}
            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw size={20} />
            <span>Refresh</span>
          </button>
          <button
            onClick={saveConfig}
            disabled={saving}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiSave size={20} />
            <span>{saving ? 'Saving...' : 'Save Config'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Qualifying Products', value: stats.qualifyingProducts, icon: FiStar, color: 'bg-yellow-500' },
          { label: 'Categories', value: stats.categoriesWithBestsellers, icon: FiGrid, color: 'bg-blue-500' },
          { label: 'Average Rating', value: stats.averageRating, icon: FiTrendingUp, color: 'bg-green-500' },
          { label: 'Preview Items', value: preview.reduce((sum, cat) => sum + cat.products.length, 0), icon: FiEye, color: 'bg-purple-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Criteria Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Bestseller Criteria</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating ({config.minRating} stars)
              </label>
              <input
                type="range"
                min="3.0"
                max="5.0"
                step="0.1"
                value={config.minRating}
                onChange={(e) => updateConfig('minRating', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>3.0</span>
                <span>5.0</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Reviews ({config.minReviews})
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={config.minReviews}
                onChange={(e) => updateConfig('minReviews', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>50</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Products per Category ({config.maxProductsPerCategory})
              </label>
              <input
                type="range"
                min="2"
                max="12"
                value={config.maxProductsPerCategory}
                onChange={(e) => updateConfig('maxProductsPerCategory', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2</span>
                <span>12</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Products By</label>
              <select
                value={config.sortBy}
                onChange={(e) => updateConfig('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="rating">Highest Rating</option>
                <option value="reviews">Most Reviews</option>
                <option value="sales">Best Sales</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Display Settings</h2>
          
          <div className="space-y-6">
            {[
              { key: 'showCategoryIcons', label: 'Category Icons', desc: 'Show icons for each category' },
              { key: 'showRatings', label: 'Product Ratings', desc: 'Display star ratings' },
              { key: 'showReviewCount', label: 'Review Count', desc: 'Show number of reviews' },
              { key: 'showBadges', label: 'Product Badges', desc: 'Show bestseller badges' },
              { key: 'featuredOnly', label: 'Featured Only', desc: 'Show only featured products' },
              { key: 'showEmptyCategories', label: 'Empty Categories', desc: 'Show categories with no qualifying products' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
                <button
                  onClick={() => updateConfig(setting.key as keyof BestsellerConfig, !config[setting.key as keyof BestsellerConfig])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config[setting.key as keyof BestsellerConfig] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config[setting.key as keyof BestsellerConfig] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">Auto Update</h3>
                  <p className="text-sm text-gray-600">Automatically refresh bestsellers</p>
                </div>
                <button
                  onClick={() => updateConfig('autoUpdate', !config.autoUpdate)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config.autoUpdate ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config.autoUpdate ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {config.autoUpdate && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Interval (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={config.updateInterval}
                    onChange={(e) => updateConfig('updateInterval', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Exclusions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const categoryId = category.id || category.name
            const isExcluded = config.excludeCategories.includes(categoryId)
            const qualifyingCount = products.filter(p => 
              p.category === category.name &&
              (p.rating || 0) >= config.minRating &&
              (p.reviews || 0) >= config.minReviews
            ).length
            
            return (
              <div
                key={categoryId}
                className={`p-4 rounded-lg border ${
                  isExcluded ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <button
                    onClick={() => toggleCategoryExclusion(categoryId)}
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      isExcluded 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {isExcluded ? 'Excluded' : 'Included'}
                  </button>
                </div>
                <p className="text-sm text-gray-600">{qualifyingCount} qualifying products</p>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
        
        <div className="space-y-6">
          {preview.slice(0, 3).map((categoryData) => (
            <div key={categoryData.category} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{categoryData.category}</h3>
                <span className="text-sm text-gray-600">
                  {categoryData.products.length} of {categoryData.totalQualifying} shown
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryData.products.slice(0, 3).map((product: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-600">
                      {config.showRatings && <span>★ {product.rating || 0}</span>}
                      {config.showReviewCount && <span>({product.reviews || 0})</span>}
                    </div>
                    <p className="text-sm font-semibold text-green-600 mt-1">₹{product.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {preview.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiStar className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>No products match the current criteria</p>
              <p className="text-sm">Try adjusting the minimum rating or review requirements</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
} 