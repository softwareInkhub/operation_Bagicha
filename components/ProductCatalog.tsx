'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import WishlistButton from './WishlistButton'

interface Product {
  id: number
  name: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image: string
  badge?: string
  badgeColor?: string
  inStock: boolean
  fastDelivery: boolean
  organic: boolean
  features: string[]
  description: string
}

const products: Product[] = [
  {
    id: 1,
    name: 'Monstera Deliciosa',
    category: 'Indoor Plants',
    subcategory: 'Tropical',
    price: 899,
    originalPrice: 1299,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    badge: 'Trending',
    badgeColor: 'bg-red-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Low Maintenance', 'Pet Safe'],
    description: 'Large, glossy leaves with distinctive holes and splits. Perfect for modern interiors.'
  },
  {
    id: 2,
    name: 'Snake Plant',
    category: 'Indoor Plants',
    subcategory: 'Succulent',
    price: 399,
    originalPrice: 599,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    badge: 'Best Seller',
    badgeColor: 'bg-green-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Low Maintenance', 'Drought Tolerant'],
    description: 'Tall, upright leaves with yellow edges. Excellent for beginners.'
  },
  {
    id: 3,
    name: 'Professional Pruner',
    category: 'Tools',
    subcategory: 'Cutting',
    price: 599,
    originalPrice: 799,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Premium',
    badgeColor: 'bg-purple-500',
    inStock: true,
    fastDelivery: false,
    organic: false,
    features: ['Sharp Blades', 'Ergonomic Grip', 'Safety Lock'],
    description: 'Professional-grade pruner for precise cutting and trimming.'
  },
  {
    id: 4,
    name: 'Organic Potting Mix',
    category: 'Soil & Fertilizer',
    subcategory: 'Potting Mix',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Organic',
    badgeColor: 'bg-emerald-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Organic', 'Well Draining', 'Nutrient Rich'],
    description: 'Premium organic potting mix enriched with natural nutrients.'
  },
  {
    id: 5,
    name: 'Ceramic Plant Pot',
    category: 'Pots & Planters',
    subcategory: 'Ceramic',
    price: 299,
    originalPrice: 449,
    rating: 4.5,
    reviews: 123,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'New',
    badgeColor: 'bg-blue-500',
    inStock: true,
    fastDelivery: false,
    organic: false,
    features: ['Drainage Hole', 'Modern Design', 'Durable'],
    description: 'Beautiful ceramic pot with modern design and drainage hole.'
  },
  {
    id: 6,
    name: 'Tomato Seeds Pack',
    category: 'Seeds',
    subcategory: 'Vegetables',
    price: 49,
    originalPrice: 79,
    rating: 4.5,
    reviews: 267,
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    badge: 'Heirloom',
    badgeColor: 'bg-orange-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Heirloom', 'High Yield', 'Disease Resistant'],
    description: 'Organic heirloom tomato seeds for home gardening.'
  },
  {
    id: 7,
    name: 'Bamboo Plant',
    category: 'Lucky Plants',
    subcategory: 'Indoor',
    price: 349,
    originalPrice: 499,
    rating: 4.6,
    reviews: 110,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Easy Care', 'Symbolic', 'Air Purifying'],
    description: 'Lucky bamboo for prosperity and good fortune.'
  },
  {
    id: 8,
    name: 'Aloe Vera',
    category: 'Medicinal Plants',
    subcategory: 'Succulent',
    price: 199,
    originalPrice: 299,
    rating: 4.7,
    reviews: 140,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Medicinal',
    badgeColor: 'bg-lime-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Healing', 'Low Maintenance', 'Air Purifying'],
    description: 'Aloe Vera for skin care and healing.'
  },
  {
    id: 9,
    name: 'Areca Palm',
    category: 'Air Purifying',
    subcategory: 'Indoor',
    price: 799,
    originalPrice: 1099,
    rating: 4.6,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Air Purifier',
    badgeColor: 'bg-cyan-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Air Purifying', 'Pet Safe', 'Low Light'],
    description: 'Areca Palm for clean indoor air.'
  },
  {
    id: 10,
    name: 'Jade Plant',
    category: 'Succulents',
    subcategory: 'Indoor',
    price: 399,
    originalPrice: 599,
    rating: 4.5,
    reviews: 145,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Lucky',
    badgeColor: 'bg-yellow-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Low Maintenance', 'Symbolic', 'Air Purifying'],
    description: 'Jade Plant for good luck and prosperity.'
  },
  {
    id: 11,
    name: 'Spider Plant',
    category: 'Pet Friendly',
    subcategory: 'Indoor',
    price: 299,
    originalPrice: 399,
    rating: 4.4,
    reviews: 120,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Pet Friendly',
    badgeColor: 'bg-pink-400',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Safe for Pets', 'Air Purifying', 'Easy Care'],
    description: 'Spider Plant is safe for pets and purifies air.'
  },
  {
    id: 12,
    name: 'Rubber Plant',
    category: 'Statement Plants',
    subcategory: 'Indoor',
    price: 599,
    originalPrice: 899,
    rating: 4.7,
    reviews: 175,
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    badge: 'Statement',
    badgeColor: 'bg-indigo-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Large Leaves', 'Air Purifying', 'Modern Look'],
    description: 'Rubber Plant for a bold, modern statement.'
  },
  {
    id: 13,
    name: 'Calathea',
    category: 'Decorative Plants',
    subcategory: 'Indoor',
    price: 499,
    originalPrice: 699,
    rating: 4.6,
    reviews: 130,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    badge: 'Decorative',
    badgeColor: 'bg-fuchsia-500',
    inStock: true,
    fastDelivery: true,
    organic: true,
    features: ['Patterned Leaves', 'Air Purifying', 'Pet Safe'],
    description: 'Calathea with beautiful patterned leaves.'
  }
]

export default function ProductCatalog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Group products by category
  const groupedProducts: { [category: string]: Product[] } = {};
  products.forEach(product => {
    if (!groupedProducts[product.category]) groupedProducts[product.category] = [];
    groupedProducts[product.category].push(product);
  });

  // Prepare cards for two-row slider
  const cardEntries = Object.entries(groupedProducts);
  const cardsPerRow = Math.ceil(cardEntries.length / 2);
  const rows = [
    cardEntries.slice(0, cardsPerRow),
    cardEntries.slice(cardsPerRow)
  ];

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Tools': '🛠️',
      'Soil & Fertilizer': '🪨',
      'Pots & Planters': '🏺',
      'Seeds': '🌾',
      'Lucky Plants': '🍀',
      'Medicinal Plants': '💊',
      'Air Purifying': '🌿',
      'Succulents': '🌵',
      'Pet Friendly': '🐾',
      'Statement Plants': '🌳',
      'Decorative Plants': '🎨'
    };
    return icons[category] || '🌱';
  };

  const getModalItems = () => {
    if (!selectedCategory) return [];
    return groupedProducts[selectedCategory].slice(0, 4).map(product => ({
      name: product.name,
      image: product.image,
      price: product.price,
      rating: product.rating,
      reviews: product.reviews,
      description: product.features.join(', '),
      wishlistButton: <WishlistButton product={product} />
    }));
  };

  return (
    <motion.section 
      className="py-6 bg-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="px-4">
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
            <p className="text-gray-600 mt-1">Discover our complete collection of gardening essentials</p>
          </div>
        </motion.div>
        
        <div className="flex flex-col gap-4">
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 pb-2 scrollbar-none w-full">
              {row.map(([category, items], idx) => {
                const images = [
                  ...items.slice(0, 4),
                  ...Array(4 - items.length).fill({ image: '/placeholder.png', name: 'Placeholder', id: `ph-${category}-${idx}` })
                ].slice(0, 4);
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08, ease: 'easeOut' }}
                    viewport={{ once: true, amount: 0.2 }}
                    className="bg-white shadow-lg border border-gray-100 rounded-2xl p-4 flex flex-col items-center min-w-[140px] max-w-[160px] mx-auto snap-start cursor-pointer"
                    whileHover={{ scale: 1.07 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleCardClick(category)}
                  >
                    {/* 2x2 image grid */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                      {images.map((product, iidx) => (
                        <img
                          key={product.id || iidx}
                          src={product.image}
                          alt={product.image === '/placeholder.png' ? 'Placeholder' : product.name}
                          className="w-10 h-10 md:w-12 md:h-12 object-contain rounded bg-gray-50 border border-gray-100 mx-auto"
                        />
                      ))}
                    </div>
                    {/* +X more badge */}
                    <div className="text-[11px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-2 py-0.5 rounded-full shadow-sm">
                      +{items.length} more
                    </div>
                    {/* Category name */}
                    <div className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight mt-0.5">
                      {category}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory || ''}
        icon={selectedCategory ? getCategoryIcon(selectedCategory) : '🌱'}
        items={getModalItems()}
      />
    </motion.section>
  )
} 