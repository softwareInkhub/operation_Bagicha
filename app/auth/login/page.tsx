'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Phone, Shield, Check } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { setupRecaptcha, sendOTP, getCustomerByPhone, createCustomer } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState('phone') // 'phone' or 'otp'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [timer, setTimer] = useState(30)
  const [canResend, setCanResend] = useState(false)
  
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

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
      
      // Check if customer exists, if not, redirect to signup
      const formattedPhone = `+91${phoneNumber}`
      const existingCustomer = await getCustomerByPhone(formattedPhone)
      
      if (existingCustomer) {
        // Store customer info in localStorage for session management
        localStorage.setItem('currentCustomer', JSON.stringify(existingCustomer))
        router.push('/')
      } else {
        // Redirect to signup with verified phone
        router.push(`/auth/signup?phone=${encodeURIComponent(formattedPhone)}&verified=true`)
      }
      
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🌱</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your Bagicha account</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {step === 'phone' ? (
                <Phone className="text-green-500 text-2xl" />
              ) : (
                <Shield className="text-green-500 text-2xl" />
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
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:scale-100"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="flex justify-center"></div>
            </motion.div>
          )}

          {/* OTP Input */}
          {step === 'otp' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el }}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
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
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500 mr-2"></div>
                  <span className="text-gray-600">Verifying...</span>
                </div>
              )}

              {/* Resend OTP */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-gray-500 text-sm">
                    Resend OTP in {timer}s
                  </p>
                ) : (
                  <button
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                onClick={() => setStep('phone')}
                className="w-full text-gray-600 hover:text-gray-700 font-medium text-sm"
              >
                Change phone number
              </button>
            </motion.div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="text-green-600 hover:text-green-700 font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
        >
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Check className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Secure Login</h3>
            <p className="text-xs text-gray-600 mt-1">OTP-based secure authentication</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Phone className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Quick Access</h3>
            <p className="text-xs text-gray-600 mt-1">Login with just your phone number</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Shield className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-900">Privacy Protected</h3>
            <p className="text-xs text-gray-600 mt-1">Your data is safe and encrypted</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
} 