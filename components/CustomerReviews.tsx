'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Review {
  id: number
  customerName: string
  customerImage: string
  rating: number
  review: string
  product: string
  date: string
  verified: boolean
}

const reviews: Review[] = [
  {
    id: 1,
    customerName: 'Priya Sharma',
    customerImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Absolutely love my Monstera! It arrived in perfect condition and has been thriving. The care instructions were super helpful.',
    product: 'Monstera Deliciosa',
    date: '2 days ago',
    verified: true
  },
  {
    id: 2,
    customerName: 'Rahul Patel',
    customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'The smart garden kit is a game-changer! My herbs are growing better than ever with the automated watering system.',
    product: 'Smart Garden Kit',
    date: '1 week ago',
    verified: true
  },
  {
    id: 3,
    customerName: 'Anjali Desai',
    customerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Beautiful bonsai tree! The quality is excellent and it came with detailed care instructions.',
    product: 'Premium Bonsai Set',
    date: '3 days ago',
    verified: true
  },
  {
    id: 4,
    customerName: 'Vikram Singh',
    customerImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'The organic potting mix is fantastic! My plants are healthier and growing faster.',
    product: 'Organic Potting Mix',
    date: '5 days ago',
    verified: true
  },
  {
    id: 5,
    customerName: 'Meera Iyer',
    customerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    review: 'Amazing customer service! They helped me choose the perfect plants for my balcony garden.',
    product: 'Balcony Garden Bundle',
    date: '1 week ago',
    verified: true
  },
  {
    id: 6,
    customerName: 'Arjun Reddy',
    customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    rating: 4,
    review: 'Great quality tools! The pruner is sharp and comfortable to use. Perfect for maintaining my garden.',
    product: 'Professional Pruner',
    date: '4 days ago',
    verified: true
  }
]

export default function CustomerReviews() {
  const [currentIndex, setCurrentIndex] = useState(0)

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
        className={`w-3 h-3 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  const stats = {
    totalReviews: 2847,
    averageRating: 4.8,
    verifiedPurchases: 98
  }

  return (
    <section className="py-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="px-4">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
            <Quote className="w-3 h-3" />
            Customer Stories
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">What Our Customers Say</h2>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-blue-600">{stats.totalReviews}+</div>
            <div className="text-xs text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-green-600">{stats.averageRating}</div>
            <div className="text-xs text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-orange-600">{stats.verifiedPurchases}%</div>
            <div className="text-xs text-gray-600">Verified</div>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            onClick={prevReview}
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
            onClick={nextReview}
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>

          {/* Review Card */}
          <div className="mx-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                {/* Customer Info */}
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={reviews[currentIndex].customerImage} 
                    alt={reviews[currentIndex].customerName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <h4 className="font-medium text-gray-900 text-sm">{reviews[currentIndex].customerName}</h4>
                      {reviews[currentIndex].verified && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderStars(reviews[currentIndex].rating)}
                      </div>
                      <span className="text-xs text-gray-500">• {reviews[currentIndex].date}</span>
                    </div>
                  </div>
                </div>

                {/* Product */}
                <div className="text-xs text-blue-600 font-medium mb-2">
                  {reviews[currentIndex].product}
                </div>

                {/* Review Text */}
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  "{reviews[currentIndex].review}"
                </p>

                {/* Quote Icon */}
                <div className="flex justify-end">
                  <Quote className="w-4 h-4 text-gray-300" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-4 gap-1">
            {reviews.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(i)}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-4">
          <Link href="/auth/login">
            <button className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Shop Now
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
} 