'use client'

import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin, 
  Leaf, 
  Shield, 
  Truck, 
  Clock, 
  Star, 
  Heart, 
  ShoppingBag, 
  Users, 
  FileText, 
  HelpCircle, 
  MessageCircle, 
  Package, 
  RotateCcw, 
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { useComponentConfig } from '@/lib/useComponentConfig'

export default function Footer() {
  // Load admin configuration
  const { config } = useComponentConfig('footer', {
    showSocialLinks: true,
    showNewsletter: true,
    showContactInfo: true,
    showLegalLinks: true,
    showCompanyInfo: true,
    showQuickLinks: true
  });
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="mobile-container py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          {config.showCompanyInfo && (
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Bagicha</span>
                  <p className="text-xs text-gray-400">Fresh & Organic</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted partner for fresh groceries delivered to your doorstep. Quality guaranteed, delivery in minutes.
              </p>
              
              {/* Trust Badges */}
              <div className="flex items-center space-x-4 pt-2">
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Truck className="w-4 h-4 text-green-400" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-400">
                  <Star className="w-4 h-4 text-green-400" />
                  <span>4.8★</span>
                </div>
              </div>
              
              {config.showSocialLinks && (
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                    <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                    <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                    <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-lg flex items-center justify-center transition-all duration-300 group">
                    <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Quick Links */}
          {config.showQuickLinks && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Quick Links</h3>
              </div>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">About Us</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">How it Works</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Our Stores</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Careers</span>
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                    <ChevronRight className="w-4 h-4 text-green-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-sm">Blog</span>
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Customer Service */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold">Customer Service</h3>
            </div>
            <ul className="space-y-3">
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                  <HelpCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Help Center</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Contact Us</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                  <Package className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Track Order</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                  <RotateCcw className="w-4 h-4 text-green-400" />
                  <span className="text-sm">Returns & Refunds</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition-colors group">
                  <FileText className="w-4 h-4 text-green-400" />
                  <span className="text-sm">FAQs</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          {config.showContactInfo && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold">Contact Info</h3>
              </div>
            <div className="space-y-4">
                <div className="flex items-start space-x-3 group">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                    <MapPin className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Address</p>
                    <p className="text-xs text-gray-400 mt-1">
                    123 Grocery Street, Fresh City, FC 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                    <Phone className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Phone</p>
                    <p className="text-xs text-gray-400 mt-1">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 group">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-600 transition-colors">
                    <Mail className="w-4 h-4 text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 font-medium">Email</p>
                    <p className="text-xs text-gray-400 mt-1">support@bagicha.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-400">
              © 2024 Bagicha. All rights reserved.
              </span>
            </div>
            {config.showLegalLinks && (
              <div className="flex space-x-6">
                <a href="#" className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors group">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Privacy Policy</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors group">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Terms of Service</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-400 hover:text-green-400 transition-colors group">
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Cookie Policy</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
} 