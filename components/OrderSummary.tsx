'use client'

import { useCart } from '@/context/CartContext'

export default function OrderSummary() {
  const { cart: cartItems } = useCart()

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.qty), 0)
  }

  const subtotal = getSubtotal()
  const deliveryFee = subtotal >= 500 ? 0 : 50
  const total = subtotal + deliveryFee

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      {/* Cart Items */}
      <div className="space-y-3 mb-4">
        {cartItems.map((item) => (
          <div key={item.name} className="flex items-center space-x-3">
            <img 
              src={item.image} 
              alt={item.name}
              className="w-12 h-12 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-gray-900">{item.name}</h4>
              <p className="text-xs text-gray-500">Qty: {item.qty}</p>
            </div>
            <span className="text-sm font-medium text-gray-900">
              ₹{(item.price * item.qty).toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      {/* Price Breakdown */}
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
          <span className="text-gray-900">₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="text-gray-900">
            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
          </span>
        </div>
        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
          <span>Total</span>
          <span className="text-green-600">₹{total.toLocaleString()}</span>
        </div>
      </div>

      {subtotal < 500 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            Add ₹{(500 - subtotal).toLocaleString()} more for FREE delivery!
          </p>
        </div>
      )}
    </div>
  )
} 