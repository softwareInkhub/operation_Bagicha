"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WishlistButton from './WishlistButton';
import ProductDetails from './ProductDetails';
import { getProducts, getCategories } from '@/lib/firebase';

interface CategorySheetProps {
  open: boolean;
  onClose: () => void;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
  rating?: number;
  reviews?: number;
  [key: string]: any;
}

interface Category {
  id?: string;
  name: string;
  icon: string;
  [key: string]: any;
}

export default function CategorySheet({ open, onClose }: CategorySheetProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([{ name: 'All', icon: '🌱' }]);
  const [catLoading, setCatLoading] = useState(true);
  const [modalProductList, setModalProductList] = useState<Product[]>([]);
  const [modalProductIndex, setModalProductIndex] = useState<number | null>(null);

  // Default static categories with icons
  const staticCategories: Category[] = [
    { name: 'All', icon: '🌱' },
    { name: 'Offers', icon: '🎁' },
    { name: 'Indoor Plants', icon: '🪴' },
    { name: 'Flowering Plants', icon: '🌸' },
    { name: 'Pots & Planters', icon: '🏺' },
    { name: 'Seeds', icon: '🌾' },
    { name: 'Tools', icon: '🛠️' },
  ];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const allProducts = await getProducts();
        setProducts(allProducts as Product[]);
      } catch (e) {
        setProducts([]);
      }
      setLoading(false);
    }
    if (open) fetchProducts();
  }, [open]);

  useEffect(() => {
    async function fetchCategories() {
      setCatLoading(true);
      try {
        const allCategories = await getCategories();
        // Merge static and dynamic categories, avoiding duplicates by name
        const merged = [
          ...staticCategories,
          ...allCategories.filter(
            (cat: any) => !staticCategories.some(staticCat => staticCat.name === cat.name)
          ),
        ] as Category[];
        setCategories(merged);
      } catch (e) {
        setCategories(staticCategories);
      }
      setCatLoading(false);
    }
    if (open) fetchCategories();
  }, [open]);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

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
            className="relative w-full max-w-md h-[70vh] bg-white rounded-t-2xl shadow-2xl flex overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Sidebar */}
            <div className="w-20 bg-green-50 border-r border-green-100 flex flex-col items-start py-2 gap-1 overflow-y-auto">
              {catLoading ? (
                <div className="text-gray-400 text-xs px-2 py-4">Loading...</div>
              ) : categories.length === 0 ? (
                <div className="text-gray-400 text-xs px-2 py-4">No categories found.</div>
              ) : categories.map((cat, idx) => (
                <button
                  key={cat.name}
                  className={`flex flex-col items-center w-full py-1 rounded-lg ${
                    selectedCategory === cat.name
                      ? 'bg-green-200 text-green-800 font-bold shadow'
                      : 'text-gray-600 hover:bg-green-100'
                  } ${idx !== categories.length - 1 ? 'mb-0.5' : 'mb-0'}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="text-lg mb-0.5">{cat.icon || '🌱'}</span>
                  <span className="text-[10px] font-medium">{cat.name}</span>
                </button>
              ))}
            </div>
            {/* Product Grid */}
            <div className="flex-1 flex flex-col bg-white">
              <div className="flex items-center justify-between px-2 py-2 border-b border-green-100 bg-white sticky top-0 z-10">
                <h2 className="text-base font-bold text-green-800">{selectedCategory}</h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full hover:bg-green-100 flex items-center justify-center transition"
                  aria-label="Close"
                >
                  <span className="text-xl font-bold text-gray-500">&times;</span>
                </button>
              </div>
              <div className="p-2 overflow-y-auto flex-1">
                <div className="grid grid-cols-2 gap-3">
                {loading ? (
                  <div className="col-span-2 text-center text-gray-400 py-8">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-400 py-8">No products found in this category.</div>
                ) : filteredProducts.map((product, idx) => (
                  <div key={product.id} onClick={() => {
                    setModalProductList(filteredProducts);
                    setModalProductIndex(idx);
                    setSelectedProduct(product);
                  }} className="relative cursor-pointer group h-32 overflow-hidden rounded-lg bg-white shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Wishlist Button */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <WishlistButton 
                        product={{ id: String(product.id), name: product.name, price: product.price, image: product.image }} 
                        size="sm"
                        className="w-6 h-6 bg-white/90 hover:bg-white shadow-sm border border-gray-200"
                      />
                    </div>
                    
                    {/* Product Image - Square Format */}
                    <div className="w-full h-full">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    
                    {/* Overlay with Product Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-1">
                      {/* Badge */}
                      {product.badge && (
                        <div className="inline-block text-[5px] text-white font-bold bg-green-500/90 px-1 py-0.5 rounded-full mb-0.5 uppercase tracking-wide">
                          {product.badge}
                        </div>
                      )}
                      
                      {/* Product Name */}
                      <h3 className="text-[7px] font-semibold text-white mb-0.5 line-clamp-1 leading-tight">{product.name}</h3>
                      
                      {/* Price */}
                      <div className="text-[7px] font-bold text-white">₹{Number(product.price).toFixed(2)}</div>
                    </div>
                    
                    {/* Quick Add Button - Appears on Hover */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                      <button className="bg-white text-green-600 text-xs font-bold px-3 py-2 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-200 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <circle cx="9" cy="21" r="1" />
                          <circle cx="20" cy="21" r="1" />
                          <path d="M1 1h4l.89 4.44a2 2 0 0 0 2 1.56h9.72a2 2 0 0 0 2-1.56L23 6H6" />
                        </svg>
                        Add
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
          <ProductDetails
            product={{
              ...selectedProduct,
              rating: selectedProduct.rating || 4.5,
              reviews: selectedProduct.reviews || 128
            }}
            onClose={() => setSelectedProduct(null)}
            products={modalProductList.map(p => ({
              ...p,
              rating: p.rating || 4.5,
              reviews: p.reviews || 128
            }))}
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
    </AnimatePresence>
  );
} 