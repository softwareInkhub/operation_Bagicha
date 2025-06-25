import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductModal from './ProductModal'
import WishlistButton from './WishlistButton'

const bestsellers = [
  { title: 'Indoor Plants', icon: '🪴', items: [
    { name: 'Areca Palm', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 299, rating: 4.5, reviews: 128 },
    { name: 'Snake Plant', image: 'https://cdn-icons-png.flaticon.com/512/766/766083.png', price: 199, rating: 4.8, reviews: 89 },
    { name: 'Peace Lily', image: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', price: 349, rating: 4.6, reviews: 156 },
    { name: 'ZZ Plant', image: 'https://cdn-icons-png.flaticon.com/512/616/616494.png', price: 249, rating: 4.7, reviews: 203 },
  ] },
  { title: 'Flowering Plants', icon: '🌸', items: [
    { name: 'Rose', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 399, rating: 4.9, reviews: 234 },
    { name: 'Jasmine', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 299, rating: 4.4, reviews: 167 },
    { name: 'Hibiscus', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 199, rating: 4.3, reviews: 98 },
    { name: 'Bougainvillea', image: 'https://cdn-icons-png.flaticon.com/512/616/616554.png', price: 449, rating: 4.6, reviews: 145 },
  ] },
  { title: 'Pots & Gamlas', icon: '🏺', items: [
    { name: 'Clay Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 149, rating: 4.2, reviews: 78 },
    { name: 'Plastic Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 99, rating: 4.0, reviews: 56 },
    { name: 'Ceramic Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 299, rating: 4.5, reviews: 123 },
    { name: 'Hanging Pot', image: 'https://cdn-icons-png.flaticon.com/512/616/616490.png', price: 199, rating: 4.3, reviews: 87 },
  ] },
  { title: 'Soil & Fertilizer', icon: '🪨', items: [
    { name: 'Potting Mix', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 199, rating: 4.7, reviews: 189 },
    { name: 'Vermicompost', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 149, rating: 4.8, reviews: 234 },
    { name: 'Cocopeat', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 99, rating: 4.4, reviews: 156 },
    { name: 'Bone Meal', image: 'https://cdn-icons-png.flaticon.com/512/616/616495.png', price: 179, rating: 4.6, reviews: 98 },
  ] },
  { title: 'Seeds', icon: '🌾', items: [
    { name: 'Tomato Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 49, rating: 4.5, reviews: 267 },
    { name: 'Chili Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 39, rating: 4.3, reviews: 189 },
    { name: 'Marigold Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 29, rating: 4.7, reviews: 145 },
    { name: 'Basil Seeds', image: 'https://cdn-icons-png.flaticon.com/512/616/616497.png', price: 59, rating: 4.6, reviews: 98 },
  ] },
  { title: 'Gardening Tools', icon: '🛠️', items: [
    { name: 'Pruner', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 399, rating: 4.8, reviews: 178 },
    { name: 'Trowel', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 199, rating: 4.4, reviews: 123 },
    { name: 'Gloves', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 149, rating: 4.6, reviews: 234 },
    { name: 'Watering Can', image: 'https://cdn-icons-png.flaticon.com/512/2909/2909765.png', price: 299, rating: 4.5, reviews: 167 },
  ] },
]

export default function BestsellerSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleCardClick = (category: string) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const getModalItems = () => {
    if (!selectedCategory) return [];
    const category = bestsellers.find(b => b.title === selectedCategory);
    return category ? category.items.map((item, index) => ({
      ...item,
      wishlistButton: <WishlistButton product={{ 
        id: index + 1, 
        name: item.name, 
        price: item.price, 
        image: item.image 
      }} />
    })) : [];
  };

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
        🌟 Bestsellers
      </motion.h2>
      <div className="relative flex items-center">
        {/* Slider */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-3 md:gap-5 px-2 md:px-10 scrollbar-none w-full">
          {bestsellers.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white shadow-lg border border-gray-100 rounded-2xl p-2 md:p-4 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer min-w-[140px] max-w-[160px] md:min-w-[170px] md:max-w-[200px] mx-auto snap-start"
              onClick={() => handleCardClick(item.title)}
              whileHover={{ scale: 1.07 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* 2x2 image grid */}
              <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full mb-2">
                {item.items.slice(0, 4).map((prod, idx) => (
                  <img
                    key={prod.name}
                    src={prod.image}
                    alt={prod.name}
                    className="w-10 h-10 md:w-12 md:h-12 object-contain rounded bg-gray-50 border border-gray-100 mx-auto"
                  />
                ))}
              </div>
              {/* +X more badge */}
              <div className="text-[11px] md:text-xs text-green-600 font-semibold mb-0.5 bg-green-50 px-2 py-0.5 rounded-full shadow-sm">+{item.items.length} more</div>
              {/* Category name */}
              <div className="text-xs md:text-sm font-bold text-gray-800 text-center leading-tight mt-0.5">{item.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedCategory || ''}
        icon={selectedCategory ? bestsellers.find(b => b.title === selectedCategory)?.icon || '🌟' : '🌟'}
        items={getModalItems()}
      />
    </motion.section>
  )
} 