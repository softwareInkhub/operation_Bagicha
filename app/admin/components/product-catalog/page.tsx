'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiBox,
  FiGrid,
  FiSave,
  FiRefreshCw,
  FiEye,
  FiEyeOff,
  FiSettings,
  FiArrowLeft,
  FiToggleLeft,
  FiToggleRight,
  FiPlus,
  FiEdit3,
  FiTrash2
} from 'react-icons/fi'
import { getProducts, getCategories } from '@/lib/firebase'

interface CatalogConfig {
  showCategoryTabs: boolean
  defaultView: 'grid' | 'list'
  productsPerPage: number
  showFilters: boolean
  showSortOptions: boolean
  showPriceRange: boolean
  showRatingFilter: boolean
  enableSearch: boolean
  showProductCount: boolean
  autoRefresh: boolean
  refreshInterval: number
  categoryOrder: string[]
  hiddenCategories: string[]
  featuredCategories: string[]
}

export default function ProductCatalogConfig() {
  const [config, setConfig] = useState<CatalogConfig>({
    showCategoryTabs: true,
    defaultView: 'grid',
    productsPerPage: 12,
    showFilters: true,
    showSortOptions: true,
    showPriceRange: true,
    showRatingFilter: true,
    enableSearch: true,
    showProductCount: true,
    autoRefresh: false,
    refreshInterval: 30,
    categoryOrder: [],
    hiddenCategories: [],
    featuredCategories: []
  })
  
  const [products, setProducts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    categoriesUsed: 0,
    lastUpdated: ''
  })

  useEffect(() => {
    loadData()
    loadConfig()
  }, [])

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getProducts(),
        getCategories()
      ])
      
      setProducts(productsData)
      setCategories(categoriesData)
      
      // Calculate stats
      const activeProducts = productsData.filter((p: any) => p.status !== 'disabled').length
      const categoriesUsed = new Set(productsData.map((p: any) => p.category)).size
      
      setStats({
        totalProducts: productsData.length,
        activeProducts,
        categoriesUsed,
        lastUpdated: new Date().toLocaleString()
      })
      
      // Initialize category order if empty
      if (config.categoryOrder.length === 0) {
        setConfig(prev => ({
          ...prev,
          categoryOrder: categoriesData.map((c: any) => c.id || c.name)
        }))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadConfig = () => {
    // Load saved configuration from localStorage or database
    const savedConfig = localStorage.getItem('productCatalogConfig')
    if (savedConfig) {
      setConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) }))
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      // Save configuration to localStorage or database
      localStorage.setItem('productCatalogConfig', JSON.stringify(config))
      
      // In a real app, you would also save to Firebase/database
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      alert('Configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (key: keyof CatalogConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleCategoryVisibility = (categoryId: string) => {
    const isHidden = config.hiddenCategories.includes(categoryId)
    if (isHidden) {
      updateConfig('hiddenCategories', config.hiddenCategories.filter(id => id !== categoryId))
    } else {
      updateConfig('hiddenCategories', [...config.hiddenCategories, categoryId])
    }
  }

  const toggleFeaturedCategory = (categoryId: string) => {
    const isFeatured = config.featuredCategories.includes(categoryId)
    if (isFeatured) {
      updateConfig('featuredCategories', config.featuredCategories.filter(id => id !== categoryId))
    } else {
      updateConfig('featuredCategories', [...config.featuredCategories, categoryId])
    }
  }

  const moveCategoryUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...config.categoryOrder]
      ;[newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]]
      updateConfig('categoryOrder', newOrder)
    }
  }

  const moveCategoryDown = (index: number) => {
    if (index < config.categoryOrder.length - 1) {
      const newOrder = [...config.categoryOrder]
      ;[newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]]
      updateConfig('categoryOrder', newOrder)
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
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FiBox className="text-green-600" size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Product Catalog</h1>
            </div>
            <p className="text-gray-600">Configure product catalog display and behavior</p>
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
          { label: 'Total Products', value: stats.totalProducts, icon: FiBox, color: 'bg-blue-500' },
          { label: 'Active Products', value: stats.activeProducts, icon: FiEye, color: 'bg-green-500' },
          { label: 'Categories Used', value: stats.categoriesUsed, icon: FiGrid, color: 'bg-purple-500' },
          { label: 'Featured Categories', value: config.featuredCategories.length, icon: FiSettings, color: 'bg-orange-500' }
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
        {/* Display Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Display Settings</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Show Category Tabs</h3>
                <p className="text-sm text-gray-600">Display category navigation tabs</p>
              </div>
              <button
                onClick={() => updateConfig('showCategoryTabs', !config.showCategoryTabs)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.showCategoryTabs ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    config.showCategoryTabs ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
              <select
                value={config.defaultView}
                onChange={(e) => updateConfig('defaultView', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="grid">Grid View</option>
                <option value="list">List View</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Products Per Page</label>
              <input
                type="number"
                min="6"
                max="50"
                value={config.productsPerPage}
                onChange={(e) => updateConfig('productsPerPage', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">Show Product Count</h3>
                <p className="text-sm text-gray-600">Display number of products in each category</p>
              </div>
              <button
                onClick={() => updateConfig('showProductCount', !config.showProductCount)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  config.showProductCount ? 'bg-green-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    config.showProductCount ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Filter Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Filter Settings</h2>
          
          <div className="space-y-6">
            {[
              { key: 'showFilters', label: 'Show Filters', desc: 'Enable product filtering options' },
              { key: 'showSortOptions', label: 'Sort Options', desc: 'Allow sorting by price, rating, etc.' },
              { key: 'showPriceRange', label: 'Price Range Filter', desc: 'Enable price range filtering' },
              { key: 'showRatingFilter', label: 'Rating Filter', desc: 'Filter by product ratings' },
              { key: 'enableSearch', label: 'Search Function', desc: 'Enable product search within catalog' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
                <button
                  onClick={() => updateConfig(setting.key as keyof CatalogConfig, !config[setting.key as keyof CatalogConfig])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config[setting.key as keyof CatalogConfig] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config[setting.key as keyof CatalogConfig] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Category Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Category Management</h2>
        
        <div className="space-y-4">
          {categories.map((category, index) => {
            const categoryId = category.id || category.name
            const isHidden = config.hiddenCategories.includes(categoryId)
            const isFeatured = config.featuredCategories.includes(categoryId)
            const productCount = products.filter(p => p.category === category.name).length
            
            return (
              <div
                key={categoryId}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isHidden ? 'bg-gray-50 border-gray-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveCategoryUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveCategoryDown(index)}
                      disabled={index === categories.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{productCount} products</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleFeaturedCategory(categoryId)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      isFeatured 
                        ? 'bg-orange-100 text-orange-800 border-orange-200' 
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    {isFeatured ? 'Featured' : 'Regular'}
                  </button>
                  
                  <button
                    onClick={() => toggleCategoryVisibility(categoryId)}
                    className={`flex items-center space-x-2 px-3 py-1 text-xs font-medium rounded-full border ${
                      isHidden 
                        ? 'bg-red-100 text-red-800 border-red-200' 
                        : 'bg-green-100 text-green-800 border-green-200'
                    }`}
                  >
                    {isHidden ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    <span>{isHidden ? 'Hidden' : 'Visible'}</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Auto Refresh Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Auto Refresh Settings</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Enable Auto Refresh</h3>
              <p className="text-sm text-gray-600">Automatically refresh product data</p>
            </div>
            <button
              onClick={() => updateConfig('autoRefresh', !config.autoRefresh)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                config.autoRefresh ? 'bg-green-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  config.autoRefresh ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {config.autoRefresh && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Refresh Interval (seconds)</label>
              <input
                type="number"
                min="10"
                max="300"
                value={config.refreshInterval}
                onChange={(e) => updateConfig('refreshInterval', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}