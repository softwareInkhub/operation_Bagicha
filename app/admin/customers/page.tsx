'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiUsers, 
  FiPhone, 
  FiMapPin, 
  FiShoppingBag,
  FiEye,
  FiRefreshCw,
  FiEdit,
  FiPlus,
  FiFilter,
  FiDownload,
  FiSearch,
  FiMail,
  FiCalendar,
  FiTrendingUp,
  FiDollarSign,
  FiUserPlus,
  FiX,
  FiStar,
  FiTarget,
  FiHeart,
  FiMessageCircle
} from 'react-icons/fi'
import {
  getCustomers,
  getCustomerOrders,
  getOrders,
  subscribeToCustomers,
  updateCustomer,
  createCustomer,
  getCustomerAnalytics,
  createSampleCustomers
} from '@/lib/firebase'

interface Customer {
  id: string
  phone: string
  name: string
  email?: string
  city: string
  state: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: any
  firstOrderDate: any
  createdAt: any
  averageOrderValue: number
  loyaltyPoints: number
  preferredCategories: string[]
  segment: 'new' | 'active' | 'inactive' | 'churned'
  notes?: string
}

interface CustomerOrder {
  id: string
  total: number
  status: string
  createdAt: any
  items: Array<{ name: string; qty: number; price: number }>
}

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('all')
  const [sortBy, setSortBy] = useState('totalSpent')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [analytics, setAnalytics] = useState<any>(null)

  useEffect(() => {
    loadCustomers()
    loadAnalytics()
    
    // Subscribe to real-time customer updates
    const unsubscribe = subscribeToCustomers((customersData) => {
      const processedCustomers = processCustomerData(customersData)
      setCustomers(processedCustomers)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadCustomers = async () => {
    try {
      const [customersData, ordersData] = await Promise.all([
        getCustomers(),
        getOrders()
      ])
      
      // Process customer data to calculate segments and metrics
      const processedCustomers = processCustomerData(customersData, ordersData)
      setCustomers(processedCustomers)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadAnalytics = async () => {
    try {
      const analyticsData = await getCustomerAnalytics()
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading customer analytics:', error)
    }
  }

  const processCustomerData = (customersData: any[], ordersData: any[] = []) => {
    const now = new Date()
    
    return customersData.map(customer => {
      // Handle missing lastOrderDate properly
      let lastOrderDate = customer.lastOrderDate
      let daysSinceLastOrder = 0
      
      if (lastOrderDate) {
        lastOrderDate = lastOrderDate.toDate ? lastOrderDate.toDate() : new Date(lastOrderDate)
        daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      } else if (customer.createdAt) {
        // If no last order date, use created date
        const createdAt = customer.createdAt.toDate ? customer.createdAt.toDate() : new Date(customer.createdAt)
        daysSinceLastOrder = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
      } else {
        // Default to treating as new customer
        daysSinceLastOrder = 0
      }
      
      let segment: 'new' | 'active' | 'inactive' | 'churned' = 'new'
      if (customer.totalOrders === 0) {
        segment = 'new'
      } else if (daysSinceLastOrder <= 30) {
        segment = 'new'
      } else if (daysSinceLastOrder <= 90) {
        segment = 'active'
      } else if (daysSinceLastOrder <= 180) {
        segment = 'inactive'
      } else {
        segment = 'churned'
      }

      return {
        ...customer,
        segment,
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
        averageOrderValue: customer.totalOrders > 0 ? (customer.totalSpent || 0) / customer.totalOrders : 0,
        loyaltyPoints: customer.loyaltyPoints || 0
      }
    })
  }

  const loadCustomerOrders = async (customerId: string) => {
    try {
      const orders = await getCustomerOrders(customerId)
      setCustomerOrders(orders as CustomerOrder[])
    } catch (error) {
      console.error('Error loading customer orders:', error)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = !searchTerm || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter
    
    return matchesSearch && matchesSegment
  }).sort((a, b) => {
    switch (sortBy) {
      case 'totalSpent':
        return b.totalSpent - a.totalSpent
      case 'totalOrders':
        return b.totalOrders - a.totalOrders
      case 'lastOrderDate':
        return new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'new': return 'bg-green-100 text-green-800 border-green-200'
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inactive': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'churned': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSegmentStats = () => {
    const stats = {
      new: customers.filter(c => c.segment === 'new').length,
      active: customers.filter(c => c.segment === 'active').length,
      inactive: customers.filter(c => c.segment === 'inactive').length,
      churned: customers.filter(c => c.segment === 'churned').length,
    }
    return stats
  }

  const exportCustomers = () => {
    const csvContent = [
      ['Name', 'Phone', 'Email', 'City', 'State', 'Total Orders', 'Total Spent', 'Segment', 'Last Order', 'Loyalty Points'].join(','),
      ...filteredCustomers.map(customer => [
        customer.name,
        customer.phone,
        customer.email || '',
        customer.city,
        customer.state,
        customer.totalOrders,
        customer.totalSpent,
        customer.segment,
        formatDate(customer.lastOrderDate),
        customer.loyaltyPoints || 0
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleCreateSampleData = async () => {
    try {
      setLoading(true)
      await createSampleCustomers()
      await loadCustomers()
      await loadAnalytics()
    } catch (error) {
      console.error('Error creating sample customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = getSegmentStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FiUsers className="text-blue-600" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customer Management</h1>
          </div>
          <p className="text-gray-600">Manage customer relationships and track customer journey</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={exportCustomers}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiDownload size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiUserPlus size={16} />
            <span>Add Customer</span>
          </button>
          <button
            onClick={loadCustomers}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalCustomers}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="text-blue-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Lifetime Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageLifetimeValue)}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FiDollarSign className="text-green-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active + stats.new}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="text-purple-600" size={20} />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">At Risk</p>
                <p className="text-2xl font-bold text-gray-900">{stats.inactive + stats.churned}</p>
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <FiTarget className="text-red-600" size={20} />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Customer Segments */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[
          { segment: 'new', label: 'New', count: stats.new, color: 'bg-green-500', icon: FiUserPlus },
          { segment: 'active', label: 'Active', count: stats.active, color: 'bg-blue-500', icon: FiTrendingUp },
          { segment: 'inactive', label: 'Inactive', count: stats.inactive, color: 'bg-yellow-500', icon: FiCalendar },
          { segment: 'churned', label: 'Churned', count: stats.churned, color: 'bg-red-500', icon: FiX },
        ].map((stat) => (
          <motion.div
            key={stat.segment}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSegmentFilter(segmentFilter === stat.segment ? 'all' : stat.segment)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${stat.color} flex items-center justify-center text-white self-end sm:self-auto`}>
                <stat.icon size={16} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search customers by name, phone, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
            <select
              value={segmentFilter}
              onChange={(e) => setSegmentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="all">All Segments</option>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="churned">Churned</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
            >
              <option value="totalSpent">Total Spent</option>
              <option value="totalOrders">Total Orders</option>
              <option value="lastOrderDate">Last Order</option>
              <option value="name">Name</option>
            </select>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {filteredCustomers.length} customers
            </div>
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="space-y-4">
        {filteredCustomers.map((customer, index) => (
          <motion.div
            key={customer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 space-y-3 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{customer.name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <FiPhone size={14} />
                    <span>{customer.phone}</span>
                    {customer.email && (
                      <>
                        <span>•</span>
                        <FiMail size={14} />
                        <span>{customer.email}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between lg:justify-end space-x-3">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-medium border rounded-full capitalize ${getSegmentColor(customer.segment)}`}>
                  {customer.segment}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer)
                      loadCustomerOrders(customer.id)
                    }}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiEye size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCustomer(customer)
                      setShowEditModal(true)
                    }}
                    className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FiEdit size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-gray-400 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-600 truncate">{customer.city}, {customer.state}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShoppingBag className="text-gray-400 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-600">{customer.totalOrders} orders</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiDollarSign className="text-gray-400 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-600">{formatCurrency(customer.totalSpent)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="text-gray-400 flex-shrink-0" size={16} />
                <span className="text-sm text-gray-600">{formatDate(customer.lastOrderDate)}</span>
              </div>
            </div>

            {customer.loyaltyPoints && customer.loyaltyPoints > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FiStar className="text-yellow-500" size={16} />
                    <span className="text-sm font-medium text-gray-700">Loyalty Points</span>
                  </div>
                  <span className="text-sm font-semibold text-yellow-600">{customer.loyaltyPoints}</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && !loading && (
        <div className="text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No customers found</p>
          {customers.length === 0 && (
            <button
              onClick={handleCreateSampleData}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiUserPlus size={16} />
              <span>Add Sample Customers</span>
            </button>
          )}
        </div>
      )}

      {/* Customer Details Modal */}
      <AnimatePresence>
        {selectedCustomer && !showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Customer Details</h2>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        {selectedCustomer.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedCustomer.name}</h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border rounded-full capitalize ${getSegmentColor(selectedCustomer.segment)}`}>
                          {selectedCustomer.segment}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <FiPhone className="text-gray-400" size={16} />
                        <span className="text-sm">{selectedCustomer.phone}</span>
                      </div>
                      {selectedCustomer.email && (
                        <div className="flex items-center space-x-2">
                          <FiMail className="text-gray-400" size={16} />
                          <span className="text-sm">{selectedCustomer.email}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="text-gray-400" size={16} />
                        <span className="text-sm">{selectedCustomer.city}, {selectedCustomer.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Metrics */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Customer Metrics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Orders</span>
                        <span className="text-sm font-semibold">{selectedCustomer.totalOrders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Spent</span>
                        <span className="text-sm font-semibold">{formatCurrency(selectedCustomer.totalSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Avg Order Value</span>
                        <span className="text-sm font-semibold">{formatCurrency(selectedCustomer.averageOrderValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">First Order</span>
                        <span className="text-sm font-semibold">{formatDate(selectedCustomer.firstOrderDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Last Order</span>
                        <span className="text-sm font-semibold">{formatDate(selectedCustomer.lastOrderDate)}</span>
                      </div>
                      {selectedCustomer.loyaltyPoints && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Loyalty Points</span>
                          <span className="text-sm font-semibold text-yellow-600">{selectedCustomer.loyaltyPoints}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-2">
                  <h4 className="font-semibold text-gray-900 mb-4">Order History</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {customerOrders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">Order #{order.id.slice(-8)}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-semibold text-gray-900">{formatCurrency(order.total)}</span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{formatDate(order.createdAt)}</p>
                        <div className="text-sm text-gray-600">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <span key={idx}>
                              {item.name} x{item.qty}
                              {idx < Math.min(order.items.length, 2) - 1 && ', '}
                            </span>
                          ))}
                          {order.items.length > 2 && ` +${order.items.length - 2} more`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 