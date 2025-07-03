import { initializeApp, getApps } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, getDoc, query, where, orderBy, limit, onSnapshot, Timestamp, writeBatch } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Firebase Storage
export const storage = getStorage(app)

// Production Firebase Auth configuration
auth.useDeviceLanguage()

// Setup reCAPTCHA verifier with better error handling
export const setupRecaptcha = (containerId: string) => {
  // Clear any existing reCAPTCHA
  const container = document.getElementById(containerId)
  if (container) {
    container.innerHTML = ''
  }

  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      console.log('reCAPTCHA solved')
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired')
    }
  })
  return recaptchaVerifier
}

// Send OTP to phone number via Firebase SMS
export const sendOTP = async (phoneNumber: string, recaptchaVerifier: RecaptchaVerifier) => {
  try {
    if (!recaptchaVerifier) {
      throw new Error('reCAPTCHA verifier is required')
    }

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return confirmationResult
  } catch (error: any) {
    console.error('Error sending OTP:', error)
    
    // Add specific error handling for common Firebase Auth errors
    if (error.code === 'auth/billing-not-enabled') {
      throw new Error('SMS service not enabled. Please contact support.')
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many attempts. Please try again later.')
    } else if (error.code === 'auth/invalid-phone-number') {
      throw new Error('Invalid phone number format.')
    } else if (error.code === 'auth/missing-phone-number') {
      throw new Error('Phone number is required.')
    } else if (error.code === 'auth/quota-exceeded') {
      throw new Error('SMS quota exceeded. Please try again later.')
    }
    
    throw error
  }
}

// Product management functions
export const addProduct = async (productData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding product:', error)
    throw error
  }
}

export const updateProduct = async (productId: string, productData: any) => {
  try {
    const productRef = doc(db, 'products', productId)
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (productId: string) => {
  try {
    await deleteDoc(doc(db, 'products', productId))
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

export const getProduct = async (productId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'products', productId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Product not found')
    }
  } catch (error) {
    console.error('Error getting product:', error)
    throw error
  }
}

// Order management functions
export const createOrder = async (orderData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export const getOrders = async () => {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting orders:', error)
    throw error
  }
}

export const getOrder = async (orderId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'orders', orderId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Order not found')
    }
  } catch (error) {
    console.error('Error getting order:', error)
    throw error
  }
}

// Category management functions
export const addCategory = async (categoryData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding category:', error)
    throw error
  }
}

export const getCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'))
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting categories:', error)
    throw error
  }
}

export const updateCategory = async (categoryId: string, categoryData: any) => {
  try {
    const categoryRef = doc(db, 'categories', categoryId)
    await updateDoc(categoryRef, {
      ...categoryData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating category:', error)
    throw error
  }
}

export const deleteCategory = async (categoryId: string) => {
  try {
    await deleteDoc(doc(db, 'categories', categoryId))
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

// Real-time listeners
export const subscribeToOrders = (callback: (orders: any[]) => void) => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(orders)
  })
}

export const subscribeToProducts = (callback: (products: any[]) => void) => {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (querySnapshot) => {
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(products)
  })
}

// Enhanced Customer Management Functions
export const createCustomer = async (customerData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'customers'), {
      ...customerData,
      createdAt: new Date(),
      updatedAt: new Date(),
      totalOrders: 0,
      totalSpent: 0,
      lastOrderDate: null,
      loyaltyPoints: 0,
      preferredCategories: [],
      averageOrderValue: 0
    })
    return docRef.id
  } catch (error) {
    console.error('Error creating customer:', error)
    throw error
  }
}

export const updateCustomer = async (customerId: string, customerData: any) => {
  try {
    const customerRef = doc(db, 'customers', customerId)
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating customer:', error)
    throw error
  }
}

export const getCustomers = async () => {
  try {
    const q = query(collection(db, 'customers'), orderBy('totalSpent', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting customers:', error)
    throw error
  }
}

export const getCustomer = async (customerId: string) => {
  try {
    const docSnap = await getDoc(doc(db, 'customers', customerId))
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Customer not found')
    }
  } catch (error) {
    console.error('Error getting customer:', error)
    throw error
  }
}

export const getCustomerByPhone = async (phone: string) => {
  try {
    const q = query(collection(db, 'customers'), where('phone', '==', phone))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    }
    return null
  } catch (error) {
    console.error('Error getting customer by phone:', error)
    throw error
  }
}

export const getCustomerOrders = async (customerId: string) => {
  try {
    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting customer orders:', error)
    throw error
  }
}

// Advanced Order Management Functions
export const addOrderNote = async (orderId: string, note: string, addedBy: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    const orderDoc = await getDoc(orderRef)
    
    if (orderDoc.exists()) {
      const currentNotes = orderDoc.data().notes || []
      const newNote = {
        id: Date.now().toString(),
        note,
        addedBy,
        addedAt: new Date()
      }
      
      await updateDoc(orderRef, {
        notes: [...currentNotes, newNote],
        updatedAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error adding order note:', error)
    throw error
  }
}

export const updateOrderTracking = async (orderId: string, trackingData: any) => {
  try {
    const orderRef = doc(db, 'orders', orderId)
    await updateDoc(orderRef, {
      tracking: trackingData,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating order tracking:', error)
    throw error
  }
}

export const getOrdersByDateRange = async (startDate: Date, endDate: Date) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting orders by date range:', error)
    throw error
  }
}

export const getOrdersByStatus = async (status: string) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting orders by status:', error)
    throw error
  }
}

export const bulkUpdateOrderStatus = async (orderIds: string[], newStatus: string) => {
  try {
    const batch = []
    for (const orderId of orderIds) {
      const orderRef = doc(db, 'orders', orderId)
      batch.push(updateDoc(orderRef, { 
        status: newStatus, 
        updatedAt: new Date() 
      }))
    }
    await Promise.all(batch)
  } catch (error) {
    console.error('Error bulk updating order status:', error)
    throw error
  }
}

// Analytics and Reporting Functions
export const getAnalyticsData = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  try {
    const now = new Date()
    const startDate = new Date()
    
    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 30) // Last 30 days
        break
      case 'week':
        startDate.setDate(now.getDate() - 7 * 12) // Last 12 weeks
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 12) // Last 12 months
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 5) // Last 5 years
        break
    }

    const [orders, products, customers] = await Promise.all([
      getOrdersByDateRange(startDate, now),
      getProducts(),
      getCustomers()
    ])

    return {
      orders,
      products,
      customers,
      period,
      dateRange: { startDate, endDate: now }
    }
  } catch (error) {
    console.error('Error getting analytics data:', error)
    throw error
  }
}

export const getRevenueAnalytics = async (period: string = 'month') => {
  try {
    const analyticsData = await getAnalyticsData(period as any)
    const { orders } = analyticsData
    
    const revenueByPeriod = new Map()
    const revenueByCategory = new Map()
    const revenueByProduct = new Map()
    
    let totalRevenue = 0
    let totalOrders = orders.length
    let averageOrderValue = 0
    
    orders.forEach((order: any) => {
      const orderDate = order.createdAt?.toDate() || new Date(order.createdAt)
      const revenue = order.total || 0
      totalRevenue += revenue
      
      // Group by period
      let periodKey = ''
      switch (period) {
        case 'day':
          periodKey = orderDate.toISOString().split('T')[0]
          break
        case 'week':
          const weekStart = new Date(orderDate)
          weekStart.setDate(orderDate.getDate() - orderDate.getDay())
          periodKey = weekStart.toISOString().split('T')[0]
          break
        case 'month':
          periodKey = `${orderDate.getFullYear()}-${(orderDate.getMonth() + 1).toString().padStart(2, '0')}`
          break
        case 'year':
          periodKey = orderDate.getFullYear().toString()
          break
      }
      
      revenueByPeriod.set(periodKey, (revenueByPeriod.get(periodKey) || 0) + revenue)
      
      // Revenue by product
      order.items?.forEach((item: any) => {
        const productRevenue = (item.price || 0) * (item.qty || 0)
        revenueByProduct.set(item.name, (revenueByProduct.get(item.name) || 0) + productRevenue)
        
        // Category would need to be retrieved from product data
        const category = item.category || 'Other'
        revenueByCategory.set(category, (revenueByCategory.get(category) || 0) + productRevenue)
      })
    })
    
    averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      revenueByPeriod: Array.from(revenueByPeriod.entries()).map(([period, revenue]) => ({ period, revenue })),
      revenueByCategory: Array.from(revenueByCategory.entries()).map(([category, revenue]) => ({ category, revenue })),
      topProducts: Array.from(revenueByProduct.entries())
        .map(([name, revenue]) => ({ name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10)
    }
  } catch (error) {
    console.error('Error getting revenue analytics:', error)
    throw error
  }
}

export const getCustomerAnalytics = async () => {
  try {
    const [customers, orders] = await Promise.all([
      getCustomers(),
      getOrders()
    ])
    
    // Handle empty customer data gracefully
    if (!customers || customers.length === 0) {
      return {
        totalCustomers: 0,
        segments: { new: 0, active: 0, inactive: 0, churned: 0 },
        averageLifetimeValue: 0,
        geographicDistribution: [],
        topCustomers: []
      }
    }
    
    // Customer segmentation
    const segments = {
      new: 0, // 0-30 days
      active: 0, // 31-90 days
      inactive: 0, // 91-180 days
      churned: 0 // 180+ days
    }
    
    const customerLifetimeValue = new Map()
    const orderFrequency = new Map()
    const geographicDistribution = new Map()
    
    const now = new Date()
    
    customers.forEach((customer: any) => {
      // Handle missing lastOrderDate
      let lastOrderDate = customer.lastOrderDate
      if (lastOrderDate) {
        lastOrderDate = lastOrderDate.toDate ? lastOrderDate.toDate() : new Date(lastOrderDate)
      } else {
        // If no last order date, use created date or current date
        lastOrderDate = customer.createdAt ? 
          (customer.createdAt.toDate ? customer.createdAt.toDate() : new Date(customer.createdAt)) :
          new Date()
      }
      
      const daysSinceLastOrder = (now.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24)
      
      if (daysSinceLastOrder <= 30) segments.new++
      else if (daysSinceLastOrder <= 90) segments.active++
      else if (daysSinceLastOrder <= 180) segments.inactive++
      else segments.churned++
      
      customerLifetimeValue.set(customer.id, customer.totalSpent || 0)
      orderFrequency.set(customer.id, customer.totalOrders || 0)
      
      const location = `${customer.city || 'Unknown'}, ${customer.state || 'Unknown'}`
      geographicDistribution.set(location, (geographicDistribution.get(location) || 0) + 1)
    })
    
    const totalSpent = customers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0)
    const averageLifetimeValue = customers.length > 0 ? totalSpent / customers.length : 0
    
    return {
      totalCustomers: customers.length,
      segments,
      averageLifetimeValue,
      geographicDistribution: Array.from(geographicDistribution.entries()).map(([location, count]) => ({ location, count })),
      topCustomers: customers.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        totalSpent: c.totalSpent || 0,
        totalOrders: c.totalOrders || 0
      }))
    }
  } catch (error) {
    console.error('Error getting customer analytics:', error)
    // Return empty analytics if there's an error
    return {
      totalCustomers: 0,
      segments: { new: 0, active: 0, inactive: 0, churned: 0 },
      averageLifetimeValue: 0,
      geographicDistribution: [],
      topCustomers: []
    }
  }
}

export const getProductAnalytics = async () => {
  try {
    const [products, orders] = await Promise.all([
      getProducts(),
      getOrders()
    ])
    
    const productSales = new Map()
    const categoryPerformance = new Map()
    const inventoryStatus = new Map()
    
    // Initialize product sales tracking
    products.forEach((product: any) => {
      productSales.set(product.id, {
        name: product.name,
        category: product.category,
        price: product.price,
        inventory: product.inventory || 0,
        sold: 0,
        revenue: 0
      })
    })
    
    // Calculate sales from orders
    orders.forEach((order: any) => {
      order.items?.forEach((item: any) => {
        const productId = item.productId || item.id
        if (productSales.has(productId)) {
          const productData = productSales.get(productId)
          productData.sold += item.qty || 0
          productData.revenue += (item.price || 0) * (item.qty || 0)
          
          const category = productData.category || 'Other'
          const categoryData = categoryPerformance.get(category) || { sold: 0, revenue: 0 }
          categoryData.sold += item.qty || 0
          categoryData.revenue += (item.price || 0) * (item.qty || 0)
          categoryPerformance.set(category, categoryData)
        }
      })
    })
    
    const topSellingProducts = Array.from(productSales.values())
      .sort((a: any, b: any) => b.sold - a.sold)
      .slice(0, 10)
    
    const topRevenueProducts = Array.from(productSales.values())
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10)
    
    return {
      totalProducts: products.length,
      topSellingProducts,
      topRevenueProducts,
      categoryPerformance: Array.from(categoryPerformance.entries()).map(([category, data]) => ({ category, ...data })),
      lowStockAlerts: Array.from(productSales.values()).filter((p: any) => p.inventory < 10)
    }
  } catch (error) {
    console.error('Error getting product analytics:', error)
    throw error
  }
}

// Real-time Subscriptions
export const subscribeToCustomers = (callback: (customers: any[]) => void) => {
  const q = query(collection(db, 'customers'), orderBy('totalSpent', 'desc'))
  return onSnapshot(q, (querySnapshot) => {
    const customers = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    callback(customers)
  })
}

export const subscribeToAnalytics = (callback: (data: any) => void) => {
  // Subscribe to orders for real-time analytics updates
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(100))
  return onSnapshot(q, async (querySnapshot) => {
    const orders = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    
    // Calculate basic analytics
    const totalRevenue = orders.reduce((sum, order: any) => sum + (order.total || 0), 0)
    const totalOrders = orders.length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    const statusCounts = orders.reduce((acc: any, order: any) => {
      acc[order.status] = (acc[order.status] || 0) + 1
      return acc
    }, {})
    
    callback({
      totalRevenue,
      totalOrders,
      averageOrderValue,
      statusCounts,
      recentOrders: orders.slice(0, 10)
    })
  })
}

// Function to create sample customer data for testing
export const createSampleCustomers = async () => {
  try {
    const sampleCustomers = [
      {
        name: 'Rajesh Kumar',
        phone: '+91-9876543210',
        email: 'rajesh.kumar@email.com',
        city: 'Delhi',
        state: 'Delhi',
        totalOrders: 5,
        totalSpent: 12500,
        lastOrderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        firstOrderDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
        loyaltyPoints: 125,
        preferredCategories: ['plants', 'fertilizers']
      },
      {
        name: 'Priya Sharma',
        phone: '+91-9876543211',
        email: 'priya.sharma@email.com',
        city: 'Mumbai',
        state: 'Maharashtra',
        totalOrders: 8,
        totalSpent: 18750,
        lastOrderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        firstOrderDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
        loyaltyPoints: 188,
        preferredCategories: ['plants', 'tools']
      },
      {
        name: 'Amit Patel',
        phone: '+91-9876543212',
        email: 'amit.patel@email.com',
        city: 'Bangalore',
        state: 'Karnataka',
        totalOrders: 3,
        totalSpent: 7250,
        lastOrderDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
        firstOrderDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 2.5 months ago
        loyaltyPoints: 72,
        preferredCategories: ['seeds', 'fertilizers']
      },
      {
        name: 'Sunita Verma',
        phone: '+91-9876543213',
        email: 'sunita.verma@email.com',
        city: 'Chennai',
        state: 'Tamil Nadu',
        totalOrders: 12,
        totalSpent: 28900,
        lastOrderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        firstOrderDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 6 months ago
        loyaltyPoints: 289,
        preferredCategories: ['plants', 'fertilizers', 'tools']
      },
      {
        name: 'Ravi Singh',
        phone: '+91-9876543214',
        city: 'Pune',
        state: 'Maharashtra',
        totalOrders: 2,
        totalSpent: 4500,
        lastOrderDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000), // 4 months ago
        firstOrderDate: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000), // 5 months ago
        loyaltyPoints: 45,
        preferredCategories: ['seeds']
      },
      {
        name: 'Meera Gupta',
        phone: '+91-9876543215',
        email: 'meera.gupta@email.com',
        city: 'Kolkata',
        state: 'West Bengal',
        totalOrders: 6,
        totalSpent: 15200,
        lastOrderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
        firstOrderDate: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000), // 3.3 months ago
        loyaltyPoints: 152,
        preferredCategories: ['plants', 'tools']
      },
      {
        name: 'Karan Joshi',
        phone: '+91-9876543216',
        email: 'karan.joshi@email.com',
        city: 'Ahmedabad',
        state: 'Gujarat',
        totalOrders: 4,
        totalSpent: 9800,
        lastOrderDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
        firstOrderDate: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000), // 2.7 months ago
        loyaltyPoints: 98,
        preferredCategories: ['fertilizers', 'tools']
      },
      {
        name: 'Deepika Reddy',
        phone: '+91-9876543217',
        email: 'deepika.reddy@email.com',
        city: 'Hyderabad',
        state: 'Telangana',
        totalOrders: 9,
        totalSpent: 22300,
        lastOrderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        firstOrderDate: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000), // 4.3 months ago
        loyaltyPoints: 223,
        preferredCategories: ['plants', 'fertilizers', 'seeds']
      }
    ]

    const customerIds = []
    for (const customerData of sampleCustomers) {
      const customerId = await createCustomer(customerData)
      customerIds.push(customerId)
      console.log(`Created customer: ${customerData.name} with ID: ${customerId}`)
    }

    return customerIds
  } catch (error) {
    console.error('Error creating sample customers:', error)
    throw error
  }
}

export const createSampleCategories = async () => {
  try {
    console.log('Creating sample categories...')
    
    const sampleCategories = [
      {
        name: 'Indoor Plants',
        description: 'Perfect plants for your home and office spaces',
        icon: '🪴',
        subcategories: ['Succulents', 'Ferns', 'Air Purifying', 'Low Light']
      },
      {
        name: 'Outdoor Plants',
        description: 'Beautiful plants for gardens and outdoor spaces',
        icon: '🌳',
        subcategories: ['Trees', 'Shrubs', 'Climbers', 'Ground Cover']
      },
      {
        name: 'Flowering Plants',
        description: 'Vibrant flowers to brighten your space',
        icon: '🌸',
        subcategories: ['Roses', 'Lilies', 'Marigolds', 'Jasmine']
      },
      {
        name: 'Tools',
        description: 'Professional gardening tools and equipment',
        icon: '🛠️',
        subcategories: ['Hand Tools', 'Watering', 'Pruning', 'Digging']
      },
      {
        name: 'Soil & Fertilizer',
        description: 'Organic soil and plant nutrition products',
        icon: '🪨',
        subcategories: ['Potting Mix', 'Fertilizers', 'Compost', 'Amendments']
      },
      {
        name: 'Pots & Planters',
        description: 'Beautiful containers for your plants',
        icon: '🏺',
        subcategories: ['Ceramic', 'Plastic', 'Terracotta', 'Hanging']
      },
      {
        name: 'Seeds',
        description: 'High-quality seeds for growing your own plants',
        icon: '🌾',
        subcategories: ['Flower Seeds', 'Vegetable Seeds', 'Herb Seeds', 'Grass Seeds']
      }
    ]

    const promises = sampleCategories.map(category => addCategory(category))
    await Promise.all(promises)
    
    console.log('Sample categories created successfully!')
    return true
  } catch (error) {
    console.error('Error creating sample categories:', error)
    return false
  }
}

// Image Upload Utilities
export const uploadImage = async (file: File, folder: string = 'images'): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}_${file.name}`
    const storageRef = ref(storage, `${folder}/${filename}`)
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    console.log('Image uploaded successfully:', downloadURL)
    return downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    throw new Error('Failed to upload image. Please try again.')
  }
}

export const uploadMultipleImages = async (files: File[], folder: string = 'images'): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder))
    const urls = await Promise.all(uploadPromises)
    return urls
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw new Error('Failed to upload images. Please try again.')
  }
}

export const deleteImageFromStorage = async (imageUrl: string): Promise<boolean> => {
  try {
    // Extract the path from the URL
    const urlParts = imageUrl.split('/')
    const fileName = urlParts[urlParts.length - 1].split('?')[0]
    
    // Create reference and delete
    const imageRef = ref(storage, fileName)
    await deleteObject(imageRef)
    
    console.log('Image deleted successfully')
    return true
  } catch (error) {
    console.error('Error deleting image:', error)
    return false
  }
}

// Image validation utility
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return { 
      isValid: false, 
      error: 'Please select a valid image file (JPEG, PNG, WebP, or GIF)' 
    }
  }
  
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: 'Image size must be less than 5MB' 
    }
  }
  
  return { isValid: true }
}

// Image compression utility (optional)
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          })
          resolve(compressedFile)
        } else {
          resolve(file) // Return original if compression fails
        }
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export default app 