'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiShoppingCart, 
  FiEye, 
  FiEdit, 
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiRefreshCw,
  FiPhone,
  FiMapPin,
  FiGrid,
  FiList,
  FiDownload,
  FiFilter,
  FiCheckSquare,
  FiSquare,
  FiMessageSquare,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiPlus,
  FiFileText,
  FiSearch,
  FiTrendingUp
} from 'react-icons/fi'
import { 
  getOrders, 
  updateOrderStatus, 
  subscribeToOrders, 
  addOrderNote, 
  bulkUpdateOrderStatus,
  getOrdersByStatus,
  getOrdersByDateRange 
} from '@/lib/firebase'
import PlaceholderImage from '@/components/PlaceholderImage'

interface Order {
  id: string
  customerPhone: string
  items: Array<{
    name: string
    price: number
    qty: number
    image: string
  }>
  address: {
    fullName: string
    phoneNumber: string
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    pincode: string
    landmark?: string
  }
  total: number
  subtotal: number
  deliveryFee: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentMethod: string
  createdAt: any
  updatedAt: any
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showStatusModal, setShowStatusModal] = useState<string | null>(null)
  const [newStatus, setNewStatus] = useState('')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [bulkAction, setBulkAction] = useState('')
  const [showNotesModal, setShowNotesModal] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  useEffect(() => {
    loadOrders()
    
    // Subscribe to real-time order updates
    const unsubscribe = subscribeToOrders((ordersData) => {
      setOrders(ordersData)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadOrders = async () => {
    try {
      const ordersData = await getOrders()
      setOrders(ordersData as Order[])
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !statusFilter || order.status === statusFilter
    const matchesSearch = !searchTerm || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerPhone.includes(searchTerm) ||
      order.address.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'createdAt':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'total':
        return b.total - a.total
      case 'status':
        return a.status.localeCompare(b.status)
      case 'customer':
        return a.address.fullName.localeCompare(b.address.fullName)
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

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status)
      setShowStatusModal(null)
      await loadOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
    }
  }

  const handleBulkAction = async () => {
    if (!bulkAction || selectedOrders.length === 0) return
    
    try {
      if (bulkAction.startsWith('status-')) {
        const status = bulkAction.replace('status-', '')
        await bulkUpdateOrderStatus(selectedOrders, status)
      }
      
      setShowBulkModal(false)
      setSelectedOrders([])
      setBulkAction('')
      await loadOrders()
    } catch (error) {
      console.error('Error performing bulk action:', error)
    }
  }

  const handleAddNote = async (orderId: string) => {
    if (!newNote.trim()) return
    
    try {
      await addOrderNote(orderId, newNote, 'Admin')
      setNewNote('')
      setShowNotesModal(null)
      await loadOrders()
    } catch (error) {
      console.error('Error adding note:', error)
    }
  }

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const selectAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id))
    }
  }

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer Phone', 'Customer Name', 'Total', 'Status', 'Created At', 'Items Count', 'City'].join(','),
      ...filteredOrders.map(order => [
        order.id,
        order.customerPhone,
        order.address.fullName,
        order.total,
        order.status,
        formatDate(order.createdAt),
        order.items.length,
        order.address.city
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock size={16} />
      case 'processing': return <FiPackage size={16} />
      case 'shipped': return <FiTruck size={16} />
      case 'delivered': return <FiCheck size={16} />
      case 'cancelled': return <FiX size={16} />
      default: return <FiClock size={16} />
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const d = date.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusStats = () => {
    const stats = {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    }
    return stats
  }

  const stats = getStatusStats()

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
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <FiShoppingCart className="text-green-600" size={20} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          </div>
          <p className="text-gray-600">Manage customer orders, track delivery status, and process orders efficiently</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {selectedOrders.length > 0 && (
            <button
              onClick={() => setShowBulkModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <FiEdit size={16} />
              <span>Bulk Actions ({selectedOrders.length})</span>
            </button>
          )}
          <button
            onClick={exportOrders}
            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiDownload size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={loadOrders}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <FiRefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Status Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          { status: 'pending', label: 'Pending', count: stats.pending, color: 'bg-yellow-500' },
          { status: 'processing', label: 'Processing', count: stats.processing, color: 'bg-blue-500' },
          { status: 'shipped', label: 'Shipped', count: stats.shipped, color: 'bg-purple-500' },
          { status: 'delivered', label: 'Delivered', count: stats.delivered, color: 'bg-green-500' },
          { status: 'cancelled', label: 'Cancelled', count: stats.cancelled, color: 'bg-red-500' },
        ].map((stat) => (
          <motion.div
            key={stat.status}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-3 md:p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setStatusFilter(statusFilter === stat.status ? '' : stat.status)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="mb-2 sm:mb-0">
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.count}</p>
              </div>
              <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg ${stat.color} flex items-center justify-center text-white self-end sm:self-auto`}>
                {getStatusIcon(stat.status)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders by ID, phone, or customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-3 sm:space-y-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none min-w-[140px]"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="total">Sort by Amount</option>
                <option value="status">Sort by Status</option>
                <option value="customer">Sort by Customer</option>
              </select>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiList size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <FiGrid size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={selectAllOrders}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                {selectedOrders.length === filteredOrders.length && filteredOrders.length > 0 ? 
                  <FiCheckSquare size={16} /> : <FiSquare size={16} />
                }
                <span>Select All</span>
              </button>
              {selectedOrders.length > 0 && (
                <span className="text-sm text-blue-600 font-medium">
                  {selectedOrders.length} selected
                </span>
              )}
            </div>
            <div className="text-sm text-gray-600 whitespace-nowrap">
              {filteredOrders.length} orders
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid gap-4 md:gap-5">
        {filteredOrders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => setSelectedOrder(order)}
            className="group bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50/30 to-blue-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
            
            {/* Content */}
            <div className="relative">
              {/* Header Row */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {/* Selection Checkbox */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleOrderSelection(order.id)
                    }}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {selectedOrders.includes(order.id) ? 
                      <FiCheckSquare className="text-green-600" size={18} /> : 
                      <FiSquare className="text-gray-400" size={18} />
                    }
                  </button>

                  {/* Order Info */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        #{order.id.slice(-8).toUpperCase()}
                      </h3>
                      <span className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowStatusModal(order.id)
                      setNewStatus(order.status)
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Update Status"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowNotesModal(order.id)
                      setNewNote('')
                    }}
                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Add Note"
                  >
                    <FiMessageSquare size={16} />
                  </button>
                </div>
              </div>

              {/* Order Details Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Customer Phone */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPhone className="text-gray-500" size={14} />
                  </div>
                  <span className="text-sm text-gray-600 truncate font-medium">{order.customerPhone}</span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="text-gray-500" size={14} />
                  </div>
                  <span className="text-sm text-gray-600 truncate">{order.address.city}, {order.address.state}</span>
                </div>

                {/* Items Count */}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiPackage className="text-gray-500" size={14} />
                  </div>
                  <span className="text-sm text-gray-600">{order.items.length} items</span>
                </div>

                {/* Total Amount */}
                <div className="flex items-center justify-end md:justify-start space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiDollarSign className="text-green-600" size={14} />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total)}</span>
                </div>
              </div>

              {/* Click Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FiEye size={12} className="mr-1" />
                  Click to view details
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <FiShoppingCart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Order Details #{selectedOrder.id.slice(-8)}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Status */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Order Status</p>
                    <div className={`inline-flex items-center space-x-1 px-3 py-1 text-sm font-medium border rounded-full ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-medium">{formatDate(selectedOrder.createdAt)}</p>
                  </div>
                </div>

                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <FiPhone className="text-gray-400" size={16} />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                    <div className="flex items-start space-x-2">
                      <FiMapPin className="text-gray-400 mt-1" size={16} />
                      <div>
                        <p className="font-medium">{selectedOrder.address.fullName}</p>
                        <p>{selectedOrder.address.addressLine1}</p>
                        {selectedOrder.address.addressLine2 && <p>{selectedOrder.address.addressLine2}</p>}
                        <p>{selectedOrder.address.city}, {selectedOrder.address.state} - {selectedOrder.address.pincode}</p>
                        {selectedOrder.address.landmark && <p>Landmark: {selectedOrder.address.landmark}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-12 h-12 rounded object-cover bg-gray-100"
                          />
                        ) : (
                          <PlaceholderImage
                            width={60}
                            height={60}
                            text="No Image"
                            className="w-12 h-12 rounded object-cover bg-gray-100"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{formatCurrency(item.price * item.qty)}</p>
                          <p className="text-sm text-gray-600">{formatCurrency(item.price)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatCurrency(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{selectedOrder.deliveryFee === 0 ? 'FREE' : formatCurrency(selectedOrder.deliveryFee)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Modal */}
      <AnimatePresence>
        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FiEdit className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Actions</h3>
                <p className="text-gray-600 mb-6">
                  Apply actions to {selectedOrders.length} selected orders
                </p>
                
                <div className="mb-6">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select Action</option>
                    <option value="status-processing">Mark as Processing</option>
                    <option value="status-shipped">Mark as Shipped</option>
                    <option value="status-delivered">Mark as Delivered</option>
                    <option value="status-cancelled">Mark as Cancelled</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowBulkModal(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBulkAction}
                    disabled={!bulkAction}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Notes Modal */}
      <AnimatePresence>
        {showNotesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FiMessageSquare className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Add Order Note</h3>
                <p className="text-gray-600 mb-6">
                  Add a note for order #{showNotesModal.slice(-8)}
                </p>
                
                <div className="mb-6">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Enter your note here..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowNotesModal(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddNote(showNotesModal)}
                    disabled={!newNote.trim()}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Status Update Modal */}
      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <FiEdit className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Update Order Status</h3>
                <p className="text-gray-600 mb-6">
                  Change the status for order #{showStatusModal.slice(-8)}
                </p>
                
                <div className="mb-6">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowStatusModal(null)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(showStatusModal, newStatus)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Update
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
} 