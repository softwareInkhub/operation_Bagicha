'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { setupRecaptcha, sendOTP } from '@/lib/firebase'
import { FiPhone, FiShield } from 'react-icons/fi'

interface PhoneVerificationProps {
  onVerified: (phoneNumber: string) => void
}

export default function PhoneVerification({ onVerified }: PhoneVerificationProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const recaptchaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, timer])

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[6-9]\d{9}$/
    return phoneRegex.test(phone)
  }

  const handleSendOTP = async () => {
    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Format phone number for India
      const formattedPhone = `+91${phoneNumber}`
      
      // Setup reCAPTCHA verifier
      const recaptchaVerifier = setupRecaptcha('recaptcha-container')
      
      // Send OTP via Firebase
      const result = await sendOTP(formattedPhone, recaptchaVerifier)
      
      setConfirmationResult(result)
      setStep('otp')
      setTimer(30)
      setCanResend(false)
      
    } catch (error: any) {
      console.error('Error sending OTP:', error)
      let errorMessage = 'Failed to send OTP. Please try again.'
      
      if (error.code === 'auth/billing-not-enabled') {
        errorMessage = 'SMS service not enabled. Please contact support.'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.'
      } else if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format.'
      }
      
      setError(errorMessage)
      
      // Cleanup reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.innerHTML = ''
      }
    } finally {
      setLoading(false)
    }
  }

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      verifyOTP(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const verifyOTP = async (otpCode: string) => {
    if (!confirmationResult) return

    setLoading(true)
    setError('')

    try {
      await confirmationResult.confirm(otpCode)
      onVerified(`+91${phoneNumber}`)
    } catch (error: any) {
      console.error('Error verifying OTP:', error)
      setError('Invalid OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = () => {
    setOtp(['', '', '', '', '', ''])
    setTimer(30)
    setCanResend(false)
    handleSendOTP()
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {step === 'phone' ? (
              <FiPhone className="text-green-500 text-2xl" />
            ) : (
              <FiShield className="text-green-500 text-2xl" />
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Enter your mobile number' : 'Verify OTP'}
          </h2>
          <p className="text-gray-600 text-sm">
            {step === 'phone' 
              ? 'We\'ll send you a verification code via SMS' 
              : `We've sent a 6-digit code to +91 ${phoneNumber}`
            }
          </p>
        </div>

        {/* Phone Number Input */}
        {step === 'phone' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <div className="flex">
                <div className="flex items-center px-3 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">
                  <span className="text-gray-600 font-medium">🇮🇳 +91</span>
                </div>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                    setPhoneNumber(value)
                    setError('')
                  }}
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm"
              >
                {error}
              </motion.p>
            )}

            <button
              onClick={handleSendOTP}
              disabled={loading || phoneNumber.length !== 10}
              className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>


          </motion.div>
        )}

        {/* OTP Input */}
        {step === 'otp' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpRefs.current[index] = el }}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none"
                  maxLength={1}
                />
              ))}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {loading && (
              <div className="flex items-center justify-center text-green-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                Verifying...
              </div>
            )}



            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  className="text-green-500 font-medium hover:text-green-600"
                >
                  Resend OTP
                </button>
              ) : (
                <p className="text-gray-500 text-sm">
                  Resend OTP in {timer}s
                </p>
              )}
            </div>

            <button
              onClick={() => setStep('phone')}
              className="w-full text-gray-600 py-2"
            >
              ← Change Number
            </button>
          </motion.div>
        )}

        {/* reCAPTCHA container */}
        <div ref={recaptchaRef} id="recaptcha-container" className="mt-4"></div>
      </div>
    </div>
  )
} 