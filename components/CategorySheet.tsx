"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishlistButton from './WishlistButton';

// Gardening essentials categories (matching CategorySlider)
const gardeningCategories = [
  { name: 'All', icon: '🌱' },
  { name: 'Offers', icon: '🎁' },
  { name: 'Wishlist', icon: '❤️' },
  { name: 'Indoor Plants', icon: '🪴' },
  { name: 'Flowering Plants', icon: '🌸' },
  { name: 'Pots & Planters', icon: '🏺' },
  { name: 'Seeds', icon: '🌾' },
  { name: 'Tools', icon: '🛠️' },
];

// Mock gardening products (add more as needed)
const gardeningProducts = [
  { id: 1, name: 'Areca Palm', price: 499, image: '/plants/areca-palm.jpg', category: 'Indoor Plants', badge: 'Air Purifying' },
  { id: 2, name: 'Peace Lily', price: 399, image: '/plants/peace-lily.jpg', category: 'Indoor Plants', badge: 'Flowering' },
  { id: 3, name: 'Rose Plant', price: 299, image: '/plants/rose.jpg', category: 'Flowering Plants', badge: 'Fragrant' },
  { id: 4, name: 'Money Plant', price: 199, image: '/plants/money-plant.jpg', category: 'Indoor Plants', badge: 'Easy Care' },
  { id: 5, name: 'Terracotta Pot', price: 99, image: '/pots/terracotta.jpg', category: 'Pots & Planters' },
  { id: 6, name: 'Organic Seeds', price: 49, image: '/seeds/organic.jpg', category: 'Seeds', badge: 'Organic' },
  { id: 7, name: 'Garden Trowel', price: 150, image: '/tools/trowel.jpg', category: 'Tools' },
  { id: 8, name: 'Combo Offer: 3 Plants', price: 999, image: '/plants/combo.jpg', category: 'Offers', badge: 'Best Value' },
  { id: 9, name: 'Wishlist Sample', price: 123, image: '/plants/sample.jpg', category: 'Wishlist' },
];

interface CategorySheetProps {
  open: boolean;
  onClose: () => void;
}

export default function CategorySheet({ open, onClose }: CategorySheetProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    if (!open) setSelectedCategory('All');
  }, [open]);

  const filteredProducts = selectedCategory === 'All'
    ? gardeningProducts
    : gardeningProducts.filter(p => p.category === selectedCategory);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/20"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom Sheet */}
          <motion.div
            className="relative w-full max-w-md h-[80vh] bg-white rounded-t-2xl shadow-2xl flex overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Sidebar */}
            <div className="w-28 bg-green-50 border-r border-green-100 flex flex-col items-center py-4 gap-2 overflow-y-auto">
              {gardeningCategories.map((cat) => (
                <button
                  key={cat.name}
                  className={`flex flex-col items-center w-full py-2 rounded-xl mb-1 transition-all duration-200 focus:outline-none ${
                    selectedCategory === cat.name
                      ? 'bg-green-200 text-green-800 font-bold shadow'
                      : 'text-gray-600 hover:bg-green-100'
                  }`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="text-2xl mb-1">{cat.icon}</span>
                  <span className="text-xs font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
            {/* Product Grid */}
            <div className="flex-1 p-4 overflow-y-auto bg-white">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-bold text-green-800">{selectedCategory}</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center">
                  <span className="text-xl">&times;</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-green-50 rounded-xl shadow p-2 flex flex-col items-center border border-green-100">
                    <div className="w-20 h-20 bg-white rounded-lg mb-2 flex items-center justify-center overflow-hidden border border-green-100">
                      <img src={product.image} alt={product.name} className="object-contain w-full h-full" />
                    </div>
                    <div className="font-semibold text-xs text-gray-800 text-center truncate w-full">{product.name}</div>
                    {product.badge && (
                      <div className="text-[10px] text-green-600 font-semibold mb-1 bg-green-100 px-1.5 py-0.5 rounded-full shadow-sm mt-1">{product.badge}</div>
                    )}
                    <div className="text-green-700 font-bold text-sm mt-1">9{product.price.toFixed(2)}</div>
                    <div className="flex gap-2 mt-2">
                      <WishlistButton product={{ id: product.id, name: product.name, price: product.price, image: product.image }} />
                      <button className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow transition-all duration-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l.89 4.44a2 2 0 0 0 2 1.56h9.72a2 2 0 0 0 2-1.56L23 6H6" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-2 text-center text-gray-400 py-8">No products found in this category.</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 