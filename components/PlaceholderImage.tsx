import React from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  text?: string;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ 
  width, 
  height, 
  text = 'No Image', 
  className = '' 
}) => {
  const svgContent = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <rect width="100%" height="100%" fill="url(#pattern)" opacity="0.1"/>
      <defs>
        <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="1" fill="#d1d5db"/>
        </pattern>
      </defs>
      <text x="50%" y="50%" text-anchor="middle" dy="0.35em" 
            font-family="system-ui, -apple-system, sans-serif" 
            font-size="${Math.min(width, height) * 0.15}" 
            fill="#6b7280" 
            font-weight="500">
        ${text}
      </text>
    </svg>
  `;

  const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;

  return (
    <img 
      src={dataUrl} 
      alt={text}
      width={width}
      height={height}
      className={className}
    />
  );
};

export default PlaceholderImage; 