'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { FiCheck, FiTruck, FiHome, FiClock, FiPhone } from 'react-icons/fi'

interface OrderConfirmationPageProps {
  params: {
    orderId: string
  }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const router = useRouter()
  const [timeLeft, setTimeLeft] = useState(10)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          router.push('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.push('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiHome size={20} />
          </button>
          <h1 className="text-lg font-semibold">Order Confirmed</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <FiCheck className="text-green-500 text-4xl" />
            </motion.div>
          </motion.div>

          {/* Order Details */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully! 🎉
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for choosing Bagicha. Your plants are on their way!
            </p>

            {/* Order ID */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {params.orderId}
              </p>
            </div>

            {/* Delivery Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center">
                  <FiTruck className="text-blue-500 text-xl mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Estimated Delivery</p>
                    <p className="text-sm text-blue-600">
                      {estimatedDelivery.toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                    💰
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Payment Method</p>
                    <p className="text-sm text-green-600">Cash on Delivery</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center">
                  <FiClock className="text-orange-500 text-xl mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Delivery Time</p>
                    <p className="text-sm text-orange-600">2-3 Business Days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <FiPhone className="mr-2 text-green-500" />
                Need Help?
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                For any queries about your order, contact us:
              </p>
              <p className="text-green-600 font-medium">📞 +91 9876543210</p>
              <p className="text-green-600 font-medium">✉️ support@bagicha.com</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <motion.button
                onClick={() => router.push('/')}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Continue Shopping
              </motion.button>
              
              <motion.button
                onClick={() => {
                  // In a real app, this would show order tracking
                  alert('Order tracking feature coming soon!')
                }}
                className="w-full bg-white border-2 border-green-500 text-green-500 hover:bg-green-50 font-semibold py-3 rounded-xl transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Track Order
              </motion.button>
            </div>

            {/* Auto redirect notice */}
            <p className="text-xs text-gray-400 mt-6">
              Redirecting to home in {timeLeft} seconds...
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Tips */}
      <div className="bg-white border-t p-4">
        <div className="max-w-md mx-auto">
          <h4 className="font-semibold text-gray-900 mb-2">Plant Care Tips 🌱</h4>
          <p className="text-sm text-gray-600">
            Keep your new plants in indirect sunlight for the first few days. 
            Water them gently and ensure proper drainage.
          </p>
        </div>
      </div>
    </div>
  )
} 