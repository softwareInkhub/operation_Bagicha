'use client'

import { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, X, Minus, Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function FloatingCartBar() {
  const { cart, cartCount, addToCart, removeFromCart, clearCart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      console.log('FloatingCartBar received footer-visibility:', e.detail.visible);
      setIsFooterVisible(e.detail.visible);
    };
    window.addEventListener('footer-visibility', handler);
    return () => window.removeEventListener('footer-visibility', handler);
  }, []);

  // Hide cart bar on checkout page
  if (pathname.startsWith('/checkout')) return null;

  // Move cart button a bit further to the left for a more centered appearance
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  // Handlers for quantity
  const handleQty = (name: string, delta: number) => {
    const item = cart.find(i => i.name === name);
    if (item) {
      const newQty = item.qty + delta;
      if (newQty <= 0) {
        removeFromCart(name);
      } else {
        addToCart({ ...item, qty: delta });
      }
    }
  };

  return (
    <>
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-20 z-50 flex items-center justify-center pointer-events-none"
            style={{ bottom: isFooterVisible ? '80px' : '20px', transition: 'bottom 0.4s' }}
          >
            <button
              className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-xl hover:shadow-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 border-4 border-white pointer-events-auto"
              aria-label="Open cart"
              style={{ boxShadow: '0 4px 24px 0 rgba(34,197,94,0.15)' }}
              onClick={() => setOpen(true)}
            >
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7 text-white" />
              <span className="absolute -top-1 -right-1 bg-white text-green-600 text-xs md:text-sm font-bold rounded-full px-1.5 py-0.5 border-2 border-green-500 shadow-md min-w-[1.2rem] text-center">
                {cartCount}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal/Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:justify-center bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative w-full max-w-xs md:max-w-sm bg-white/90 backdrop-blur-lg rounded-t-2xl md:rounded-xl shadow-xl border border-green-100 p-3 md:p-4 flex flex-col max-h-[80vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/70 hover:bg-gray-100 flex items-center justify-center shadow"
                onClick={() => setOpen(false)}
                aria-label="Close cart"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
              <h2 className="text-base font-bold text-green-700 mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" /> Your Cart
              </h2>
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <ShoppingCart className="w-10 h-10 mb-2" />
                  <span className="text-sm">Your cart is empty.</span>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto space-y-2 mb-3">
                    {cart.map((item) => (
                      <motion.div
                        key={item.name}
                        className="flex items-center gap-2 bg-white/80 rounded-lg shadow p-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <div className="font-semibold text-gray-900 truncate text-xs">{item.name}</div>
                            {item.category && (
                              <span className="ml-1 bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">{item.category}</span>
                            )}
                          </div>
                          {item.description && (
                            <div className="text-[10px] text-gray-500 truncate mt-0.5">{item.description}</div>
                          )}
                          <div className="text-green-700 font-bold text-xs mt-0.5">₹{item.price}</div>
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center text-xs font-bold text-green-600 border border-gray-200"
                              onClick={() => handleQty(item.name, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-semibold text-gray-800 min-w-[16px] text-center">{item.qty}</span>
                            <button
                              className="w-6 h-6 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center text-xs font-bold text-green-600 border border-gray-200"
                              onClick={() => handleQty(item.name, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          className="ml-1 text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50"
                          onClick={() => removeFromCart(item.name)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <button
                      className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors"
                      onClick={clearCart}
                    >
                      Empty Cart
                    </button>
                    <div className="text-base font-bold text-green-700">Total: ₹{total.toLocaleString()}</div>
                  </div>
                  <Link href="/checkout" className="block">
                    <button
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 rounded-lg shadow transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-green-400"
                    >
                      Checkout
                    </button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 