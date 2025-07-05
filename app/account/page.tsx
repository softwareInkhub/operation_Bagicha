'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, Package, MapPin, Heart, Gift, Settings, 
  Star, Trophy, CreditCard, Share2, LogOut, 
  Plus, Edit, ChevronRight, ShoppingCart, Clock,
  Phone, Mail, Calendar, Award, Zap, Target
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getCurrentCustomer, clearCurrentCustomer, isCustomerLoggedIn, getCustomerOrders } from '@/lib/firebase'
import { useWishlist } from '@/context/WishlistContext'
import { useCart } from '@/context/CartContext'

interface Order {
  id: string
  total: number
  status: string
  createdAt: any
  items: any[]
}

export default function AccountPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const [customer, setCustomer] = useState<any>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const { wishlist, wishlistCount } = useWishlist()
  const { addToCart } = useCart()

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'offers', label: 'Offers', icon: Gift },
  ]

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    // Set active tab based on URL parameter
    const tabParam = searchParams.get('tab')
    if (tabParam && tabs.some(tab => tab.id === tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  const checkAuth = async () => {
    const isLoggedIn = isCustomerLoggedIn()
    
    if (!isLoggedIn) {
      router.push('/auth/login')
      return
    }

    const customerData = getCurrentCustomer()
    setCustomer(customerData)
    
    if (customerData?.id) {
      try {
        const ordersData = await getCustomerOrders(customerData.id)
        setOrders((ordersData || []) as Order[])
      } catch (error) {
        console.error('Error loading orders:', error)
      }
    }
    
    setLoading(false)
  }

  const handleLogout = () => {
    clearCurrentCustomer()
    router.push('/')
  }

  const getCustomerLevel = (points: number) => {
    if (points >= 5000) return { level: 'Platinum', color: 'text-purple-600', bg: 'bg-purple-100', next: null }
    if (points >= 2000) return { level: 'Gold', color: 'text-yellow-600', bg: 'bg-yellow-100', next: 5000 }
    if (points >= 500) return { level: 'Silver', color: 'text-gray-600', bg: 'bg-gray-100', next: 2000 }
    return { level: 'Bronze', color: 'text-orange-600', bg: 'bg-orange-100', next: 500 }
  }

  const handleReorder = (order: Order) => {
    order.items.forEach(item => {
      addToCart({ ...item, qty: item.qty || 1 })
    })
    router.push('/checkout')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  const customerLevel = getCustomerLevel(customer.loyaltyPoints || 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{customer.name}</h1>
                <p className="text-green-100">{customer.phone}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${customerLevel.bg} ${customerLevel.color}`}>
                    {customerLevel.level}
                  </div>
                  {customer.loyaltyPoints > 0 && (
                    <span className="text-green-100 text-sm">{customer.loyaltyPoints} points</span>
                  )}
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="container mx-auto px-4 -mt-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Package className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{customer.totalOrders || 0}</div>
            <div className="text-xs text-gray-500">Orders</div>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{customer.loyaltyPoints || 0}</div>
            <div className="text-xs text-gray-500">Points</div>
          </motion.div>
          <motion.div 
            className="bg-white rounded-xl p-4 shadow-sm text-center"
            whileHover={{ scale: 1.02 }}
          >
            <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{wishlistCount}</div>
            <div className="text-xs text-gray-500">Wishlist</div>
          </motion.div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'wishlist' && wishlistCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] h-[18px] flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'profile' && <ProfileTab customer={customer} customerLevel={customerLevel} />}
            {activeTab === 'orders' && <OrdersTab orders={orders} onReorder={handleReorder} />}
            {activeTab === 'address' && <AddressTab customer={customer} />}
            {activeTab === 'wishlist' && <WishlistTab />}
            {activeTab === 'offers' && <OffersTab customer={customer} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// Profile Tab Component
function ProfileTab({ customer, customerLevel }: { customer: any, customerLevel: any }) {
  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          <button className="text-green-600 hover:text-green-700">
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Full Name</div>
              <div className="font-medium">{customer.name}</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Phone Number</div>
              <div className="font-medium">{customer.phone}</div>
            </div>
          </div>
          {customer.email && (
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium">{customer.email}</div>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">{customer.city}, {customer.state}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Loyalty Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-full ${customerLevel.bg} flex items-center justify-center`}>
            <Award className={`w-5 h-5 ${customerLevel.color}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{customerLevel.level} Member</h3>
            <p className="text-sm text-gray-600">{customer.loyaltyPoints || 0} loyalty points</p>
          </div>
        </div>
        {customerLevel.next && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to {customerLevel.next > 2000 ? 'Platinum' : customerLevel.next > 500 ? 'Gold' : 'Silver'}</span>
              <span>{customer.loyaltyPoints || 0}/{customerLevel.next}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((customer.loyaltyPoints || 0) / customerLevel.next * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Account Benefits */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Benefits</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Zap className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Fast Delivery</div>
            <div className="text-xs text-gray-500">Free on orders ₹499+</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Earn Points</div>
            <div className="text-xs text-gray-500">1 point per ₹10 spent</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Gift className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Exclusive Offers</div>
            <div className="text-xs text-gray-500">Member-only deals</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Share2 className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <div className="text-sm font-medium text-gray-900">Refer & Earn</div>
            <div className="text-xs text-gray-500">₹50 per referral</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Orders Tab Component
function OrdersTab({ orders, onReorder }: { orders: Order[], onReorder: (order: Order) => void }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <motion.div
          key={order.id}
          className="bg-white rounded-xl p-6 shadow-sm"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-semibold text-gray-900">Order #{order.id.slice(-8)}</h4>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
              {order.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900">₹{order.total}</p>
              <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => onReorder(order)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Reorder
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                View Details
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Address Tab Component
function AddressTab({ customer }: { customer: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Saved Addresses</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Address</span>
        </button>
      </div>

      {/* Default Address */}
      <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">Default</span>
            <span className="text-sm font-medium text-gray-900">Home</span>
          </div>
          <button className="text-green-600 hover:text-green-700">
            <Edit className="w-5 h-5" />
          </button>
        </div>
        <div className="text-gray-700">
          <p className="font-medium">{customer.name}</p>
          <p className="text-sm text-gray-500 mt-1">{customer.phone}</p>
          <p className="text-sm text-gray-600 mt-2">
            {customer.city}, {customer.state}
          </p>
        </div>
      </div>

      {/* Add Address Prompt */}
      <div className="bg-gray-50 rounded-xl p-6 text-center">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h4 className="font-medium text-gray-900 mb-2">Add more addresses</h4>
        <p className="text-sm text-gray-500 mb-4">Save addresses for faster checkout</p>
        <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Add New Address
        </button>
      </div>
    </div>
  )
}

// Wishlist Tab Component
function WishlistTab() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleAddToCart = (item: any) => {
    addToCart({ ...item, qty: 1 })
  }

  if (wishlist.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
        <p className="text-gray-500 mb-6">Add items you love to see them here</p>
        <Link 
          href="/"
          className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {wishlist.map((item) => (
        <motion.div
          key={item.id}
          className="bg-white rounded-xl p-4 shadow-sm"
          whileHover={{ scale: 1.01 }}
        >
          <div className="flex space-x-4">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{item.name}</h4>
              <p className="text-sm text-gray-500">{item.category}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                {(item as any).originalPrice && (item as any).originalPrice > item.price && (
                  <span className="text-sm text-gray-400 line-through">₹{(item as any).originalPrice}</span>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleAddToCart(item)}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item.id)}
                className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Offers Tab Component
function OffersTab({ customer }: { customer: any }) {
  const customerLevel = customer.loyaltyPoints >= 2000 ? 'Gold' : customer.loyaltyPoints >= 500 ? 'Silver' : 'Bronze'

  const offers = [
    {
      id: 1,
      title: 'Welcome Bonus',
      description: 'Get ₹100 off on your next order',
      discount: '₹100 OFF',
      code: 'WELCOME100',
      minOrder: 499,
      validTill: '31 Dec 2024',
      type: 'welcome',
      available: customer.totalOrders === 0
    },
    {
      id: 2,
      title: 'Loyalty Reward',
      description: `Exclusive ${customerLevel} member discount`,
      discount: '20% OFF',
      code: 'LOYALTY20',
      minOrder: 999,
      validTill: '31 Dec 2024',
      type: 'loyalty',
      available: customer.loyaltyPoints >= 500
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: 'Free delivery on all orders',
      discount: 'FREE DELIVERY',
      code: 'FREEDEL',
      minOrder: 299,
      validTill: '15 Dec 2024',
      type: 'delivery',
      available: true
    },
    {
      id: 4,
      title: 'Bulk Purchase',
      description: 'Buy 3 plants, get 1 free',
      discount: 'BUY 3 GET 1',
      code: 'BULK3GET1',
      minOrder: 1499,
      validTill: '25 Dec 2024',
      type: 'bulk',
      available: true
    }
  ]

  const availableOffers = offers.filter(offer => offer.available)

  return (
    <div className="space-y-6">
      {/* Points Balance */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Loyalty Points</h3>
            <p className="text-3xl font-bold mt-1">{customer.loyaltyPoints || 0}</p>
            <p className="text-green-100 text-sm">Worth ₹{(customer.loyaltyPoints || 0) / 10}</p>
          </div>
          <div className="text-right">
            <Trophy className="w-12 h-12 text-white/80" />
            <p className="text-sm text-green-100 mt-2">{customerLevel} Member</p>
          </div>
        </div>
      </div>

      {/* Available Offers */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Offers</h3>
        <div className="space-y-4">
          {availableOffers.map((offer) => (
            <motion.div
              key={offer.id}
              className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{offer.title}</h4>
                    <p className="text-sm text-gray-500">{offer.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    {offer.discount}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Code: <span className="font-mono font-bold">{offer.code}</span></span>
                    <span>Min: ₹{offer.minOrder}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Valid till {offer.validTill}</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  Use Now
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Referral Program */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Share2 className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Refer & Earn</h4>
            <p className="text-sm text-gray-600">Invite friends and earn ₹50 for each successful referral</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <input 
            type="text" 
            value={`REFER${customer.phone?.slice(-4) || '0000'}`}
            readOnly
            className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
          />
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
            Share
          </button>
        </div>
      </div>
    </div>
  )
} 