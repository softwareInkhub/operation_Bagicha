'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, User, CheckCircle } from 'lucide-react'

interface Review {
  id: number
  customerName: string
  customerImage: string
  rating: number
  review: string
  product: string
  date: string
  verified: boolean
  helpful: number
  images?: string[]
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: 'Priya Sharma',
    customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Absolutely love my Monstera! It arrived in perfect condition and has been thriving. The care instructions were super helpful. Highly recommend!',
    product: 'Monstera Deliciosa',
    date: '2 days ago',
    verified: true,
    helpful: 24,
    images: [
      'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 2,
    customerName: 'Rahul Patel',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'The smart garden kit is a game-changer! My herbs are growing better than ever with the automated watering system. Great investment for any gardener.',
    product: 'Smart Garden Kit',
    date: '1 week ago',
    verified: true,
    helpful: 18,
    images: [
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 3,
    customerName: 'Anjali Desai',
    customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Beautiful bonsai tree! The quality is excellent and it came with detailed care instructions. My living room looks so much more elegant now.',
    product: 'Premium Bonsai Set',
    date: '3 days ago',
    verified: true,
    helpful: 15
  },
  {
    id: 4,
    customerName: 'Vikram Singh',
    customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'The organic potting mix is fantastic! My plants are healthier and growing faster. Love that it\'s completely organic and eco-friendly.',
    product: 'Organic Potting Mix',
    date: '5 days ago',
    verified: true,
    helpful: 31
  },
  {
    id: 5,
    customerName: 'Meera Iyer',
    customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Amazing customer service! They helped me choose the perfect plants for my balcony garden. Everything arrived on time and in perfect condition.',
    product: 'Balcony Garden Bundle',
    date: '1 week ago',
    verified: true,
    helpful: 22,
    images: [
      'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=200&h=200&fit=crop'
    ]
  },
  {
    id: 6,
    customerName: 'Arjun Reddy',
    customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Great quality tools! The pruner is sharp and comfortable to use. Perfect for maintaining my garden. Will definitely buy more tools from here.',
    product: 'Professional Pruner',
    date: '4 days ago',
    verified: true,
    helpful: 12
  }
]

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'reviews' | 'stats'>('reviews')

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const stats = {
    totalReviews: 2847,
    averageRating: 4.8,
    verifiedPurchases: 98,
    customerSatisfaction: 96
  }

  return (
    <motion.section 
      className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="mobile-container">
        {/* Header */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Quote className="w-4 h-4" />
            Customer Stories
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">What Our Customers Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real reviews from real gardeners who trust us with their green spaces
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600 mb-1">{stats.totalReviews}+</div>
            <div className="text-xs font-normal text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600 mb-1">{stats.averageRating}</div>
            <div className="text-xs font-normal text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-orange-600 mb-1">{stats.verifiedPurchases}%</div>
            <div className="text-xs font-normal text-gray-600">Verified Purchases</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-purple-600 mb-1">{stats.customerSatisfaction}%</div>
            <div className="text-xs font-normal text-gray-600">Satisfaction Rate</div>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <motion.button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            onClick={prevReview}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </motion.button>

          <motion.button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            onClick={nextReview}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </motion.button>

          {/* Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="wait">
              {reviews.slice(currentIndex, currentIndex + 3).map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card p-6"
                >
                  {/* Customer Info */}
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={review.customerImage} 
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                        {review.verified && (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500">• {review.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Product */}
                  <div className="text-sm text-blue-600 font-medium mb-3">
                    {review.product}
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-4 line-clamp-4">
                    "{review.review}"
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mb-4">
                      {review.images.slice(0, 2).map((image, idx) => (
                        <img 
                          key={idx}
                          src={image} 
                          alt="Review"
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center justify-between">
                    <button className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      Helpful ({review.helpful})
                    </button>
                    <Quote className="w-4 h-4 text-gray-400" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: Math.ceil(reviews.length / 3) }, (_, i) => (
              <motion.button
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === Math.floor(currentIndex / 3) ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(i * 3)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Join Our Happy Gardeners</h3>
            <p className="text-gray-600 mb-6">
              Start your gardening journey with us and share your success story
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Now
              </motion.button>
              <motion.button
                className="btn-outline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Write a Review
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
} 