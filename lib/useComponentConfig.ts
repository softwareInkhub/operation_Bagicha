import { useState, useEffect } from 'react'

interface ComponentConfig {
  [key: string]: any
}

export function useComponentConfig(componentId: string, defaultConfig: ComponentConfig = {}) {
  const [config, setConfig] = useState<ComponentConfig>(defaultConfig)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadConfig()
  }, [componentId])

  const loadConfig = () => {
    try {
      // Load configuration from localStorage (set by admin)
      const savedConfig = localStorage.getItem(`component-config-${componentId}`)
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig)
        setConfig({ ...defaultConfig, ...parsedConfig })
      } else {
        setConfig(defaultConfig)
      }
    } catch (error) {
      console.error(`Error loading config for ${componentId}:`, error)
      setConfig(defaultConfig)
    } finally {
      setIsLoading(false)
    }
  }

  const updateConfig = (newConfig: Partial<ComponentConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
    try {
      localStorage.setItem(`component-config-${componentId}`, JSON.stringify(updatedConfig))
    } catch (error) {
      console.error(`Error saving config for ${componentId}:`, error)
    }
  }

  return {
    config,
    updateConfig,
    isLoading,
    reload: loadConfig
  }
}

// Predefined configurations for each component
export const componentDefaultConfigs = {
  'hero': {
    showCallToAction: true,
    backgroundImage: '',
    title: 'Welcome to Bagicha',
    subtitle: 'Your Garden Store',
    buttonText: 'Shop Now',
    showVideo: false,
    autoplay: false
  },
  'search-modal': {
    enableFilters: true,
    showCategories: true,
    showPriceRange: true,
    maxResults: 20,
    showSortOptions: true,
    enableAutocomplete: true
  },
  'offers': {
    autoRotate: true,
    rotationInterval: 5000,
    showTimer: true,
    maxOffers: 6,
    showDiscountPercentage: true,
    enableHover: true
  },
  'plant-care-tips': {
    showImages: true,
    showReadMore: true,
    maxTips: 8,
    enableComments: false,
    showAuthor: true,
    showDate: true
  },
  'video-tutorials': {
    autoplay: false,
    showThumbnails: true,
    maxVideos: 6,
    enableFullscreen: true,
    showDuration: true,
    showViews: true
  },
  'customer-reviews': {
    showRatings: true,
    showPhotos: true,
    maxReviews: 12,
    enableModeration: true,
    showDate: true,
    showVerifiedBadge: true
  },
  'wishlist-section': {
    showImages: true,
    showPrices: true,
    enableSharing: false,
    maxItems: 20,
    showAddedDate: false,
    enableNotes: false
  },
  'header': {
    showSearch: true,
    showCart: true,
    showWishlist: true,
    sticky: true,
    showCategories: true,
    showLogo: true
  },
  'footer': {
    showSocialLinks: true,
    showNewsletter: true,
    showContactInfo: true,
    showLegalLinks: true,
    showCompanyInfo: true,
    showQuickLinks: true
  },
  'floating-help-button': {
    showOnMobile: true,
    showOnDesktop: true,
    position: 'bottom-right',
    showUnreadCount: true,
    enableSound: false,
    autoExpand: false
  },
  'product-modal': {
    showRelatedProducts: true,
    showReviews: true,
    showDescription: true,
    enableZoom: true,
    showShare: true,
    maxImages: 5
  },
  'bottom-navigation': {
    showLabels: true,
    showBadges: true,
    hideOnScroll: false,
    showNotifications: true,
    vibrate: true
  },
  'tools-accessories': {
    showCategories: true,
    showPrices: true,
    showRatings: true,
    maxItems: 12,
    enableHover: true,
    showBadges: true
  },
  'product-details': {
    showDescription: true,
    showSpecifications: true,
    showReviews: true,
    showRelatedProducts: true,
    enableZoom: true,
    showShare: true
  },
  'featured-products': {
    showCategories: true,
    showPrices: true,
    showRatings: true,
    maxItems: 8,
    autoRotate: false,
    rotationInterval: 4000
  },
  'wishlist-button': {
    showTooltip: true,
    animateOnAdd: true,
    showCount: false,
    position: 'top-right'
  },
  'phone-verification': {
    enableAutoDetect: true,
    showCountryCode: true,
    resendTimeout: 30,
    maxAttempts: 3
  },
  'order-summary': {
    showItemImages: true,
    showDeliveryInfo: true,
    showDiscounts: true,
    enablePromoCode: true
  },
  'address-form': {
    enableAutocomplete: true,
    showMap: false,
    requirePincode: true,
    enableGPS: true
  },
  'search-bar': {
    enableVoiceSearch: true,
    showSuggestions: true,
    maxSuggestions: 5,
    enableHistory: true
  },
  'gardening-events': {
    showImages: true,
    showDate: true,
    showLocation: true,
    maxEvents: 6,
    enableRegistration: true
  },
  'navbar': {
    showLogo: true,
    showSearch: true,
    showCart: true,
    sticky: true
  },
  'gardening-blogs': {
    showImages: true,
    showDate: true,
    showAuthor: true,
    maxBlogs: 6,
    enableComments: false
  },
  'gardening-categories-row': {
    showIcons: true,
    showCounts: true,
    maxCategories: 8,
    enableHover: true
  },
  'essentials-section': {
    showPrices: true,
    showRatings: true,
    maxItems: 6,
    enableQuickAdd: true
  },
  'categories': {
    showImages: true,
    showCounts: true,
    gridLayout: true,
    maxCategories: 12
  },
  'sticky-footer': {
    showOnMobile: true,
    showOnDesktop: false,
    showCart: true,
    showWishlist: true,
    showSearch: true
  },
  // Product Components
  'product-catalog': {
    showFilters: true,
    itemsPerPage: 12,
    enableSearch: true,
    showSortOptions: true,
    gridLayout: 'grid',
    showCategories: true,
    enablePagination: true
  },
  'bestseller-section': {
    maxProducts: 8,
    showRatings: true,
    enableAutoSlide: false,
    slideInterval: 4000,
    showCategoryBadges: true,
    sortBy: 'rating'
  },
  'trending-plants': {
    maxItems: 6,
    showBadges: true,
    autoRefresh: true,
    refreshInterval: 300000, // 5 minutes
    enableHover: true,
    showTrendingBadge: true
  },
  'new-arrivals': {
    maxItems: 8,
    showNewBadge: true,
    badgeDuration: 7, // days
    enableCarousel: true,
    autoSlide: false,
    showAddedDate: true
  },
  'fertilizer-section': {
    showProductTypes: true,
    enableFiltering: true,
    maxProducts: 6,
    showBenefits: true,
    compactView: false,
    showUsageInstructions: true
  },
  'category-slider': {
    autoScroll: false,
    scrollSpeed: 2000,
    showArrows: true,
    enableTouch: true,
    centerActiveItem: true,
    showSectionNames: true
  }
}

export function getComponentConfig(componentId: string): ComponentConfig {
  return componentDefaultConfigs[componentId as keyof typeof componentDefaultConfigs] || {}
} 