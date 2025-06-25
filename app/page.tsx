'use client'

import { motion } from 'framer-motion'
import Header from '../components/Header'
import CategorySlider from '../components/CategorySlider'
import Hero from '../components/Hero'
import BestsellerSection from '../components/BestsellerSection'
import TrendingPlants from '../components/TrendingPlants'
import PlantCareTips from '../components/PlantCareTips'
import ToolsAndAccessories from '../components/ToolsAndAccessories'
import NewArrivals from '../components/NewArrivals'
import CustomerReviews from '../components/CustomerReviews'
import GardeningBlogs from '../components/GardeningBlogs'
import ProductCatalog from '../components/ProductCatalog'
import FloatingHelpButton from '../components/FloatingHelpButton'
import BottomNavigation from '../components/BottomNavigation'
import { Gift, Sparkles } from 'lucide-react'
import StickyFooter from '../components/StickyFooter'
import VideoTutorials from '../components/VideoTutorials'
import FertilizerSection from '../components/FertilizerSection'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50" id="top">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="pt-0">
        {/* Category Slider */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CategorySlider />
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Hero />
        </motion.div>

        {/* Gift a Plant Campaign Banner */}
        <motion.div
          id="offers-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="px-4 py-6"
        >
          <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full"></div>
              <div className="absolute top-1/2 left-1/3 w-12 h-12 bg-white rounded-full"></div>
            </div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full">Limited Time</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">Gift a Plant, Spread Joy! 🌱</h2>
                <p className="text-orange-100 mb-4">Perfect gifts for plant lovers. Free gift wrapping + care guide included!</p>
                <Link href="/auth/login">
                  <motion.button
                    className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-orange-50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Gift className="w-5 h-5" />
                    Shop Gift Plants
                  </motion.button>
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bestseller Section */}
        <motion.div
          id="bestseller-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <BestsellerSection />
        </motion.div>

        {/* Trending Plants */}
        <motion.div
          id="trending-plants"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TrendingPlants />
        </motion.div>

        {/* New Arrivals */}
        <motion.div
          id="new-arrivals"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <NewArrivals />
        </motion.div>

        {/* Plant Care Tips */}
        <motion.div
          id="plant-care-tips"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <PlantCareTips />
        </motion.div>

        {/* Tools & Accessories */}
        <motion.div
          id="tools-and-accessories"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <ToolsAndAccessories />
        </motion.div>

        {/* Fertilizer Section */}
        <FertilizerSection />

        {/* Customer Reviews */}
        <motion.div
          id="customer-reviews"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CustomerReviews />
        </motion.div>

        {/* Gardening Blogs */}
        <motion.div
          id="gardening-blogs"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <GardeningBlogs />
        </motion.div>

        {/* Product Catalog */}
        <motion.div
          id="product-catalog"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <ProductCatalog />
        </motion.div>

        {/* Video Tutorials */}
        <VideoTutorials />
      </main>

      {/* Floating Help Button */}
      <FloatingHelpButton />

      {/* Bottom Navigation */}
      {/* <BottomNavigation /> */}

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
} 