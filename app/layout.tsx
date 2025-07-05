import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../context/CartContext'
import { WishlistProvider } from '../context/WishlistContext'
import FloatingCartBar from '../components/FloatingCartBar'
import FloatingWishlistBar from '../components/FloatingWishlistBar'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bagicha - Fresh Gardening Delivered',
    template: '%s | Bagicha'
  },
  description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep. India\'s leading online garden store.',
  keywords: ['gardening', 'plants', 'garden tools', 'fertilizers', 'pots', 'online garden store', 'plant delivery', 'Bagicha'],
  authors: [{ name: 'Bagicha Team' }],
  creator: 'Bagicha',
  publisher: 'Bagicha',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    title: 'Bagicha - Fresh Gardening Delivered',
    description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep.',
    siteName: 'Bagicha',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bagicha - Fresh Gardening',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bagicha - Fresh Gardening Delivered',
    description: 'Get live plants, pots, soil, fertilizers, and gardening tools delivered to your doorstep.',
    images: ['/og-image.jpg'],
    creator: '@bagicha',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#22c55e',
  colorScheme: 'light',
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
        <meta name="application-name" content="Bagicha" />
        <meta name="theme-color" content="#22c55e" />
        <link rel="canonical" href={siteUrl} />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <WishlistProvider>
            <div className="min-h-screen bg-gray-50">
              <FloatingCartBar />
              <FloatingWishlistBar />
              {children}
            </div>
          </WishlistProvider>
        </CartProvider>
        <div id="footer-observer-anchor" style={{ width: '100%', height: '20px' }} />
      </body>
    </html>
  )
} 