'use client';

import { Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

interface Product {
  id: number;
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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const isWishlisted = isInWishlist(product.id);
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
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

  return (
    <button
      onClick={handleWishlistToggle}
      className={`
        absolute top-2 right-2 z-10 
        ${sizeClasses[size]}
        bg-white bg-opacity-90 hover:bg-opacity-100
        rounded-full shadow-md hover:shadow-lg
        flex items-center justify-center
        transition-all duration-200
        ${isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}
        ${className}
      `}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`${iconSizes[size]} ${isWishlisted ? 'fill-current' : ''}`} 
      />
    </button>
  );
} 