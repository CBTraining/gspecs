import React, { useState, useEffect } from 'react';
import { Laptop, Smartphone } from 'lucide-react';

export const ImageWithFallback = ({ 
  src, 
  fallbackSrc,
  alt, 
  isLaptop = true, 
  size = 32, 
  className = '', 
  style = {},
  loading = 'lazy'
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setError(true);
    }
  };

  if (!currentSrc || error) {
    return isLaptop ? (
      <Laptop size={size} color="var(--text-secondary)" />
    ) : (
      <Smartphone size={size} color="var(--text-secondary)" />
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      decoding="async"
      className={className}
      onError={handleError}
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
