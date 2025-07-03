'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useComponentConfig } from '@/lib/useComponentConfig';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  badge?: string;
}

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function WishlistButton({ product, className = '', size = 'md' }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist, wishlistCount } = useWishlist();
  const [showTooltip, setShowTooltip] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  
  // Load admin configuration
  const { config } = useComponentConfig('wishlist-button', {
    showTooltip: true,
    animateOnAdd: true,
    showCount: false,
    position: 'top-right'
  });
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
      
      // Animate on add if configured
      if (config.animateOnAdd) {
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 600);
      }
    }
  };

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const getPositionClasses = () => {
    switch (config.position) {
      case 'top-left': return 'top-2 left-2';
      case 'top-right': return 'top-2 right-2';
      case 'bottom-left': return 'bottom-2 left-2';
      case 'bottom-right': return 'bottom-2 right-2';
      default: return 'top-2 right-2';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleWishlistToggle}
        onMouseEnter={() => config.showTooltip && setShowTooltip(true)}
        onMouseLeave={() => config.showTooltip && setShowTooltip(false)}
        className={`
          absolute ${getPositionClasses()} z-10 
          ${sizeClasses[size]}
          bg-white bg-opacity-90 hover:bg-opacity-100
          rounded-full shadow-md hover:shadow-lg
          flex items-center justify-center
          transition-all duration-200
          ${justAdded ? 'scale-125' : ''}
          ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
          ${className}
        `}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className={`${iconSizes[size]} ${isWishlisted ? 'fill-current' : ''} transition-transform duration-200`} 
        />
        {config.showCount && wishlistCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {wishlistCount}
          </span>
        )}
      </button>
      
      {/* Tooltip */}
      {config.showTooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-20">
          {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </div>
  );
} 