'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';
import ProductDetails from './ProductDetails';
import WishlistButton from './WishlistButton';
import PlaceholderImage from './PlaceholderImage';
import { useCart } from '../context/CartContext';
import { getProducts } from '@/lib/firebase';

interface PlanterProduct {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  badgeColor?: string;
  category: string;
  subcategory: string;
  features: string[];
}

export default function PlantersSection() {
  const { addToCart } = useCart();
  const [planters, setPlanters] = useState<PlanterProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null);
  const [modalProductList, setModalProductList] = useState<PlanterProduct[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  useEffect(() => {
    loadPlanters();
  }, []);

  const loadPlanters = async () => {
    try {
      const allProducts = await getProducts() as PlanterProduct[];
      
      // Filter products that are planter related
      const planterProducts = allProducts
        .filter(product => {
          const category = product.category?.toLowerCase() || '';
          const name = product.name?.toLowerCase() || '';
          const subcategory = product.subcategory?.toLowerCase() || '';
          
          // Check if any field contains planter-related keywords
          const planterKeywords = [
            'planter', 'planters', 'pot', 'pots', 'container', 'vase', 'urn',
            'planter pot', 'flower pot', 'garden pot', 'ceramic pot', 'plastic pot',
            'terracotta', 'hanging', 'self-watering', 'decorative pot'
          ];
          
          return planterKeywords.some(keyword => 
            category.includes(keyword) || 
            name.includes(keyword) || 
            subcategory.includes(keyword)
          );
        });

      setPlanters(planterProducts);
    } catch (error) {
      console.error('Error loading planters:', error);
      // Fallback to empty array if Firebase fails
      setPlanters([]);
    } finally {
      setLoading(false);
    }
  };

  // Group planters by subcategory and select top-rated ones
  const getPlantersBySubcategory = () => {
    const subcategoryGroups: { [key: string]: PlanterProduct[] } = {};
    
    planters.forEach(product => {
      const subcategory = product.subcategory || 'General Planters';
      if (!subcategoryGroups[subcategory]) {
        subcategoryGroups[subcategory] = [];
      }
      subcategoryGroups[subcategory].push(product);
    });

    // For each subcategory, sort by rating and take top 4
    const planterCategories = Object.entries(subcategoryGroups).map(([subcategoryName, subcategoryProducts]) => {
      const sortedProducts = subcategoryProducts
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 4);

      return {
        title: subcategoryName,
        icon: getSubcategoryIcon(subcategoryName),
        items: sortedProducts
      };
    });

    return planterCategories;
  };

  const getSubcategoryIcon = (subcategory: string) => {
    const iconMap: { [key: string]: string } = {
      'Ceramic Pots': '🏺',
      'Plastic Planters': '🪴',
      'Terracotta Pots': '🏺',
      'Hanging Planters': '🪝',
      'Self-Watering': '💧',
      'Decorative Pots': '✨',
      'General Planters': '🏺'
    };
    return iconMap[subcategory] || '🏺';
  };

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const getModalItems = () => {
    if (!selectedCategory) return [];
    
    const categoryProducts = planters.filter(product => product.subcategory === selectedCategory);
    
    return categoryProducts.map((product) => ({
      ...product,
      wishlistButton: <WishlistButton product={{ 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: product.image 
      }} />
    }));
  };

  const handleProductClick = (product: any) => {
    // Find the product list and index for navigation
    const items = getModalItems();
    const index = items.findIndex((p) => p.id === product.id);
    setModalProductList(items);
    setModalProductIndex(index);
    setSelectedProduct(product);
    setModalOpen(false);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
    setModalProductList([]);
    setModalProductIndex(null);
  };

  const handleNavigateProduct = (direction: 'prev' | 'next') => {
    if (modalProductList.length === 0 || modalProductIndex === null) return;
    let newIndex = modalProductIndex;
    if (direction === 'prev' && modalProductIndex > 0) newIndex--;
    if (direction === 'next' && modalProductIndex < modalProductList.length - 1) newIndex++;
    setSelectedProduct(modalProductList[newIndex]);
    setModalProductIndex(newIndex);
  };

  const planterCategories = getPlantersBySubcategory();

  if (loading) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🏺 Planters & Pots
        </h2>
        <div className="relative flex items-center">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start animate-pulse"
              >
                <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="w-16 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-20 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  if (planterCategories.length === 0) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 px-4 pt-4 pb-2">
          🏺 Planters & Pots
        </h2>
        <div className="text-center py-8 px-4">
          <p className="text-gray-500">No planters available at the moment.</p>
          <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin to add planter products.</p>
        </div>
      </motion.section>
    );
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
        🏺 Planters & Pots
      </motion.h2>
      <div className="relative flex items-center">
        {/* Slider */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
          {planterCategories.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg border border-gray-100 rounded-xl p-2 md:p-3 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[120px] max-w-[140px] md:min-w-[140px] md:max-w-[160px] mx-auto snap-start"
              onClick={() => handleCardClick(item.title)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* 2x2 image grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                {item.items.slice(0, 4).map((prod, idx) => (
                  prod.image ? (
                    <img
                      key={prod.id}
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                    />
                  ) : (
                    <PlaceholderImage
                      key={prod.id}
                      width={40}
                      height={40}
                      text="No Image"
                      className="w-full h-full aspect-square object-cover rounded bg-gray-50 border border-gray-100"
                    />
                  )
                ))}
                {/* Fill empty slots if less than 4 products */}
                {Array.from({ length: Math.max(0, 4 - item.items.length) }).map((_, idx) => (
                  <div key={`empty-${idx}`} className="w-full h-full aspect-square rounded bg-gray-100 border border-gray-200" />
                ))}
              </div>
              {/* +X more badge */}
              <div className="text-[10px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-1.5 py-0.5 rounded-full shadow-sm">
                {item.items.length} product{item.items.length !== 1 ? 's' : ''}
              </div>
              {/* Category name */}
              <div className="text-[10px] md:text-xs font-bold text-gray-800 text-center leading-tight mt-0.5">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Product Modal */}
      {modalOpen && !selectedProduct && (
        <ProductModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setSelectedProduct(null);
          }}
          title={selectedCategory || ''}
          icon={selectedCategory ? getSubcategoryIcon(selectedCategory) : '🏺'}
          items={getModalItems()}
          onProductClick={handleProductClick}
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
            onNavigate={handleNavigateProduct}
          />
        </div>
      )}

      {/* Cart Success Message */}
      {showCartSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[70] bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-semibold shadow-lg border border-green-200"
        >
          ✓ Added "{showCartSuccess}" to cart!
        </motion.div>
      )}
    </motion.section>
  );
} 