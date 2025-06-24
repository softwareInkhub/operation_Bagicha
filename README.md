# Bagicha - Fresh Groceries Delivered

A modern, mobile-first Next.js website for Bagicha, a grocery delivery service similar to Blinkit. Built with TypeScript, Tailwind CSS, and Framer Motion for smooth animations.

## 🚀 Features

- **Mobile-First Design**: Optimized for all mobile devices
- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **PWA Ready**: Progressive Web App capabilities
- **Fast Performance**: Optimized for speed and user experience
- **Search Functionality**: Advanced search with recent and trending searches
- **Product Catalog**: Featured products with categories and offers
- **Interactive Elements**: Hover effects, animations, and micro-interactions

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📱 Mobile Features

- Bottom navigation for easy access
- Touch-friendly interface
- Swipe gestures support
- Mobile-optimized search modal
- Responsive product grid
- Mobile-first design patterns

## 🎨 Design System

### Colors
- **Primary**: Green (#22c55e) - Fresh and natural
- **Secondary**: Yellow (#eab308) - Warm and inviting
- **Accent**: Pink (#ec4899) - Modern and vibrant

### Typography
- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700

### Components
- Header with search and navigation
- Hero section with call-to-action
- Category cards with icons
- Product cards with ratings
- Offer banners with gradients
- Footer with links and contact info
- Bottom navigation (mobile)
- Search modal with suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bagicha-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
bagicha-website/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── Header.tsx           # Navigation header
│   ├── Hero.tsx             # Hero section
│   ├── Categories.tsx       # Product categories
│   ├── FeaturedProducts.tsx # Product grid
│   ├── Offers.tsx           # Promotional offers
│   ├── Footer.tsx           # Site footer
│   ├── BottomNavigation.tsx # Mobile navigation
│   └── SearchModal.tsx      # Search functionality
├── public/
│   └── manifest.json        # PWA manifest
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🎯 Key Features

### 1. Hero Section
- Compelling headline and value proposition
- Call-to-action buttons
- Animated floating elements
- Trust indicators

### 2. Categories
- Horizontal scrollable category cards
- Color-coded icons
- Smooth animations

### 3. Featured Products
- Product cards with images, prices, and ratings
- Add to cart functionality
- Favorite/wishlist feature
- Discount badges

### 4. Offers Section
- Gradient banner cards
- Time-limited offers
- Referral program promotion

### 5. Search Modal
- Full-screen search experience
- Recent searches
- Trending searches
- Smooth animations

### 6. Mobile Navigation
- Bottom navigation bar
- Active state indicators
- Touch-friendly design

## 📱 Mobile Optimization

- **Viewport**: Optimized for mobile screens
- **Touch Targets**: Minimum 44px touch targets
- **Gestures**: Support for swipe and tap gestures
- **Performance**: Optimized images and animations
- **PWA**: Installable as a mobile app

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  primary: {
    500: '#22c55e', // Main brand color
    // ... other shades
  }
}
```

### Components
All components are modular and can be easily customized:
- Modify component props for different content
- Update styling classes for different themes
- Add new animations with Framer Motion

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### Other Platforms
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email support@bagicha.com or create an issue in the repository.

---

**Built with ❤️ for fresh grocery delivery** 