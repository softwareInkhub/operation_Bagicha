import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-gradient-to-br from-green-50 via-white to-green-100 text-center px-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-8 h-8 text-green-500 animate-bounce" />
        <h1 className="text-5xl font-extrabold text-green-700">404</h1>
        <Sparkles className="w-8 h-8 text-green-500 animate-bounce" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold mb-2 text-green-800">Oops! Page Not Found</h2>
      <p className="mb-6 text-gray-600 max-w-md mx-auto">
        The page you are looking for might have been pruned, never planted, or is taking root elsewhere.<br />
        Let's get you back to the garden!
      </p>
      <Link href="/">
        <span className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow transition-colors">Back to Home</span>
      </Link>
    </div>
  )
} 