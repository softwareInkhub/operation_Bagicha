'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import ProductDetails from './ProductDetails'
import WishlistButton from './WishlistButton'
import PlaceholderImage from './PlaceholderImage'
import { useComponentConfig } from '@/lib/useComponentConfig'
import { getProducts } from '@/lib/firebase'

export default function ToolsAndAccessories() {
  const [tools, setTools] = useState<any[]>([])
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

  // Prepare cards for single product display
  const cardsPerRow = 4 // Show 4 products per row
  const rows = []
  for (let i = 0; i < filteredTools.length; i += cardsPerRow) {
    rows.push(filteredTools.slice(i, i + cardsPerRow))
  }

  const handleCardClick = (product: any) => {
    setSelectedProduct(product)
    setModalProductList(filteredTools)
    setModalProductIndex(filteredTools.findIndex(p => p.id === product.id))
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



  const getModalItems = () => {
    return filteredTools.map((tool, index) => ({
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
      
      {/* Single product cards */}
      <div className="space-y-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="relative flex items-center">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
              {row.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: (rowIndex * 0.1) + (index * 0.1) }}
                  className={`bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start ${
                    config.enableHover ? 'hover:scale-105 hover:shadow-2xl' : ''
                  }`}
                  onClick={() => handleCardClick(product)}
                  whileHover={config.enableHover ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* Single product image */}
                  <div className="w-full mb-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 md:h-28 aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    ) : (
                      <PlaceholderImage
                        width={120}
                        height={120}
                        text="No Image"
                        className="w-full h-24 md:h-28 aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                      />
                    )}
                  </div>
                  
                  {/* Product name */}
                  <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mb-1 line-clamp-2">
                    {product.name}
                  </div>
                  
                  {/* Price */}
                  {config.showPrices && (
                    <div className="text-[10px] md:text-xs font-semibold text-green-600 mb-1">
                      ₹{product.price}
                    </div>
                  )}
                  
                  {/* Rating */}
                  {config.showRatings && product.rating && (
                    <div className="text-[10px] text-gray-600 mb-1">
                      ⭐ {product.rating} ({product.reviews || 0})
                    </div>
                  )}
                  
                  {/* Category badge */}
                  {config.showCategories && (
                    <div className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {product.category}
                    </div>
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
          title="Tools & Accessories"
          icon="🛠️"
          items={getModalItems()}
          onProductClick={(product) => {
            setModalProductList(filteredTools);
            setModalProductIndex(filteredTools.findIndex(p => p.id === product.id));
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