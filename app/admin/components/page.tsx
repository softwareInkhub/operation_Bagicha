'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiLayers,
  FiSettings,
  FiEye,
  FiEdit3,
  FiGrid,
  FiList,
  FiSearch,
  FiRefreshCw,
  FiBox,
  FiShoppingBag,
  FiStar,
  FiTrendingUp,
  FiPlus,
  FiHeart,
  FiShoppingCart,
  FiUser,
  FiNavigation,
  FiImage,
  FiPlay,
  FiMessageCircle,
  FiCalendar,
  FiMapPin,
  FiPhone,
  FiMail,
  FiHelpCircle,
  FiFeather,
  FiTag,
  FiBook
} from 'react-icons/fi'

interface ComponentConfig {
  id: string
  name: string
  description: string
  icon: any
  status: 'active' | 'inactive'
  type: 'product' | 'navigation' | 'ui' | 'content'
  lastModified: string
  productsConnected?: number
  categoriesConnected?: number
  configurable: boolean
}

export default function ComponentsManagement() {
  const [components, setComponents] = useState<ComponentConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadComponents()
  }, [])

  const loadComponents = async () => {
    try {
      // Load all components from the components folder
      const componentsData: ComponentConfig[] = [
        // Product Components (7 components)
        {
          id: 'product-catalog',
          name: 'Product Catalog',
          description: 'Main product listing with categories and filtering',
          icon: FiBox,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-20',
          productsConnected: 45,
          categoriesConnected: 8,
          configurable: true
        },
        {
          id: 'bestseller-section',
          name: 'Bestseller Section',
          description: 'Showcases top-rated products by category',
          icon: FiStar,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-20',
          productsConnected: 12,
          categoriesConnected: 4,
          configurable: true
        },
        {
          id: 'trending-plants',
          name: 'Trending Plants',
          description: 'Displays trending plant products with badges',
          icon: FiTrendingUp,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-20',
          productsConnected: 15,
          categoriesConnected: 3,
          configurable: true
        },
        {
          id: 'new-arrivals',
          name: 'New Arrivals',
          description: 'Shows recently added products',
          icon: FiPlus,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-20',
          productsConnected: 18,
          categoriesConnected: 5,
          configurable: true
        },
        {
          id: 'fertilizer-section',
          name: 'Fertilizer Section',
          description: 'Specialized section for fertilizer products',
          icon: FiShoppingBag,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-20',
          productsConnected: 10,
          categoriesConnected: 2,
          configurable: true
        },
        {
          id: 'tools-accessories',
          name: 'Tools & Accessories',
          description: 'Gardening tools and accessories section',
          icon: FiSettings,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-18',
          productsConnected: 22,
          categoriesConnected: 3,
          configurable: true
        },
        {
          id: 'featured-products',
          name: 'Featured Products',
          description: 'Highlighted products for promotion',
          icon: FiStar,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-19',
          productsConnected: 8,
          categoriesConnected: 2,
          configurable: true
        },
        {
          id: 'essentials-section',
          name: 'Essentials Section',
          description: 'Essential gardening items showcase',
          icon: FiBox,
          status: 'active',
          type: 'product',
          lastModified: '2024-01-15',
          configurable: true
        },

        // Navigation Components (6 components)
        {
          id: 'category-slider',
          name: 'Category Slider',
          description: 'Horizontal category navigation with sections',
          icon: FiNavigation,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-20',
          categoriesConnected: 8,
          configurable: true
        },
        {
          id: 'header',
          name: 'Header',
          description: 'Main navigation header with search and cart',
          icon: FiNavigation,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-19',
          configurable: true
        },
        {
          id: 'bottom-navigation',
          name: 'Bottom Navigation',
          description: 'Mobile bottom navigation bar',
          icon: FiNavigation,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'navbar',
          name: 'Navbar',
          description: 'Top navigation bar component',
          icon: FiNavigation,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'footer',
          name: 'Footer',
          description: 'Main website footer component',
          icon: FiNavigation,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'categories',
          name: 'Categories',
          description: 'General categories display component',
          icon: FiGrid,
          status: 'active',
          type: 'navigation',
          lastModified: '2024-01-15',
          configurable: true
        },

        // UI Components (13 components)
        {
          id: 'hero',
          name: 'Hero Section',
          description: 'Landing page hero banner with call-to-action',
          icon: FiImage,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-18',
          configurable: true
        },
        {
          id: 'search-modal',
          name: 'Search Modal',
          description: 'Product search overlay with filters',
          icon: FiSearch,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-17',
          configurable: true
        },
        {
          id: 'product-modal',
          name: 'Product Modal',
          description: 'Product details popup modal',
          icon: FiEye,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-17',
          configurable: true
        },
        {
          id: 'wishlist-button',
          name: 'Wishlist Button',
          description: 'Add/remove wishlist functionality',
          icon: FiHeart,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-20',
          configurable: true
        },
        {
          id: 'wishlist-section',
          name: 'Wishlist Section',
          description: 'User wishlist display and management',
          icon: FiHeart,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-18',
          configurable: true
        },
        {
          id: 'product-details',
          name: 'Product Details',
          description: 'Detailed product information component',
          icon: FiEye,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-20',
          configurable: true
        },
        {
          id: 'order-summary',
          name: 'Order Summary',
          description: 'Checkout order summary component',
          icon: FiShoppingCart,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-16',
          configurable: true
        },
        {
          id: 'address-form',
          name: 'Address Form',
          description: 'Customer address input form',
          icon: FiMapPin,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-16',
          configurable: true
        },
        {
          id: 'phone-verification',
          name: 'Phone Verification',
          description: 'OTP verification component',
          icon: FiPhone,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'search-bar',
          name: 'Search Bar',
          description: 'Product search input component',
          icon: FiSearch,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'sticky-footer',
          name: 'Sticky Footer',
          description: 'Fixed footer with quick actions',
          icon: FiNavigation,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'floating-help-button',
          name: 'Floating Help Button',
          description: 'Customer support floating button',
          icon: FiHelpCircle,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-15',
          configurable: true
        },
        {
          id: 'gardening-categories-row',
          name: 'Gardening Categories Row',
          description: 'Horizontal category display row',
          icon: FiGrid,
          status: 'active',
          type: 'ui',
          lastModified: '2024-01-16',
          configurable: true
        },

        // Content Components (7 components)
        {
          id: 'offers',
          name: 'Offers',
          description: 'Special offers and deals section',
          icon: FiTag,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-18',
          configurable: true
        },
        {
          id: 'plant-care-tips',
          name: 'Plant Care Tips',
          description: 'Educational plant care content',
          icon: FiFeather,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-17',
          configurable: true
        },
        {
          id: 'video-tutorials',
          name: 'Video Tutorials',
          description: 'Gardening tutorial videos',
          icon: FiPlay,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-17',
          configurable: true
        },
        {
          id: 'gardening-events',
          name: 'Gardening Events',
          description: 'Upcoming gardening events and workshops',
          icon: FiCalendar,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-16',
          configurable: true
        },
        {
          id: 'gardening-blogs',
          name: 'Gardening Blogs',
          description: 'Blog articles about gardening',
          icon: FiBook,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-16',
          configurable: true
        },
        {
          id: 'customer-reviews',
          name: 'Customer Reviews',
          description: 'Customer testimonials and reviews',
          icon: FiMessageCircle,
          status: 'active',
          type: 'content',
          lastModified: '2024-01-16',
          configurable: true
        }
      ]

      setComponents(componentsData)
    } catch (error) {
      console.error('Error loading components:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || component.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'product': return 'bg-green-100 text-green-800 border-green-200'
      case 'navigation': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ui': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'content': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200'
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
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Components Management</h1>
          <p className="text-gray-600 mt-1">Configure and manage website components</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3 space-y-3 sm:space-y-0">
          <a
            href="/admin/components/test-config"
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <FiPlay size={20} />
            <span>Test Configs</span>
          </a>
          <button
            onClick={loadComponents}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <FiRefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0 flex-1">
            <div className="relative flex-1 lg:max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">All Types</option>
              <option value="product">Product</option>
              <option value="navigation">Navigation</option>
              <option value="ui">UI</option>
              <option value="content">Content</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-green-100 text-green-600' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Components Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component, index) => (
            <motion.div
              key={component.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <component.icon className="text-green-600" size={24} />
                </div>
                <div className="flex space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(component.status)}`}>
                    {component.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(component.type)}`}>
                    {component.type}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">{component.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{component.description}</p>

              {(component.productsConnected !== undefined || component.categoriesConnected !== undefined) && (
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  {component.productsConnected !== undefined && (
                    <span className="flex items-center">
                      <FiBox className="mr-1" size={14} />
                      {component.productsConnected} products
                    </span>
                  )}
                  {component.categoriesConnected !== undefined && (
                    <span className="flex items-center">
                      <FiGrid className="mr-1" size={14} />
                      {component.categoriesConnected} categories
                    </span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Modified: {component.lastModified}
                </span>
                <div className="flex space-x-2">
                  {component.configurable && (
                    <a
                      href={`/admin/components/${component.id}`}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <FiSettings size={16} />
                      <span>Configure</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Connected</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modified</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                          <component.icon className="text-green-600" size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{component.name}</div>
                          <div className="text-sm text-gray-500">{component.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getTypeColor(component.type)}`}>
                        {component.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(component.status)}`}>
                        {component.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="space-y-1">
                        {component.productsConnected !== undefined && (
                          <div>{component.productsConnected} products</div>
                        )}
                        {component.categoriesConnected !== undefined && (
                          <div>{component.categoriesConnected} categories</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {component.lastModified}
                    </td>
                    <td className="px-6 py-4">
                      {component.configurable && (
                        <a
                          href={`/admin/components/${component.id}`}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <FiSettings size={16} />
                          <span>Configure</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredComponents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <FiLayers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
} 