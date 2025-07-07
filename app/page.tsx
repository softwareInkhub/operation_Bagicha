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
import FloatingCartBar from '../components/FloatingCartBar'
import BottomNavigation from '../components/BottomNavigation'
import { Gift, Sparkles } from 'lucide-react'
import StickyFooter from '../components/StickyFooter'
import Footer from '../components/Footer'
import VideoTutorials from '../components/VideoTutorials'
import FertilizerSection from '../components/FertilizerSection'
import SoilsSection from '../components/SoilsSection'
import SeedsSection from '../components/SeedsSection'
import PlantersSection from '../components/PlantersSection'
import Link from 'next/link'
import GiftBannerSlider from "@/components/GiftBannerSlider"

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

        {/* Gift Banner Slider - moved here to appear after Hero */}
        <GiftBannerSlider />

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

        {/* Planters Section */}
        <motion.div
          id="planters-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
        >
          <PlantersSection />
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
        <motion.div
          id="fertilizer-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <FertilizerSection />
        </motion.div>

        {/* Soils Section */}
        <motion.div
          id="soils-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          <SoilsSection />
        </motion.div>

        {/* Seeds Section */}
        <motion.div
          id="seeds-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <SeedsSection />
        </motion.div>

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

      {/* Floating Cart Bar */}
      <FloatingCartBar />

      {/* Bottom Navigation */}
      {/* <BottomNavigation /> */}

      {/* Regular Footer */}
      <Footer />

      {/* Sticky Footer */}
      <StickyFooter />
    </div>
  )
} 