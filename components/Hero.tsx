'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, Star, Truck, Shield, Clock, ArrowRight,
  ChevronLeft, ChevronRight 
} from 'lucide-react'
import Link from 'next/link'
import { useComponentConfig } from '@/lib/useComponentConfig'

const heroSlides = [
  {
    id: 1,
    title: "Transform Your Space",
    subtitle: "Discover our premium collection of indoor plants",
    description: "Create a green oasis in your home with our carefully curated selection of air-purifying plants and stylish planters.",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800&h=600&fit=crop",
    badge: "New Arrivals",
    badgeColor: "bg-green-500",
    ctaText: "Shop Plants",
    features: ["Free Delivery", "30-Day Returns", "Expert Care Guide"]
  },
  {
    id: 2,
    title: "Professional Gardening Tools",
    subtitle: "Everything you need for perfect gardening",
    description: "From precision pruners to ergonomic trowels, our professional-grade tools make gardening effortless and enjoyable.",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&h=600&fit=crop",
    badge: "Best Sellers",
    badgeColor: "bg-orange-500",
    ctaText: "Shop Tools",
    features: ["Premium Quality", "Lifetime Warranty", "Free Shipping"]
  },
  {
    id: 3,
    title: "Organic Garden Essentials",
    subtitle: "Nurture your plants naturally",
    description: "Organic soil, fertilizers, and plant care products that promote healthy growth without harmful chemicals.",
    image: "https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?w=800&h=600&fit=crop",
    badge: "Organic",
    badgeColor: "bg-emerald-500",
    ctaText: "Shop Organic",
    features: ["100% Organic", "Pet Safe", "Environmentally Friendly"]
  }
]

const stats = [
  { number: "10K+", label: "Happy Customers" },
  { number: "500+", label: "Plant Varieties" },
  { number: "24/7", label: "Expert Support" },
  { number: "100%", label: "Organic Products" }
]

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  // Load admin configuration
  const { config } = useComponentConfig('hero', {
    showCallToAction: true,
    title: 'Welcome to Bagicha',
    subtitle: 'Your Garden Store',
    buttonText: 'Shop Now',
    showVideo: false,
    autoplay: false,
    backgroundImage: ''
  })

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };
  const handleMouseEnter = () => {}
  const handleMouseLeave = () => {}

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-green-50 py-0 flex flex-col justify-center">
      {/* Hero Slider */}
      <div 
        className="relative min-h-[420px] sm:min-h-[480px] md:min-h-[520px] lg:min-h-[560px] flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
            loading="eager"
          />
          {/* Strong overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/30"></div>
        </div>
        {/* Minimalist Centered Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 sm:px-0">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white text-center mb-3 drop-shadow-lg">
            {config.title || heroSlides[currentSlide].title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 text-center mb-6 max-w-xl drop-shadow-md">
            {config.subtitle || heroSlides[currentSlide].subtitle}
          </p>
          {config.showCallToAction && (
            <Link href="/auth/login">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl px-8 py-3 text-lg shadow-lg transition-all mb-12">
                <ShoppingCart className="inline-block w-5 h-5 mr-2 -mt-1" />
                {config.buttonText || heroSlides[currentSlide].ctaText}
              </button>
            </Link>
          )}
        </div>
        {/* Responsive Stats as overlays */}
        {/* Desktop: corners, Mobile: stacked and centered */}
        <div>
          {/* Desktop/Tablet */}
          <div className="hidden sm:block">
            <div className="absolute bottom-4 left-4 z-20 bg-white/80 text-green-700 font-bold text-sm rounded-lg px-4 py-2 shadow-md">
              10K+ Happy Customers
            </div>
            <div className="absolute bottom-4 right-4 z-20 bg-white/80 text-green-700 font-bold text-sm rounded-lg px-4 py-2 shadow-md">
              500+ Plant Types
            </div>
          </div>
          {/* Mobile */}
          <div className="block sm:hidden absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 w-full flex flex-col items-center gap-2 px-2">
            <div className="bg-white/80 text-green-700 font-bold text-xs rounded-lg px-3 py-1 shadow-md w-fit mb-0.5">
              10K+ Happy Customers
            </div>
            <div className="bg-white/80 text-green-700 font-bold text-xs rounded-lg px-3 py-1 shadow-md w-fit">
              500+ Plant Types
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {/* Removed: stats/features section now in StickyFooter */}

      {/* Trust Indicators */}
      {/* Removed: trust indicators now in StickyFooter */}
    </section>
  )
} 