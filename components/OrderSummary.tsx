'use client'

import { useCart } from '@/context/CartContext'
import { FiShoppingBag, FiTruck, FiTag } from 'react-icons/fi'

export default function OrderSummary() {
  const { cart: cartItems } = useCart()

  // Calculate total price
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0)
  }

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 500 ? 0 : 50 // Free delivery above ₹500
  const total = subtotal + deliveryFee

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <FiShoppingBag className="mr-2 text-green-500" />
        Order Summary
      </h3>

      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item, index) => (
          <div key={`${item.name}-${index}`} className="flex items-center space-x-3">
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg bg-gray-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.qty}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-900">
              ₹{(item.price * item.qty).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Details */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <FiTruck className="mr-1" />
            Delivery Fee
          </span>
          <span className={`${deliveryFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>

        {deliveryFee === 0 && (
          <div className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
            <FiTag className="mr-1" />
            You saved ₹50 on delivery!
          </div>
        )}

        <div className="border-t pt-2 flex justify-between text-base font-semibold">
          <span className="text-gray-900">Total Amount</span>
          <span className="text-green-600">₹{total.toLocaleString()}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <FiTruck className="text-blue-500 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-900 font-medium">Expected Delivery</p>
            <p className="text-blue-700">2-3 business days</p>
            <p className="text-blue-600 text-xs mt-1">
              Plants will be delivered fresh from our nursery
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 