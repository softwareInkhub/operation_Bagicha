'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlay, FiSettings, FiEye, FiRefreshCw, FiArrowLeft } from 'react-icons/fi'

export default function TestConfigPage() {
  const [previewMode, setPreviewMode] = useState(false)
  
  const components = [
    {
      id: 'hero',
      name: 'Hero Section',
      description: 'Test title, subtitle, and call-to-action visibility',
      configKeys: ['title', 'subtitle', 'buttonText', 'showCallToAction']
    },
    {
      id: 'offers',
      name: 'Offers Section',
      description: 'Test auto-rotation, timer display, and max offers',
      configKeys: ['autoRotate', 'rotationInterval', 'showTimer', 'maxOffers']
    },
    {
      id: 'floating-help-button',
      name: 'Floating Help Button',
      description: 'Test positioning, visibility, and unread count',
      configKeys: ['position', 'showOnMobile', 'showOnDesktop', 'showUnreadCount']
    },
    {
      id: 'header',
      name: 'Header',
      description: 'Test element visibility and sticky behavior',
      configKeys: ['showLogo', 'showSearch', 'showCart', 'showWishlist', 'sticky']
    }
  ]

  const handleTestConfig = (componentId: string) => {
    // Save a test configuration
    const testConfigs = {
      'hero': {
        title: 'TEST: Admin Modified Title',
        subtitle: 'TEST: This subtitle was changed via admin',
        buttonText: 'TEST: Admin Button',
        showCallToAction: true
      },
      'offers': {
        autoRotate: true,
        rotationInterval: 3000,
        showTimer: true,
        maxOffers: 2
      },
      'floating-help-button': {
        position: 'bottom-left',
        showOnMobile: true,
        showOnDesktop: true,
        showUnreadCount: true
      },
      'header': {
        showLogo: true,
        showSearch: true,
        showCart: true,
        showWishlist: true,
        sticky: true
      }
    }
    
    const config = testConfigs[componentId as keyof typeof testConfigs]
    if (config) {
      localStorage.setItem(`component-config-${componentId}`, JSON.stringify(config))
      alert(`Test configuration applied to ${componentId}! Visit the main website to see changes.`)
    }
  }

  const clearAllConfigs = () => {
    components.forEach(comp => {
      localStorage.removeItem(`component-config-${comp.id}`)
    })
    alert('All configurations cleared! Components will use default settings.')
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
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiPlay className="text-blue-600" size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Test Component Configurations</h1>
            </div>
            <p className="text-gray-600">Apply test configurations and see them in action</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={clearAllConfigs}
            className="flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw size={20} />
            <span>Clear All</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiEye size={20} />
            <span>View Website</span>
          </a>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Test</h2>
        <ol className="text-sm text-blue-800 space-y-1">
          <li>1. Click "Apply Test Config" on any component below</li>
          <li>2. Click "View Website" to open the main site in a new tab</li>
          <li>3. See how the component configuration affects the actual UI</li>
          <li>4. Use "Clear All" to reset all components to default settings</li>
        </ol>
      </div>

      {/* Component Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {components.map((component, index) => (
          <motion.div
            key={component.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                <p className="text-sm text-gray-600">{component.description}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <FiSettings className="text-gray-600" size={20} />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Configuration Keys:</p>
                <div className="flex flex-wrap gap-2">
                  {component.configKeys.map((key) => (
                    <span 
                      key={key}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleTestConfig(component.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Apply Test Config
                </button>
                <a
                  href={`/admin/components/${component.id}`}
                  className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <FiSettings size={16} />
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Real-time Preview Note */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-green-900 mb-2">Real-time Configuration</h2>
        <p className="text-sm text-green-800">
          All component configurations are applied instantly. Changes made in the admin panel 
          will be reflected immediately when components load or refresh on the main website.
        </p>
      </div>
    </div>
  )
} 