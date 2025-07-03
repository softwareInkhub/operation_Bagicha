'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FiUsers, 
  FiPhone, 
  FiMapPin, 
  FiShoppingBag,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi'
import { getOrders } from '@/lib/firebase'

interface Customer {
  phone: string
  name: string
  city: string
  state: string
  totalOrders: number
  totalSpent: number
  lastOrderDate: any
  firstOrderDate: any
}

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  const loadCustomers = async () => {
    try {
      const orders = await getOrders() as any[]
      
      // Group orders by customer phone and calculate stats
      const customerMap = new Map<string, Customer>()
      
      orders.forEach(order => {
        const phone = order.customerPhone
        const existing = customerMap.get(phone)
        
        if (existing) {
          existing.totalOrders += 1
          existing.totalSpent += order.total || 0
          
          // Update last order date if this order is more recent
          if (order.createdAt && (!existing.lastOrderDate || 
              order.createdAt.toDate() > existing.lastOrderDate.toDate())) {
            existing.lastOrderDate = order.createdAt
          }
          
          // Update first order date if this order is older
          if (order.createdAt && (!existing.firstOrderDate || 
              order.createdAt.toDate() < existing.firstOrderDate.toDate())) {
            existing.firstOrderDate = order.createdAt
          }
        } else {
          customerMap.set(phone, {
            phone,
            name: order.address?.fullName || 'Unknown',
            city: order.address?.city || 'Unknown',
            state: order.address?.state || 'Unknown',
            totalOrders: 1,
            totalSpent: order.total || 0,
            lastOrderDate: order.createdAt,
            firstOrderDate: order.createdAt
          })
        }
      })
      
      // Convert to array and sort by total spent
      const customersArray = Array.from(customerMap.values())
        .sort((a, b) => b.totalSpent - a.totalSpent)
      
      setCustomers(customersArray)
    } catch (error) {
      console.error('Error loading customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredCustomers = customers.filter(customer => {
    const searchLower = searchTerm.toLowerCase()
    return customer.name.toLowerCase().includes(searchLower) ||
           customer.phone.includes(searchTerm) ||
           customer.city.toLowerCase().includes(searchLower)
  })

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString()
  }

  const getCustomerStats = () => {
    return {
      total: customers.length,
      totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
      averageOrderValue: customers.length > 0 
        ? customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.reduce((sum, c) => sum + c.totalOrders, 0)
        : 0,
      repeatCustomers: customers.filter(c => c.totalOrders > 1).length
    }
  }

  const stats = getCustomerStats()

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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer base and relationships</p>
        </div>
        <button
          onClick={loadCustomers}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full lg:w-auto"
        >
          <FiRefreshCw size={20} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          {
            title: 'Total Customers',
            value: stats.total,
            icon: FiUsers,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            icon: FiShoppingBag,
            color: 'bg-green-500'
          },
          {
            title: 'Average Order Value',
            value: `₹${Math.round(stats.averageOrderValue).toLocaleString()}`,
            icon: FiShoppingBag,
            color: 'bg-purple-500'
          },
          {
            title: 'Repeat Customers',
            value: stats.repeatCustomers,
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
              </div>
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0 ml-3`}>
                <stat.icon className="text-white" size={20} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <input
          type="text"
          placeholder="Search customers by name, phone, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900">Customer</th>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900 hidden md:table-cell">Location</th>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900">Orders</th>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900">Total Spent</th>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900 hidden lg:table-cell">First Order</th>
                <th className="text-left py-3 px-4 md:px-6 font-medium text-gray-900 hidden lg:table-cell">Last Order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => (
                <motion.tr
                  key={customer.phone}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiUsers className="text-green-600" size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                        <p className="text-sm text-gray-600 flex items-center md:hidden">
                          <FiMapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{customer.city}</span>
                        </p>
                        <p className="text-sm text-gray-600 flex items-center">
                          <FiPhone size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{customer.phone}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6 hidden md:table-cell">
                    <div className="flex items-center text-sm text-gray-600">
                      <FiMapPin size={14} className="mr-1 flex-shrink-0" />
                      <span className="truncate">{customer.city}, {customer.state}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="font-semibold text-gray-900">{customer.totalOrders}</span>
                      {customer.totalOrders > 1 && (
                        <span className="mt-1 sm:mt-0 sm:ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Repeat
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-4 md:px-6">
                    <span className="font-semibold text-gray-900">
                      ₹{customer.totalSpent.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4 md:px-6 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {formatDate(customer.firstOrderDate)}
                    </span>
                  </td>
                  <td className="py-4 px-4 md:px-6 hidden lg:table-cell">
                    <span className="text-sm text-gray-600">
                      {formatDate(customer.lastOrderDate)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <FiUsers className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No customers found</p>
        </div>
      )}
    </div>
  )
} 