import React, { useState } from 'react';
import { Laptop, Smartphone } from 'lucide-react';

export const ImageWithFallback = ({ 
  src, 
  alt, 
  isLaptop = true, 
  size = 32, 
  className = '', 
  style = {} 
}) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return isLaptop ? (
      <Laptop size={size} color="var(--text-secondary)" />
    ) : (
      <Smartphone size={size} color="var(--text-secondary)" />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        borderRadius: 'inherit',
        ...style
      }}
    />
  );
};

export default ImageWithFallback;
