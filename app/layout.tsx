import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'Bagicha - Fresh Gardening Delivered',
  description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep.',
  keywords: 'grocery delivery, fresh vegetables, fruits, household essentials, online grocery, Bagicha',
  authors: [{ name: 'Bagicha Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Bagicha - Fresh Gardening Delivered',
    description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep.',
    url: 'http://localhost:3000',
    siteName: 'Bagicha',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bagicha - Fresh Gardening',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagicha - Fresh Gardening Delivered',
    description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep.',
    images: ['/og-image.jpg'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4CAF50',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bagicha" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  )
} 