'use client';

import { motion } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, X } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import WishlistButton from './WishlistButton';
import { useState } from 'react';

export default function WishlistSection() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null);

  const handleAddToCart = (product: any) => {
    addToCart({ ...product, qty: 1 });
    
    // Show success message
    setShowCartSuccess(product.name);
    setTimeout(() => setShowCartSuccess(null), 2000);
  };

  const handleAddAllToCart = () => {
    wishlist.forEach(product => addToCart({ ...product, qty: 1 }));
    
    // Show success message
    setShowCartSuccess('All items');
    setTimeout(() => setShowCartSuccess(null), 2000);
  };

  if (wishlist.length === 0) {
    return (
      <section className="py-8 bg-white" id="wishlist">
        <div className="px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              My Wishlist
            </h2>
          </div>
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start adding your favorite plants and gardening items!</p>
            <a href="#trending-plants" className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
              Explore Products
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 bg-white" id="wishlist">
      <div className="px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            My Wishlist ({wishlist.length})
          </h2>
          <button
            onClick={clearWishlist}
            className="text-red-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                <WishlistButton product={product} />
                {product.badge && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {product.badge}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-green-600">
                    ₹{product.price}
                  </span>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <button
            onClick={handleAddAllToCart}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
          >
            <ShoppingCart className="w-5 h-5" />
            Add All to Cart
          </button>
        </div>
      </div>
      
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
    </section>
  );
} 