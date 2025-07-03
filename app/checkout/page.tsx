'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/navigation'
import PhoneVerification from '@/components/PhoneVerification'
import AddressForm from '@/components/AddressForm'
import OrderSummary from '@/components/OrderSummary'
import { FiArrowLeft, FiCheck, FiTruck, FiCreditCard } from 'react-icons/fi'

interface Address {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pincode: string
  landmark?: string
}

export default function CheckoutPage() {
  const { cart: cartItems, cartCount, clearCart } = useCart()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0)
  }
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [verifiedPhone, setVerifiedPhone] = useState('')
  const [address, setAddress] = useState<Address | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  
  // Show loading while cart data is loading
  if (!Array.isArray(cartItems)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    )
  }

  const steps = [
    { id: 1, title: 'Phone Verification', icon: '📱' },
    { id: 2, title: 'Delivery Address', icon: '📍' },
    { id: 3, title: 'Payment & Review', icon: '💳' },
  ]

  // Redirect if cart is empty
  useEffect(() => {
    if (Array.isArray(cartItems) && cartItems.length === 0 && !orderPlaced) {
      router.push('/')
    }
  }, [cartItems, router, orderPlaced])

  const handlePhoneVerified = (phone: string) => {
    setPhoneVerified(true)
    setVerifiedPhone(phone)
    setCurrentStep(2)
  }

  const handleAddressSubmit = (addressData: Address) => {
    setAddress(addressData)
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    
    try {
      if (!address) {
        throw new Error('Address is required')
      }

      // Calculate totals
      const subtotal = getTotalPrice()
      const deliveryFee = subtotal >= 500 ? 0 : 50
      const total = subtotal + deliveryFee

      // Create order data
      const orderData = {
        customerPhone: verifiedPhone,
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image
        })),
        address: address,
        subtotal: subtotal,
        deliveryFee: deliveryFee,
        total: total,
        paymentMethod: 'Cash on Delivery',
        status: 'pending'
      }

      // Save order to Firebase
      const { createOrder } = await import('@/lib/firebase')
      const newOrderId = await createOrder(orderData)
      
      setOrderId(newOrderId)
      setOrderPlaced(true)
      clearCart()
      
      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        router.push(`/order-confirmation/${newOrderId}`)
      }, 3000)
      
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8 px-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className={`flex flex-col items-center ${index < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2
              ${currentStep >= step.id 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {currentStep > step.id ? <FiCheck size={16} /> : step.id}
            </div>
            <span className={`text-xs text-center ${
              currentStep >= step.id ? 'text-green-600 font-medium' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-4 ${
              currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-green-500 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">Order ID: {orderId}</p>
          <p className="text-sm text-gray-500 mb-6">
            Your order will be delivered within 2-3 business days via Cash on Delivery.
          </p>
          <div className="text-xs text-gray-400">
            Redirecting to order confirmation...
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">Checkout</h1>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-lg mx-auto">
        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="phone-verification"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <PhoneVerification onVerified={handlePhoneVerified} />
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="address-form"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <AddressForm 
                initialPhone={verifiedPhone}
                onSubmit={handleAddressSubmit}
                onBack={() => setCurrentStep(1)}
              />
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="payment-review"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6 p-4">
                {/* Delivery Address */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FiTruck className="mr-2 text-green-500" />
                    Delivery Address
                  </h3>
                  {address && (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{address.fullName}</p>
                      <p>{address.addressLine1}</p>
                      {address.addressLine2 && <p>{address.addressLine2}</p>}
                      <p>{address.city}, {address.state} - {address.pincode}</p>
                      <p className="text-green-600">📱 {address.phoneNumber}</p>
                    </div>
                  )}
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-green-500 text-sm font-medium mt-2"
                  >
                    Change Address
                  </button>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FiCreditCard className="mr-2 text-green-500" />
                    Payment Method
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                        💰
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-600">Pay when you receive</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <FiCheck className="text-white text-xs" />
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <OrderSummary />

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center"
                >
                  {isPlacingOrder ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Place Order (₹{getTotalPrice().toLocaleString()})
                    </>
                  )}
                </button>

                <div className="text-center">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-gray-500 text-sm"
                  >
                    ← Back to Address
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
} 