'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  FiSettings,
  FiSave,
  FiRefreshCw,
  FiArrowLeft,
  FiBox,
  FiGrid,
  FiEye,
  FiLayers
} from 'react-icons/fi'

interface ComponentInfo {
  id: string
  name: string
  description: string
  type: 'product' | 'navigation' | 'ui' | 'content'
  icon: any
  configurable: boolean
}

export default function ComponentConfigPage() {
  const params = useParams()
  const componentId = params.componentId as string
  
  const [componentInfo, setComponentInfo] = useState<ComponentInfo | null>(null)
  const [config, setConfig] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Component definitions
  const componentDefinitions: { [key: string]: ComponentInfo } = {
    'hero': {
      id: 'hero',
      name: 'Hero Section',
      description: 'Landing page hero banner with call-to-action',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'search-modal': {
      id: 'search-modal',
      name: 'Search Modal',
      description: 'Product search overlay with filters',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'offers': {
      id: 'offers',
      name: 'Offers Section',
      description: 'Special offers and deals section',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'plant-care-tips': {
      id: 'plant-care-tips',
      name: 'Plant Care Tips',
      description: 'Educational plant care content',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'video-tutorials': {
      id: 'video-tutorials',
      name: 'Video Tutorials',
      description: 'Gardening tutorial videos',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'customer-reviews': {
      id: 'customer-reviews',
      name: 'Customer Reviews',
      description: 'Customer testimonials and reviews',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'wishlist-section': {
      id: 'wishlist-section',
      name: 'Wishlist Section',
      description: 'User wishlist display and management',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'header': {
      id: 'header',
      name: 'Header',
      description: 'Main navigation header with search and cart',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'footer': {
      id: 'footer',
      name: 'Footer',
      description: 'Main website footer component',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'floating-help-button': {
      id: 'floating-help-button',
      name: 'Floating Help Button',
      description: 'Floating help chat button with positioning options',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'product-modal': {
      id: 'product-modal',
      name: 'Product Modal',
      description: 'Product detail modal with image gallery',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'bottom-navigation': {
      id: 'bottom-navigation',
      name: 'Bottom Navigation',
      description: 'Mobile bottom navigation bar',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'tools-accessories': {
      id: 'tools-accessories',
      name: 'Tools & Accessories',
      description: 'Gardening tools and accessories section',
      type: 'product',
      icon: FiBox,
      configurable: true
    },
    'featured-products': {
      id: 'featured-products',
      name: 'Featured Products',
      description: 'Highlighted products for promotion',
      type: 'product',
      icon: FiBox,
      configurable: true
    },
    'wishlist-button': {
      id: 'wishlist-button',
      name: 'Wishlist Button',
      description: 'Add/remove wishlist functionality',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'phone-verification': {
      id: 'phone-verification',
      name: 'Phone Verification',
      description: 'OTP verification component',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'order-summary': {
      id: 'order-summary',
      name: 'Order Summary',
      description: 'Checkout order summary component',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'address-form': {
      id: 'address-form',
      name: 'Address Form',
      description: 'Customer address input form',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'search-bar': {
      id: 'search-bar',
      name: 'Search Bar',
      description: 'Product search input component',
      type: 'ui',
      icon: FiBox,
      configurable: true
    },
    'gardening-events': {
      id: 'gardening-events',
      name: 'Gardening Events',
      description: 'Upcoming gardening events and workshops',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'navbar': {
      id: 'navbar',
      name: 'Navbar',
      description: 'Top navigation bar component',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'gardening-blogs': {
      id: 'gardening-blogs',
      name: 'Gardening Blogs',
      description: 'Blog posts and articles',
      type: 'content',
      icon: FiBox,
      configurable: true
    },
    'gardening-categories-row': {
      id: 'gardening-categories-row',
      name: 'Gardening Categories Row',
      description: 'Horizontal category display row',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'essentials-section': {
      id: 'essentials-section',
      name: 'Essentials Section',
      description: 'Essential gardening items section',
      type: 'product',
      icon: FiBox,
      configurable: true
    },
    'categories': {
      id: 'categories',
      name: 'Categories',
      description: 'Product categories grid display',
      type: 'navigation',
      icon: FiBox,
      configurable: true
    },
    'sticky-footer': {
      id: 'sticky-footer',
      name: 'Sticky Footer',
      description: 'Fixed footer with quick actions',
      type: 'ui',
      icon: FiBox,
      configurable: true
    }
  }

  useEffect(() => {
    const component = componentDefinitions[componentId]
    if (component) {
      setComponentInfo(component)
      loadComponentConfig(componentId)
    } else {
      // Handle unknown component
      console.error('Unknown component:', componentId)
    }
    setLoading(false)
  }, [componentId])

  const loadComponentConfig = (id: string) => {
    // Load saved configuration from localStorage or database
    const savedConfig = localStorage.getItem(`component-config-${id}`)
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    } else {
      // Set default config based on component type
      setConfig(getDefaultConfig(id))
    }
  }

  const getDefaultConfig = (id: string) => {
    // Import from centralized config
    const { getComponentConfig } = require('@/lib/useComponentConfig')
    return getComponentConfig(id)
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      localStorage.setItem(`component-config-${componentId}`, JSON.stringify(config))
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (key: string, value: any) => {
    setConfig((prev: any) => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!componentInfo) {
    return (
      <div className="text-center py-12">
        <FiLayers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Component Not Found</h3>
        <p className="text-gray-500">The component "{componentId}" was not found.</p>
        <a 
          href="/admin/components"
          className="inline-flex items-center space-x-2 mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <FiArrowLeft size={16} />
          <span>Back to Components</span>
        </a>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-green-100 text-green-800'
      case 'navigation': return 'bg-blue-100 text-blue-800'
      case 'ui': return 'bg-purple-100 text-purple-800'
      case 'content': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <componentInfo.icon className="text-gray-600" size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{componentInfo.name}</h1>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(componentInfo.type)}`}>
                {componentInfo.type}
              </span>
            </div>
            <p className="text-gray-600">{componentInfo.description}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => loadComponentConfig(componentId)}
            className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw size={20} />
            <span>Reset</span>
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

      {/* Generic Configuration Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration Options</h2>
        
        <div className="space-y-6">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
              
              {typeof value === 'boolean' ? (
                <button
                  onClick={() => updateConfig(key, !value)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    value ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      value ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              ) : typeof value === 'number' ? (
                <input
                  type="number"
                  value={value}
                  onChange={(e) => updateConfig(key, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={String(value)}
                  onChange={(e) => updateConfig(key, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              )}
            </div>
          ))}
          
          {Object.keys(config).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiSettings className="mx-auto h-12 w-12 text-gray-300 mb-2" />
              <p>No configuration options available for this component.</p>
              <p className="text-sm">This component may have specialized configuration pages.</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Component-specific note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <FiBox className="text-blue-600" size={16} />
          </div>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">Configuration Note</h3>
            <p className="text-sm text-blue-700">
              This is a generic configuration page. Some components like Product Catalog, Bestseller Section, 
              and Category Slider have specialized configuration pages with advanced options. 
              Changes made here will be applied to the component when it loads.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 