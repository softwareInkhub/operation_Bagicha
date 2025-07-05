'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'
import { useComponentConfig } from '@/lib/useComponentConfig'
import { getProducts } from '@/lib/firebase'

export default function ToolsAndAccessories() {
  const [tools, setTools] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [modalProductList, setModalProductList] = useState<any[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  // Load admin configuration
  const { config } = useComponentConfig('tools-accessories', {
    showCategories: true,
    showPrices: true,
    showRatings: true,
    maxItems: 12,
    enableHover: true,
    showBadges: true
  })

  useEffect(() => {
    async function fetchTools() {
      try {
        const allProducts = await getProducts();
        // Filter for tools by category name
        const toolCategories = [
          'Cutting Tools', 'Digging Tools', 'Watering', 'Protection',
          'Raking Tools', 'Hoeing Tools', 'Blowing Tools', 'Tools', 'Accessories'
        ];
        const filtered = (allProducts || []).filter((prod: any) => {
          const cat = (prod.category || '').toLowerCase();
          return toolCategories.some(tc => cat.includes(tc.toLowerCase())) || cat.includes('tool');
        });
        setTools(filtered);
      } catch (e) {
        setTools([]);
      }
    }
    fetchTools();
  }, []);

  // Filter tools based on maxItems setting
  const filteredTools = tools.slice(0, config.maxItems)

  // Group tools by category
  const groupedTools: { [category: string]: typeof filteredTools } = {}
  filteredTools.forEach(tool => {
    if (!groupedTools[tool.category]) groupedTools[tool.category] = []
    groupedTools[tool.category].push(tool)
  })

  // Prepare cards for two-row slider
  const cardEntries = Object.entries(groupedTools)
  const cardsPerRow = Math.ceil(cardEntries.length / 2)
  const rows = [
    cardEntries.slice(0, cardsPerRow),
    cardEntries.slice(cardsPerRow)
  ]

  const handleCardClick = (category: string) => {
    setSelectedCategory(category)
    setModalOpen(true)
  }

  const handleProductClick = (product: any, productList: any[]) => {
    setModalProductList(productList)
    setModalProductIndex(productList.findIndex(p => p.id === product.id))
    setSelectedProduct(product)
  }

  const closeProductDetails = () => {
    setSelectedProduct(null)
    setModalProductList([])
    setModalProductIndex(null)
  }

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Cutting Tools': '✂️',
      'Digging Tools': '🛠️',
      'Watering': '💧',
      'Protection': '🧤',
      'Raking Tools': '🛠️',
      'Hoeing Tools': '🛠️',
      'Blowing Tools': '🛠️',
      'Tools': '🛠️',
      'Accessories': '🎍'
    }
    return icons[category] || '🛠️'
  }

  const getModalItems = () => {
    if (!selectedCategory) return []
    const categoryTools = groupedTools[selectedCategory] || []
    return categoryTools.map((tool, index) => ({
      ...tool,
      wishlistButton: <WishlistButton product={{ 
        id: tool.id, 
        name: tool.name, 
        price: tool.price, 
        image: tool.image 
      }} />
    }))
  }

  return (
    <motion.section 
      className="mt-0 pt-0 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        🛠️ Tools & Accessories
      </motion.h2>
      
      {/* Two-row slider */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map(([category, categoryTools], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (rowIndex * 0.1) + (index * 0.1) }}
                  className={`bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start ${
                    config.enableHover ? 'hover:scale-105 hover:shadow-2xl' : ''
                  }`}
                  onClick={() => handleCardClick(category)}
                  whileHover={config.enableHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* 2x2 image grid */}
                  <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                    {categoryTools.slice(0, 4).map((tool, idx) => (
                      <img
                        key={tool.id}
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    ))}
                    {/* Fill empty slots if less than 4 products */}
                    {Array.from({ length: Math.max(0, 4 - categoryTools.length) }).map((_, idx) => (
                      <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                    ))}
                  </div>
                  {/* +X more badge */}
                  {config.showBadges && (
                    <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">+{categoryTools.length} more</div>
                  )}
                  {/* Category name */}
                  {config.showCategories && (
                    <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{category}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Product Modal */}
      {modalOpen && !selectedProduct && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedProduct(null)
          }}
          title={selectedCategory || ''}
          icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🛠️'}
          items={getModalItems()}
          onProductClick={(product) => {
            const categoryTools = groupedTools[selectedCategory || ''] || [];
            setModalProductList(categoryTools);
            setModalProductIndex(categoryTools.findIndex(p => p.id === product.id));
            setSelectedProduct(product);
            setModalOpen(false);
          }}
        />
      )}

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
          <ProductDetails
            product={selectedProduct}
            onClose={closeProductDetails}
            products={modalProductList}
            currentIndex={modalProductIndex ?? 0}
            onNavigate={direction => {
              if (!modalProductList.length || modalProductIndex === null) return;
              let newIndex = modalProductIndex;
              if (direction === 'prev' && modalProductIndex > 0) newIndex--;
              if (direction === 'next' && modalProductIndex < modalProductList.length - 1) newIndex++;
              setSelectedProduct(modalProductList[newIndex]);
              setModalProductIndex(newIndex);
            }}
          />
        </div>
      )}
    </motion.section>
  )
} 