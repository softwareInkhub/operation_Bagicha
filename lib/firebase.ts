import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, connectAuthEmulator } from 'firebase/auth'

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

export default app 