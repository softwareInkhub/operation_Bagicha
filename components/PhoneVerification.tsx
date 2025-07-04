'use client'

import { useState } from 'react'

interface PhoneVerificationProps {
  onVerified: (phone: string) => void
}

export default function PhoneVerification({ onVerified }: PhoneVerificationProps) {
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (phone.length === 10) {
      onVerified(`+91${phone}`)
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm mx-4">
      <h3 className="text-lg font-semibold mb-4">Phone Verification</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 rounded-l-md">
              +91
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="Enter 10-digit number"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              maxLength={10}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={phone.length !== 10}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Verify Phone
        </button>
      </form>
    </div>
  )
} 