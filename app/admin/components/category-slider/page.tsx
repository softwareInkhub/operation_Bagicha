'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiNavigation,
  FiSave,
  FiRefreshCw,
  FiArrowLeft,
  FiGrid,
  FiEye,
  FiEyeOff,
  FiEdit3,
  FiMove,
  FiPlus,
  FiTrash2
} from 'react-icons/fi'
import { getCategories } from '@/lib/firebase'

interface CategorySliderConfig {
  showAllSection: boolean
  showOffersSection: boolean
  showWishlistSection: boolean
  maxCategoriesVisible: number
  enableHorizontalScroll: boolean
  showCategoryCount: boolean
  showCategoryIcons: boolean
  sectionOrder: string[]
  hiddenSections: string[]
  customSections: Array<{
    id: string
    name: string
    icon: string
    href: string
    color: string
  }>
}

interface SectionConfig {
  id: string
  name: string
  type: 'default' | 'firebase' | 'custom'
  visible: boolean
  icon?: string
  href?: string
  color?: string
  count?: number
}

export default function CategorySliderConfig() {
  const [config, setConfig] = useState<CategorySliderConfig>({
    showAllSection: true,
    showOffersSection: true,
    showWishlistSection: true,
    maxCategoriesVisible: 6,
    enableHorizontalScroll: true,
    showCategoryCount: true,
    showCategoryIcons: true,
    sectionOrder: ['all', 'offers', 'wishlist'],
    hiddenSections: [],
    customSections: []
  })
  
  const [categories, setCategories] = useState<any[]>([])
  const [sections, setSections] = useState<SectionConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newSectionName, setNewSectionName] = useState('')
  const [newSectionHref, setNewSectionHref] = useState('')
  const [showAddSection, setShowAddSection] = useState(false)

  useEffect(() => {
    loadData()
    loadConfig()
  }, [])

  useEffect(() => {
    generateSections()
  }, [config, categories])

  const loadData = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSections = () => {
    const defaultSections: SectionConfig[] = [
      {
        id: 'all',
        name: 'All',
        type: 'default',
        visible: config.showAllSection,
        icon: '🏠',
        href: '#all',
        color: 'bg-gray-100'
      },
      {
        id: 'offers',
        name: 'Offers',
        type: 'default',
        visible: config.showOffersSection,
        icon: '🎉',
        href: '#offers',
        color: 'bg-red-100'
      },
      {
        id: 'wishlist',
        name: 'Wishlist',
        type: 'default',
        visible: config.showWishlistSection,
        icon: '❤️',
        href: '#wishlist',
        color: 'bg-pink-100'
      }
    ]

    const firebaseSections: SectionConfig[] = categories.map(category => ({
      id: category.id || category.name.toLowerCase().replace(/\s+/g, '-'),
      name: category.name,
      type: 'firebase' as const,
      visible: !config.hiddenSections.includes(category.id || category.name),
      icon: category.icon || '🌱',
      href: `#${category.name.toLowerCase().replace(/\s+/g, '-')}`,
      color: category.color || 'bg-green-100',
      count: category.productCount || 0
    }))

    const customSections: SectionConfig[] = config.customSections.map(custom => ({
      id: custom.id,
      name: custom.name,
      type: 'custom' as const,
      visible: !config.hiddenSections.includes(custom.id),
      icon: custom.icon,
      href: custom.href,
      color: custom.color
    }))

    const allSections = [...defaultSections, ...firebaseSections, ...customSections]
    
    // Sort according to config.sectionOrder
    const orderedSections = config.sectionOrder
      .map(id => allSections.find(s => s.id === id))
      .filter(Boolean) as SectionConfig[]
    
    // Add any sections not in the order
    const remainingSections = allSections.filter(s => 
      !config.sectionOrder.includes(s.id)
    )

    setSections([...orderedSections, ...remainingSections])
  }

  const loadConfig = () => {
    const savedConfig = localStorage.getItem('categorySliderConfig')
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig)
      setConfig(prev => ({ ...prev, ...parsed }))
    }
  }

  const saveConfig = async () => {
    setSaving(true)
    try {
      localStorage.setItem('categorySliderConfig', JSON.stringify(config))
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Configuration saved successfully!')
    } catch (error) {
      console.error('Error saving config:', error)
      alert('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (key: keyof CategorySliderConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const toggleSectionVisibility = (sectionId: string) => {
    const isHidden = config.hiddenSections.includes(sectionId)
    if (isHidden) {
      updateConfig('hiddenSections', config.hiddenSections.filter(id => id !== sectionId))
    } else {
      updateConfig('hiddenSections', [...config.hiddenSections, sectionId])
    }
  }

  const moveSectionUp = (index: number) => {
    if (index > 0) {
      const newOrder = [...config.sectionOrder]
      const currentId = sections[index].id
      const prevId = sections[index - 1].id
      
      const currentOrderIndex = newOrder.indexOf(currentId)
      const prevOrderIndex = newOrder.indexOf(prevId)
      
      if (currentOrderIndex !== -1 && prevOrderIndex !== -1) {
        ;[newOrder[currentOrderIndex], newOrder[prevOrderIndex]] = 
         [newOrder[prevOrderIndex], newOrder[currentOrderIndex]]
        updateConfig('sectionOrder', newOrder)
      }
    }
  }

  const moveSectionDown = (index: number) => {
    if (index < sections.length - 1) {
      const newOrder = [...config.sectionOrder]
      const currentId = sections[index].id
      const nextId = sections[index + 1].id
      
      const currentOrderIndex = newOrder.indexOf(currentId)
      const nextOrderIndex = newOrder.indexOf(nextId)
      
      if (currentOrderIndex !== -1 && nextOrderIndex !== -1) {
        ;[newOrder[currentOrderIndex], newOrder[nextOrderIndex]] = 
         [newOrder[nextOrderIndex], newOrder[currentOrderIndex]]
        updateConfig('sectionOrder', newOrder)
      }
    }
  }

  const addCustomSection = () => {
    if (!newSectionName.trim()) return

    const newSection = {
      id: `custom-${Date.now()}`,
      name: newSectionName.trim(),
      icon: '🔗',
      href: newSectionHref.trim() || '#',
      color: 'bg-blue-100'
    }

    updateConfig('customSections', [...config.customSections, newSection])
    updateConfig('sectionOrder', [...config.sectionOrder, newSection.id])
    
    setNewSectionName('')
    setNewSectionHref('')
    setShowAddSection(false)
  }

  const removeCustomSection = (sectionId: string) => {
    updateConfig('customSections', config.customSections.filter(s => s.id !== sectionId))
    updateConfig('sectionOrder', config.sectionOrder.filter(id => id !== sectionId))
    updateConfig('hiddenSections', config.hiddenSections.filter(id => id !== sectionId))
  }

  const visibleSections = sections.filter(s => s.visible).length

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
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiNavigation className="text-blue-600" size={20} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Category Slider</h1>
            </div>
            <p className="text-gray-600">Configure category navigation slider</p>
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
          { label: 'Total Sections', value: sections.length, icon: FiGrid, color: 'bg-blue-500' },
          { label: 'Visible Sections', value: visibleSections, icon: FiEye, color: 'bg-green-500' },
          { label: 'Firebase Categories', value: categories.length, icon: FiNavigation, color: 'bg-purple-500' },
          { label: 'Custom Sections', value: config.customSections.length, icon: FiPlus, color: 'bg-orange-500' }
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
        {/* General Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">General Settings</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Visible Categories ({config.maxCategoriesVisible})
              </label>
              <input
                type="range"
                min="4"
                max="12"
                value={config.maxCategoriesVisible}
                onChange={(e) => updateConfig('maxCategoriesVisible', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>12</span>
              </div>
            </div>

            {[
              { key: 'enableHorizontalScroll', label: 'Horizontal Scroll', desc: 'Enable horizontal scrolling for categories' },
              { key: 'showCategoryCount', label: 'Show Counts', desc: 'Display product count for each category' },
              { key: 'showCategoryIcons', label: 'Show Icons', desc: 'Display icons for categories' }
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{setting.label}</h3>
                  <p className="text-sm text-gray-600">{setting.desc}</p>
                </div>
                <button
                  onClick={() => updateConfig(setting.key as keyof CategorySliderConfig, !config[setting.key as keyof CategorySliderConfig])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config[setting.key as keyof CategorySliderConfig] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config[setting.key as keyof CategorySliderConfig] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Default Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Default Sections</h2>
          
          <div className="space-y-4">
            {[
              { key: 'showAllSection', label: 'All Products', desc: 'Show "All" category section', icon: '🏠' },
              { key: 'showOffersSection', label: 'Offers', desc: 'Show special offers section', icon: '🎉' },
              { key: 'showWishlistSection', label: 'Wishlist', desc: 'Show wishlist section', icon: '❤️' }
            ].map((section) => (
              <div key={section.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{section.icon}</span>
                  <div>
                    <h3 className="font-medium text-gray-900">{section.label}</h3>
                    <p className="text-sm text-gray-600">{section.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => updateConfig(section.key as keyof CategorySliderConfig, !config[section.key as keyof CategorySliderConfig])}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    config[section.key as keyof CategorySliderConfig] ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      config[section.key as keyof CategorySliderConfig] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Section Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Section Management</h2>
          <button
            onClick={() => setShowAddSection(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiPlus size={18} />
            <span>Add Custom</span>
          </button>
        </div>

        {showAddSection && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Add Custom Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Section name"
                value={newSectionName}
                onChange={(e) => setNewSectionName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
              <input
                type="text"
                placeholder="URL/href (optional)"
                value={newSectionHref}
                onChange={(e) => setNewSectionHref(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex space-x-3 mt-3">
              <button
                onClick={addCustomSection}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Add Section
              </button>
              <button
                onClick={() => setShowAddSection(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {sections.map((section, index) => {
            const isVisible = section.visible
            
            return (
              <div
                key={section.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isVisible ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveSectionUp(index)}
                      disabled={index === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSectionDown(index)}
                      disabled={index === sections.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                      ↓
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {config.showCategoryIcons && (
                      <span className="text-xl">{section.icon}</span>
                    )}
                    <div>
                      <h3 className="font-medium text-gray-900">{section.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          section.type === 'default' ? 'bg-blue-100 text-blue-800' :
                          section.type === 'firebase' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {section.type}
                        </span>
                        {section.count !== undefined && config.showCategoryCount && (
                          <span>{section.count} products</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  {section.type === 'custom' && (
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => toggleSectionVisibility(section.id)}
                    className={`flex items-center space-x-2 px-3 py-1 text-xs font-medium rounded-full border ${
                      isVisible 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    {isVisible ? <FiEye size={14} /> : <FiEyeOff size={14} />}
                    <span>{isVisible ? 'Visible' : 'Hidden'}</span>
                  </button>
                </div>
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
        
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className={`flex space-x-3 ${config.enableHorizontalScroll ? 'overflow-x-auto pb-2' : 'flex-wrap'}`}>
            {sections
              .filter(s => s.visible)
              .slice(0, config.maxCategoriesVisible)
              .map((section) => (
                <div
                  key={section.id}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm font-medium flex items-center space-x-2 ${section.color || 'bg-gray-100'} border-gray-200`}
                >
                  {config.showCategoryIcons && <span>{section.icon}</span>}
                  <span>{section.name}</span>
                  {config.showCategoryCount && section.count !== undefined && (
                    <span className="text-xs text-gray-600">({section.count})</span>
                  )}
                </div>
              ))}
            
            {sections.filter(s => s.visible).length > config.maxCategoriesVisible && (
              <div className="flex-shrink-0 px-3 py-2 rounded-lg border bg-gray-100 border-gray-200 text-sm font-medium text-gray-600">
                +{sections.filter(s => s.visible).length - config.maxCategoriesVisible} more
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
} 