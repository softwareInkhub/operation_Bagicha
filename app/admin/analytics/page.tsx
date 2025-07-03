'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiRefreshCw,
  FiDownload,
  FiFilter,
  FiEye,
  FiBarChart2,
  FiPieChart
} from 'react-icons/fi'
import {
  getRevenueAnalytics,
  getCustomerAnalytics,
  getProductAnalytics,
  subscribeToAnalytics,
  getOrders,
  getCustomers
} from '@/lib/firebase'

interface AnalyticsData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  revenueByPeriod: Array<{ period: string; revenue: number }>
  revenueByCategory: Array<{ category: string; revenue: number }>
  topProducts: Array<{ name: string; revenue: number }>
}

interface CustomerAnalytics {
  totalCustomers: number
  segments: {
    new: number
    active: number
    inactive: number
    churned: number
  }
  averageLifetimeValue: number
  geographicDistribution: Array<{ location: string; count: number }>
  topCustomers: Array<{ id: string; name: string; phone: string; totalSpent: number; totalOrders: number }>
}

interface ProductAnalytics {
  totalProducts: number
  topSellingProducts: Array<{ name: string; sold: number; revenue: number }>
  topRevenueProducts: Array<{ name: string; revenue: number }>
  categoryPerformance: Array<{ category: string; sold: number; revenue: number }>
  lowStockAlerts: Array<{ name: string; inventory: number }>
}

export default function AnalyticsDashboard() {
  const [revenueData, setRevenueData] = useState<AnalyticsData | null>(null)
  const [customerData, setCustomerData] = useState<CustomerAnalytics | null>(null)
  const [productData, setProductData] = useState<ProductAnalytics | null>(null)
  const [realTimeData, setRealTimeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    loadAnalyticsData()
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToAnalytics((data) => {
      setRealTimeData(data)
    })

    return () => unsubscribe()
  }, [period])

  const loadAnalyticsData = async () => {
    try {
      setLoading(true)
      const [revenue, customer, product] = await Promise.all([
        getRevenueAnalytics(period),
        getCustomerAnalytics(),
        getProductAnalytics()
      ])
      
      setRevenueData(revenue)
      setCustomerData(customer)
      setProductData(product)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportData = () => {
    const data = {
      revenue: revenueData,
      customers: customerData,
      products: productData,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatPercentage = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(1)
  }

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
              <FiBarChart2 className="text-blue-600" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          </div>
          <p className="text-gray-600">Comprehensive business insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
          >
            <option value="day">Last 30 Days</option>
            <option value="week">Last 12 Weeks</option>
            <option value="month">Last 12 Months</option>
            <option value="year">Last 5 Years</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={loadAnalyticsData}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiRefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiDownload size={16} />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Real-time Alerts */}
      {realTimeData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 rounded-xl p-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <FiTrendingUp size={20} />
              </div>
              <div>
                <h3 className="font-semibold">Live Analytics</h3>
                <p className="text-green-100 text-sm">Real-time business metrics</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{formatCurrency(realTimeData.totalRevenue)}</p>
              <p className="text-green-100 text-sm">{realTimeData.totalOrders} orders</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: FiBarChart2 },
            { id: 'revenue', label: 'Revenue', icon: FiDollarSign },
            { id: 'customers', label: 'Customers', icon: FiUsers },
            { id: 'products', label: 'Products', icon: FiPackage }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && revenueData && customerData && productData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <FiArrowUp className="text-green-500" size={16} />
                <span className="text-sm text-green-600">+12.5% vs last period</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{revenueData.totalOrders.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiShoppingCart className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <FiArrowUp className="text-green-500" size={16} />
                <span className="text-sm text-green-600">+8.2% vs last period</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(revenueData.averageOrderValue)}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <FiArrowUp className="text-green-500" size={16} />
                <span className="text-sm text-green-600">+3.7% vs last period</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customerData.totalCustomers.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-orange-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2">
                <FiArrowUp className="text-green-500" size={16} />
                <span className="text-sm text-green-600">+15.3% vs last period</span>
              </div>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
                <FiBarChart2 className="text-gray-400" size={20} />
              </div>
              <div className="h-64 flex items-end justify-between space-x-2">
                {revenueData.revenueByPeriod.slice(-12).map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-green-500 rounded-t"
                      style={{ 
                        height: `${(item.revenue / Math.max(...revenueData.revenueByPeriod.map(i => i.revenue))) * 200}px`,
                        minHeight: '4px'
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {item.period.slice(-5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Segments */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Customer Segments</h3>
                <FiPieChart className="text-gray-400" size={20} />
              </div>
              <div className="space-y-4">
                {Object.entries(customerData.segments).map(([segment, count]) => (
                  <div key={segment} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        segment === 'new' ? 'bg-green-500' :
                        segment === 'active' ? 'bg-blue-500' :
                        segment === 'inactive' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-gray-700 capitalize">{segment}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{count}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({formatPercentage(count, customerData.totalCustomers)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
              <div className="space-y-4">
                {productData.topSellingProducts.slice(0, 5).map((product, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.sold} units sold</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Customers */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
              <div className="space-y-4">
                {customerData.topCustomers.slice(0, 5).map((customer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-semibold text-gray-600">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(customer.totalSpent)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && revenueData && (
        <div className="space-y-6">
          {/* Revenue Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(revenueData.totalRevenue)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(revenueData.averageOrderValue)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Orders</h3>
              <p className="text-3xl font-bold text-purple-600">{revenueData.totalOrders}</p>
            </div>
          </div>

          {/* Revenue by Category */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue by Category</h3>
            <div className="space-y-4">
              {revenueData.revenueByCategory.map((category, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{category.category}</span>
                      <span className="text-sm text-gray-500">{formatCurrency(category.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ 
                          width: `${(category.revenue / Math.max(...revenueData.revenueByCategory.map(c => c.revenue))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && customerData && (
        <div className="space-y-6">
          {/* Customer Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Customers</h3>
              <p className="text-3xl font-bold text-blue-600">{customerData.totalCustomers}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Avg Lifetime Value</h3>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(customerData.averageLifetimeValue)}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Customers</h3>
              <p className="text-3xl font-bold text-purple-600">{customerData.segments.active}</p>
            </div>
          </div>

          {/* Geographic Distribution */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Geographic Distribution</h3>
            <div className="space-y-4">
              {customerData.geographicDistribution.slice(0, 10).map((location, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{location.location}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ 
                          width: `${(location.count / Math.max(...customerData.geographicDistribution.map(l => l.count))) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && productData && (
        <div className="space-y-6">
          {/* Product Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Products</h3>
              <p className="text-3xl font-bold text-blue-600">{productData.totalProducts}</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Product Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                {productData.topRevenueProducts[0] ? formatCurrency(productData.topRevenueProducts[0].revenue) : '₹0'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Alerts</h3>
              <p className="text-3xl font-bold text-red-600">{productData.lowStockAlerts.length}</p>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Units Sold</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.categoryPerformance.map((category, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{category.category}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{category.sold}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(category.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Low Stock Alerts */}
          {productData.lowStockAlerts.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">Low Stock Alerts</h3>
              <div className="space-y-2">
                {productData.lowStockAlerts.map((product, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-red-800">{product.name}</span>
                    <span className="text-sm text-red-600">{product.inventory} units left</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 