import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductModal from './ProductModal';
import ProductDetails from './ProductDetails';
import WishlistButton from './WishlistButton';
import { useCart } from '../context/CartContext';

const fertilizers = [
  {
    id: 1,
    name: 'Organic Vermicompost',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    price: 199,
    originalPrice: 299,
    rating: 4.8,
    reviews: 156,
    badge: 'Organic',
    badgeColor: 'bg-green-500',
    features: ['Improves Soil', 'Eco-Friendly', 'Odorless']
  },
  {
    id: 2,
    name: 'Bone Meal Fertilizer',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop',
    price: 149,
    originalPrice: 249,
    rating: 4.6,
    reviews: 98,
    badge: 'Phosphorus Rich',
    badgeColor: 'bg-blue-500',
    features: ['Root Growth', 'Flower Booster', 'Natural Source']
  },
  {
    id: 3,
    name: 'Seaweed Extract',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.7,
    reviews: 112,
    badge: 'Growth Booster',
    badgeColor: 'bg-indigo-500',
    features: ['Micronutrients', 'Improves Yield', 'Liquid Formula']
  },
  {
    id: 4,
    name: 'Neem Cake Fertilizer',
    image: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=300&h=300&fit=crop',
    price: 179,
    originalPrice: 249,
    rating: 4.5,
    reviews: 87,
    badge: 'Pest Repellent',
    badgeColor: 'bg-yellow-500',
    features: ['Natural Pest Control', 'Soil Conditioner', 'Organic']
  },
  {
    id: 5,
    name: 'NPK 19:19:19',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    price: 249,
    originalPrice: 349,
    rating: 4.6,
    reviews: 102,
    badge: 'Balanced',
    badgeColor: 'bg-orange-500',
    features: ['All Purpose', 'Water Soluble', 'Quick Release']
  },
  {
    id: 6,
    name: 'Potash Granules',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 129,
    originalPrice: 199,
    rating: 4.4,
    reviews: 76,
    badge: 'Potassium',
    badgeColor: 'bg-pink-500',
    features: ['Fruit Development', 'Improves Quality', 'Easy to Use']
  },
  {
    id: 7,
    name: 'Epsom Salt',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=300&fit=crop',
    price: 99,
    originalPrice: 149,
    rating: 4.3,
    reviews: 54,
    badge: 'Magnesium',
    badgeColor: 'bg-cyan-500',
    features: ['Greener Leaves', 'Boosts Growth', 'Easy to Dissolve']
  },
  {
    id: 8,
    name: 'Urea Fertilizer',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?w=300&h=300&fit=crop',
    price: 89,
    originalPrice: 129,
    rating: 4.2,
    reviews: 61,
    badge: 'Nitrogen',
    badgeColor: 'bg-lime-500',
    features: ['High Nitrogen', 'Quick Release', 'Promotes Growth']
  },
  {
    id: 9,
    name: 'Compost Maker',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=300&h=300&fit=crop',
    price: 159,
    originalPrice: 199,
    rating: 4.5,
    reviews: 48,
    badge: 'Composting',
    badgeColor: 'bg-brown-500',
    features: ['Speeds Up Compost', 'Eco-Friendly', 'Easy to Use']
  },
  {
    id: 10,
    name: 'Calcium Nitrate',
    image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=300&h=300&fit=crop',
    price: 139,
    originalPrice: 189,
    rating: 4.4,
    reviews: 39,
    badge: 'Calcium',
    badgeColor: 'bg-gray-400',
    features: ['Prevents Blossom End Rot', 'Improves Quality', 'Water Soluble']
  },
  {
    id: 11,
    name: 'Fish Emulsion',
    image: 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=300&h=300&fit=crop',
    price: 299,
    originalPrice: 399,
    rating: 4.6,
    reviews: 27,
    badge: 'Organic Liquid',
    badgeColor: 'bg-blue-400',
    features: ['Natural Source', 'Micronutrients', 'Boosts Growth']
  },
  {
    id: 12,
    name: 'Mustard Cake',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?w=300&h=300&fit=crop',
    price: 119,
    originalPrice: 169,
    rating: 4.3,
    reviews: 33,
    badge: 'Oil Cake',
    badgeColor: 'bg-yellow-400',
    features: ['Slow Release', 'Improves Soil', 'Organic']
  },
];

export default function FertilizerSection() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCartSuccess, setShowCartSuccess] = useState<string | null>(null);

  // Group by badge for slider rows
  const grouped = fertilizers.reduce((acc, fert) => {
    if (!acc[fert.badge]) acc[fert.badge] = [];
    acc[fert.badge].push(fert);
    return acc;
  }, {} as { [badge: string]: typeof fertilizers });

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

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setModalOpen(false);
  };

  const closeProductDetails = () => {
    setSelectedProduct(null);
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
    const categoryItems = grouped[selectedCategory] || [];
    return categoryItems.map((item, index) => ({
      ...item,
      wishlistButton: <WishlistButton product={{ 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        image: item.image 
      }} />
    }));
  };

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
                  <img src={items[0].image} alt={items[0].name} className="w-full h-20 object-cover rounded-t-lg" />
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {badge}
                  </div>
                  <div className="absolute top-1 right-1">
                    <WishlistButton product={items[0]} size="sm" />
                  </div>
                  <div className="p-2 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2">{items[0].name}</h3>
                    <div className="flex items-center gap-1 text-[10px] text-gray-600 mb-1">
                      <span>★ {items[0].rating}</span>
                      <span>({items[0].reviews})</span>
                    </div>
                    <p className="text-[10px] text-gray-700 mb-2 line-clamp-2">{items[0].features.join(', ')}</p>
                    <span className="text-sm font-bold text-green-600 mb-1">₹{items[0].price}</span>
                    {items[0].originalPrice > items[0].price && (
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
            onProductClick={handleProductClick}
          />
        )}

        {/* Product Details Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-40 p-4 pt-20">
            <ProductDetails product={selectedProduct} onClose={closeProductDetails} />
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