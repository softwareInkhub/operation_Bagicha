'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiTrendingUp, 
  FiDollarSign, 
  FiShoppingBag, 
  FiUsers,
  FiBarChart,
  FiPieChart,
  FiCalendar,
  FiRefreshCw
} from 'react-icons/fi'
import { getOrders, getProducts } from '@/lib/firebase'

interface AnalyticsData {
  revenue: {
    daily: Array<{ date: string, amount: number }>
    weekly: Array<{ week: string, amount: number }>
    monthly: Array<{ month: string, amount: number }>
  }
  orders: {
    daily: Array<{ date: string, count: number }>
    statusBreakdown: Array<{ status: string, count: number }>
  }
  products: {
    topSelling: Array<{ name: string, quantity: number, revenue: number }>
    categoryBreakdown: Array<{ category: string, count: number, revenue: number }>
  }
  customers: {
    new: number
    returning: number
    topSpenders: Array<{ phone: string, name: string, totalSpent: number }>
  }
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d') // 7d, 30d, 90d

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      const [orders, products] = await Promise.all([
        getOrders(),
        getProducts()
      ])

      // Filter orders based on time range
      const now = new Date()
      const daysBack = parseInt(timeRange.replace('d', ''))
      const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000))

      const filteredOrders = orders.filter((order: any) => {
        const orderDate = order.createdAt?.toDate() || new Date(order.createdAt || Date.now())
        return orderDate >= startDate
      })

      // Calculate analytics
      const analyticsData: AnalyticsData = {
        revenue: calculateRevenue(filteredOrders),
        orders: calculateOrderMetrics(filteredOrders),
        products: calculateProductMetrics(filteredOrders),
        customers: calculateCustomerMetrics(filteredOrders)
      }

      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenue = (orders: any[]) => {
    const daily = new Map<string, number>()
    const weekly = new Map<string, number>()
    const monthly = new Map<string, number>()

    orders.forEach((order: any) => {
      const date = order.createdAt?.toDate() || new Date(order.createdAt || Date.now())
      const revenue = order.total || 0

      // Daily
      const dayKey = date.toISOString().split('T')[0]
      daily.set(dayKey, (daily.get(dayKey) || 0) + revenue)

      // Weekly (start of week)
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      const weekKey = weekStart.toISOString().split('T')[0]
      weekly.set(weekKey, (weekly.get(weekKey) || 0) + revenue)

      // Monthly
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`
      monthly.set(monthKey, (monthly.get(monthKey) || 0) + revenue)
    })

    return {
      daily: Array.from(daily.entries()).map(([date, amount]) => ({ date, amount })),
      weekly: Array.from(weekly.entries()).map(([week, amount]) => ({ week, amount })),
      monthly: Array.from(monthly.entries()).map(([month, amount]) => ({ month, amount }))
    }
  }

  const calculateOrderMetrics = (orders: any[]) => {
    const daily = new Map<string, number>()
    const statusBreakdown = new Map<string, number>()

    orders.forEach((order: any) => {
      const date = order.createdAt?.toDate() || new Date(order.createdAt || Date.now())
      const dayKey = date.toISOString().split('T')[0]
      daily.set(dayKey, (daily.get(dayKey) || 0) + 1)

      const status = order.status || 'pending'
      statusBreakdown.set(status, (statusBreakdown.get(status) || 0) + 1)
    })

    return {
      daily: Array.from(daily.entries()).map(([date, count]) => ({ date, count })),
      statusBreakdown: Array.from(statusBreakdown.entries()).map(([status, count]) => ({ status, count }))
    }
  }

  const calculateProductMetrics = (orders: any[]) => {
    const productSales = new Map<string, { quantity: number, revenue: number }>()
    const categorySales = new Map<string, { count: number, revenue: number }>()

    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        // Product sales
        const existing = productSales.get(item.name) || { quantity: 0, revenue: 0 }
        productSales.set(item.name, {
          quantity: existing.quantity + (item.qty || 0),
          revenue: existing.revenue + ((item.price || 0) * (item.qty || 0))
        })

        // Category sales (would need category info from product)
        const category = 'Other' // Simplified for now
        const categoryExisting = categorySales.get(category) || { count: 0, revenue: 0 }
        categorySales.set(category, {
          count: categoryExisting.count + (item.qty || 0),
          revenue: categoryExisting.revenue + ((item.price || 0) * (item.qty || 0))
        })
      })
    })

    const topSelling = Array.from(productSales.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)

    const categoryBreakdown = Array.from(categorySales.entries())
      .map(([category, data]) => ({ category, ...data }))

    return { topSelling, categoryBreakdown }
  }

  const calculateCustomerMetrics = (orders: any[]) => {
    const customerOrders = new Map<string, { orders: number, totalSpent: number, name: string }>()

    orders.forEach((order: any) => {
      const phone = order.customerPhone
      const existing = customerOrders.get(phone) || { orders: 0, totalSpent: 0, name: order.address?.fullName || 'Unknown' }
      customerOrders.set(phone, {
        orders: existing.orders + 1,
        totalSpent: existing.totalSpent + (order.total || 0),
        name: existing.name
      })
    })

    const customers = Array.from(customerOrders.entries())
    const newCustomers = customers.filter(([_, data]) => data.orders === 1).length
    const returningCustomers = customers.filter(([_, data]) => data.orders > 1).length
    
    const topSpenders = customers
      .map(([phone, data]) => ({ phone, name: data.name, totalSpent: data.totalSpent }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5)

    return {
      new: newCustomers,
      returning: returningCustomers,
      topSpenders
    }
  }

  const getSummaryStats = () => {
    if (!analytics) return { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, growth: 0 }

    const totalRevenue = analytics.revenue.daily.reduce((sum, day) => sum + day.amount, 0)
    const totalOrders = analytics.orders.daily.reduce((sum, day) => sum + day.count, 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      growth: 15 // Simplified growth calculation
    }
  }

  const stats = getSummaryStats()

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Business insights and performance metrics</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto"
          >
            <FiRefreshCw size={20} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: `+${stats.growth}%`,
            icon: FiDollarSign,
            color: 'bg-green-500'
          },
          {
            title: 'Total Orders',
            value: stats.totalOrders,
            change: '+12%',
            icon: FiShoppingBag,
            color: 'bg-blue-500'
          },
          {
            title: 'Avg Order Value',
            value: `₹${Math.round(stats.averageOrderValue).toLocaleString()}`,
            change: '+8%',
            icon: FiTrendingUp,
            color: 'bg-purple-500'
          },
          {
            title: 'Customers',
            value: (analytics?.customers.new || 0) + (analytics?.customers.returning || 0),
            change: '+5%',
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
                <p className="text-sm text-green-600 font-medium mt-1">{stat.change} vs last period</p>
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0 ml-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and Details */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
                     <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
             <FiBarChart className="text-gray-400" size={20} />
           </div>
           <div className="h-64 flex items-center justify-center text-gray-500">
             <div className="text-center">
               <FiBarChart className="mx-auto h-12 w-12 text-gray-300 mb-2" />
               <p>Revenue chart would be rendered here</p>
               <p className="text-sm text-gray-400">Integrate with charting library</p>
             </div>
           </div>
        </motion.div>

        {/* Order Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
            <FiPieChart className="text-gray-400" size={20} />
          </div>
          <div className="space-y-3">
            {analytics?.orders.statusBreakdown.map((status, index) => (
              <div key={status.status} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    status.status === 'pending' ? 'bg-yellow-500' :
                    status.status === 'processing' ? 'bg-blue-500' :
                    status.status === 'shipped' ? 'bg-purple-500' :
                    status.status === 'delivered' ? 'bg-green-500' :
                    'bg-red-500'
                  }`} />
                  <span className="text-sm text-gray-600 capitalize">{status.status}</span>
                </div>
                <span className="font-semibold text-gray-900">{status.count}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products and Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {analytics?.products.topSelling.slice(0, 5).map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.quantity} sold</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">₹{product.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Customers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Customers</h3>
          <div className="space-y-4">
            {analytics?.customers.topSpenders.map((customer, index) => (
              <div key={customer.phone} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">₹{customer.totalSpent.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Customer Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Customer Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="text-green-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.customers.new || 0}</p>
            <p className="text-sm text-gray-600">New Customers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="text-blue-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{analytics?.customers.returning || 0}</p>
            <p className="text-sm text-gray-600">Returning Customers</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiTrendingUp className="text-purple-600" size={24} />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {analytics ? Math.round((analytics.customers.returning / (analytics.customers.new + analytics.customers.returning)) * 100) : 0}%
            </p>
            <p className="text-sm text-gray-600">Retention Rate</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 