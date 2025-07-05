'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';
import ProductDetails from './ProductDetails';
import WishlistButton from './WishlistButton';
import { useCart } from '../context/CartContext';
import { getProducts } from '@/lib/firebase';

interface FertilizerProduct {
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
  features: string[];
}

export default function FertilizerSection() {
  const { addToCart } = useCart();
  const [fertilizers, setFertilizers] = useState<FertilizerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null);
  const [modalProductList, setModalProductList] = useState<FertilizerProduct[]>([])
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null)

  useEffect(() => {
    loadFertilizers();
  }, []);

  const loadFertilizers = async () => {
    try {
      const allProducts = await getProducts() as FertilizerProduct[];
      
      // Filter products that are fertilizers, soil, or gardening related
      const fertilizerProducts = allProducts
        .filter(product => 
          product.category?.toLowerCase().includes('fertilizer') ||
          product.category?.toLowerCase().includes('soil') ||
          product.category?.toLowerCase().includes('compost') ||
          product.category?.toLowerCase().includes('organic') ||
          product.name?.toLowerCase().includes('fertilizer') ||
          product.name?.toLowerCase().includes('compost') ||
          product.name?.toLowerCase().includes('manure') ||
          product.name?.toLowerCase().includes('npk') ||
          product.name?.toLowerCase().includes('vermi')
        )
        .map(product => ({
          ...product,
          badge: getFertilizerBadge(product),
          badgeColor: getBadgeColor(product)
        }));

      setFertilizers(fertilizerProducts);
    } catch (error) {
      console.error('Error loading fertilizers:', error);
      // Fallback to empty array if Firebase fails
      setFertilizers([]);
    } finally {
      setLoading(false);
    }
  };

  const getFertilizerBadge = (product: FertilizerProduct) => {
    const name = product.name?.toLowerCase() || '';
    const category = product.category?.toLowerCase() || '';
    
    if (name.includes('organic') || category.includes('organic')) return 'Organic';
    if (name.includes('npk') || name.includes('19:19:19')) return 'Balanced';
    if (name.includes('vermi') || name.includes('compost')) return 'Compost';
    if (name.includes('bone') || name.includes('phosphorus')) return 'Phosphorus Rich';
    if (name.includes('potash') || name.includes('potassium')) return 'Potassium';
    if (name.includes('nitrogen') || name.includes('urea')) return 'Nitrogen';
    if (name.includes('calcium')) return 'Calcium';
    if (name.includes('magnesium') || name.includes('epsom')) return 'Magnesium';
    if (name.includes('seaweed') || name.includes('kelp')) return 'Growth Booster';
    if (name.includes('neem')) return 'Pest Repellent';
    if (name.includes('fish')) return 'Organic Liquid';
    return 'General';
  };

  const getBadgeColor = (product: FertilizerProduct) => {
    const badge = getFertilizerBadge(product);
    const colorMap: { [key: string]: string } = {
      'Organic': 'bg-green-500',
      'Balanced': 'bg-orange-500',
      'Compost': 'bg-brown-500',
      'Phosphorus Rich': 'bg-blue-500',
      'Potassium': 'bg-pink-500',
      'Nitrogen': 'bg-lime-500',
      'Calcium': 'bg-gray-400',
      'Magnesium': 'bg-cyan-500',
      'Growth Booster': 'bg-indigo-500',
      'Pest Repellent': 'bg-yellow-500',
      'Organic Liquid': 'bg-blue-400',
      'General': 'bg-purple-500'
    };
    return colorMap[badge] || 'bg-gray-500';
  };

  // Group by badge for slider rows
  const grouped = fertilizers.reduce((acc, fert) => {
    const badge = fert.badge || 'General';
    if (!acc[badge]) acc[badge] = [];
    acc[badge].push(fert);
    return acc;
  }, {} as { [badge: string]: FertilizerProduct[] });

  const cardEntries = Object.entries(grouped);
  const cardsPerRow = Math.ceil(cardEntries.length / 2);
  const rows = [
    cardEntries.slice(0, cardsPerRow),
    cardEntries.slice(cardsPerRow)
  ];

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleProductClick = (product: any, productList: FertilizerProduct[]) => {
    setModalProductList(productList)
    setModalProductIndex(productList.findIndex(p => p.id === product.id))
    setSelectedProduct(product)
  };

  const closeProductDetails = () => {
    setSelectedProduct(null)
    setModalProductList([])
    setModalProductIndex(null)
  };

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      name: product.name,
      image: product.image,
      price: product.price,
      qty: 1
    });
    
    // Show success message
    setShowCartSuccess(product.name);
    setTimeout(() => setShowCartSuccess(null), 2000);
  };

  const getModalItems = () => {
    if (!selectedCategory) return [];
    const categoryItems = grouped[selectedCategory || ''] || [];
    return categoryItems.map((item) => ({
      ...item,
      wishlistButton: <WishlistButton product={{ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        image: item.image 
      }} />
    }));
  };

  if (loading) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Fertilizers</h2>
          </div>
          <div className="space-y-4">
            {[0, 1].map(rowIdx => (
              <div key={rowIdx} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-[140px] max-w-[160px] bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col animate-pulse"
                  >
                    <div className="w-full h-20 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-2 flex flex-col flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded mb-2 w-2/3"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    );
  }

  if (fertilizers.length === 0) {
    return (
      <motion.section 
        className="mt-0 pt-0 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Fertilizers</h2>
          </div>
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No fertilizers available at the moment.</p>
            <p className="text-sm text-gray-400 mt-2">Please check back later or contact admin to add fertilizer products.</p>
          </div>
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
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Fertilizers</h2>
        </div>
        {/* Two-row horizontal slider */}
        <div className="space-y-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {row.map(([badge, items]) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: rowIdx * 0.1 }}
                  className="min-w-[140px] max-w-[160px] bg-white rounded-lg shadow-md flex-shrink-0 flex flex-col cursor-pointer relative"
                  onClick={() => handleCardClick(badge)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img 
                    src={items[0].image || 'https://via.placeholder.com/160x80?text=No+Image'} 
                    alt={items[0].name} 
                    className="w-full h-20 object-cover rounded-t-lg" 
                  />
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {badge}
                  </div>
                  <div className="absolute top-1 right-1">
                    <WishlistButton product={items[0]} size="sm" />
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2">{items[0].name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                      <span>★ {items[0].rating || 4.0}</span>
                      <span>({items[0].reviews || 0})</span>
                    </div>
                    <p className="text-[10px] text-gray-700 mb-2 line-clamp-2">
                      {items[0].features?.join(', ') || 'Quality fertilizer for better growth'}
                    </p>
                    <span className="text-sm font-bold text-green-600 mb-1">₹{items[0].price}</span>
                    {items[0].originalPrice && items[0].originalPrice > items[0].price && (
                      <span className="text-[10px] text-gray-400 line-through mb-1">₹{items[0].originalPrice}</span>
                    )}
                    <button 
                      className="mt-auto bg-green-600 hover:bg-green-700 text-white text-[10px] font-semibold px-2 py-1 rounded-lg transition-colors text-center"
                      onClick={(e) => handleAddToCart(items[0], e)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        {/* Modal for grouped items */}
        {modalOpen && !selectedProduct && (
          <ProductModal
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedProduct(null);
            }}
            title={selectedCategory || ''}
            icon="🪨"
            items={getModalItems()}
            onProductClick={(product) => handleProductClick(product, grouped[selectedCategory || ''] || [])}
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
      </div>
    </motion.section>
  );
} 