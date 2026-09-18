import React, { memo, useRef, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import ImageWithFallback from './common/ImageWithFallback';
import { getPersonaColor } from '../utils/persona';

export const DeviceCard = memo(({ 
  device, 
  brand, 
  isLaptop, 
  isSelectedForCompare, 
  onSelectDevice, 
  onToggleComparison 
}) => {
  const rafRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const target = e.currentTarget;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafRef.current) return;

    rafRef.current = requestAnimationFrame(() => {
      if (target) {
        const rect = target.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        target.style.setProperty('--mouse-x', `${x}px`);
        target.style.setProperty('--mouse-y', `${y}px`);
      }
      rafRef.current = null;
    });
  }, []);

  const personaTags = useMemo(() => {
    return device.Persona ? device.Persona.split(',').map(p => p.trim()).filter(Boolean) : [];
  }, [device.Persona]);

  return (
    <motion.div 
      className="card-wrapper"
      onClick={() => onSelectDevice(device)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="card-glow-mask">
        <div className="card-glow-spinner"></div>
      </div>
      <div 
        className="card"
        onMouseMove={handleMouseMove}
      >
        <div className="card-spotlight"></div>
        
        {/* Compare Checkbox */}
        {onToggleComparison && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleComparison(device);
            }}
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
              zIndex: 10,
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              border: `2px solid ${isSelectedForCompare ? 'var(--accent-color)' : '#e5e7eb'}`,
              backgroundColor: isSelectedForCompare ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              padding: 0,
              outline: 'none',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            aria-label="Compare device"
          >
            {isSelectedForCompare && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 4L3.5 6L8.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        )}

        <div className="device-card-content-vertical">
          <div className="device-card-image-large">
            <ImageWithFallback 
              src={device['Device Image']} 
              alt={device['Device Name']} 
              isLaptop={isLaptop} 
              size={32} 
            />
          </div>
          <div className="device-card-info-vertical">
            <div className="device-brand-text">{device.Formfactor || brand}</div>
            <h3 className="device-title-text">
              {device['Device Name']}
            </h3>
            <div className="device-sku-text">SKU: {device.SKU || 'N/A'}</div>
            {personaTags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.2rem' }}>
                {personaTags.map((p, i) => (
                  <span key={i} className="persona-tag" style={{ backgroundColor: getPersonaColor(p) }}>
                    {p}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default DeviceCard;
