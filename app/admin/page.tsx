'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiPackage, 
  FiShoppingCart, 
  FiUsers, 
  FiTrendingUp,
  FiArrowUp,
  FiArrowDown,
  FiEye,
  FiDollarSign,
  FiRefreshCw
} from 'react-icons/fi'
import { getOrders, getProducts } from '@/lib/firebase'

interface DashboardStats {
  totalProducts: number
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  pendingOrders: number
  recentOrders: any[]
  topProducts: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    recentOrders: [],
    topProducts: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [orders, products] = await Promise.all([
        getOrders(),
        getProducts()
      ])
      
      // Type assertion for Firebase data
      const ordersData = orders as any[]
      const productsData = products as any[]

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
      const uniqueCustomers = new Set(ordersData.map(order => order.customerPhone)).size
      const pendingOrders = ordersData.filter(order => order.status === 'pending').length
      
      // Recent orders (last 5)
      const recentOrders = ordersData
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate() || new Date(a.createdAt)
          const dateB = b.createdAt?.toDate() || new Date(b.createdAt)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, 5)

      // Top selling products
      const productSales = new Map()
      ordersData.forEach(order => {
        order.items?.forEach((item: any) => {
          const existing = productSales.get(item.name) || { quantity: 0, revenue: 0 }
          productSales.set(item.name, {
            name: item.name,
            quantity: existing.quantity + (item.qty || 0),
            revenue: existing.revenue + ((item.price || 0) * (item.qty || 0))
          })
        })
      })

      const topProducts = Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)

      setStats({
        totalProducts: productsData.length,
        totalOrders: ordersData.length,
        totalRevenue,
        totalCustomers: uniqueCustomers,
        pendingOrders,
        recentOrders,
        topProducts
      })
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store.</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full lg:w-auto"
        >
          <FiRefreshCw size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: '+12%',
            changeType: 'increase',
            icon: FiDollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'Total Orders',
            value: stats.totalOrders,
            change: '+8%',
            changeType: 'increase',
            icon: FiShoppingCart,
            color: 'bg-blue-500'
          },
          {
            title: 'Products',
            value: stats.totalProducts,
            change: '+3%',
            changeType: 'increase',
            icon: FiPackage,
            color: 'bg-purple-500'
          },
          {
            title: 'Customers',
            value: stats.totalCustomers,
            change: '+15%',
            changeType: 'increase',
            icon: FiUsers,
            color: 'bg-orange-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.changeType === 'increase' ? (
                    <FiArrowUp className="text-green-500 flex-shrink-0" size={16} />
                  ) : (
                    <FiArrowDown className="text-red-500 flex-shrink-0" size={16} />
                  )}
                  <span className={`text-sm font-medium ml-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1 hidden sm:inline">vs last month</span>
                </div>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0 ml-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Alerts/Notifications */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 md:p-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center mr-0 sm:mr-3 flex-shrink-0">
              <FiShoppingCart className="text-yellow-600" size={16} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-yellow-900">
                You have {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? 's' : ''}
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                These orders are waiting to be processed. Check the orders page to update their status.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <a 
              href="/admin/orders"
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
            >
              View all <FiEye className="ml-1" size={16} />
            </a>
          </div>

          <div className="space-y-4">
            {stats.recentOrders.map((order, index) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <FiShoppingCart className="text-green-600" size={14} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">#{order.id.slice(-8)}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{order.total?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>

          {stats.recentOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingCart className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p>No recent orders</p>
            </div>
          )}
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
            <a 
              href="/admin/products"
              className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
            >
              View all <FiEye className="ml-1" size={16} />
            </a>
          </div>

          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {stats.topProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FiPackage className="mx-auto h-8 w-8 text-gray-300 mb-2" />
              <p>No sales data yet</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'Add Product', href: '/admin/products', icon: FiPackage, color: 'bg-green-500' },
            { title: 'View Orders', href: '/admin/orders', icon: FiShoppingCart, color: 'bg-blue-500' },
            { title: 'Manage Categories', href: '/admin/categories', icon: FiTrendingUp, color: 'bg-purple-500' },
            { title: 'View Customers', href: '/admin/customers', icon: FiUsers, color: 'bg-orange-500' }
          ].map((action, index) => (
            <a
              key={action.title}
              href={action.href}
              className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <action.icon className="text-white" size={20} />
              </div>
              <span className="text-sm font-medium text-gray-900">{action.title}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
} 