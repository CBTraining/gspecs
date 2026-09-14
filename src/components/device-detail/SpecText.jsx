import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOSSARY_MAP } from '../../data/glossary';
import { TooltipContext } from './TooltipContext';

export const SpecText = ({ text }) => {
  const { activeTooltipId, setActiveTooltipId } = useContext(TooltipContext);
  const tooltipId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const show = activeTooltipId === tooltipId;
  const [xOffset, setXOffset] = useState('-50%');
  const spanRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handleDocumentClick = () => setActiveTooltipId(null);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [show, setActiveTooltipId]);
  
  if (!text) return null;
  
  const textStr = String(text).toLowerCase();
  const matchKey = Object.keys(GLOSSARY_MAP)
    .sort((a, b) => b.length - a.length)
    .find(key => textStr.includes(key));

  if (!matchKey) return <span>{text}</span>;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!show && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      const tooltipWidth = 250; 
      const windowWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      
      let offsetPx = 0;
      if (centerX - tooltipWidth / 2 < 16) {
        offsetPx = 16 - (centerX - tooltipWidth / 2);
      } else if (centerX + tooltipWidth / 2 > windowWidth - 16) {
        offsetPx = (windowWidth - 16) - (centerX + tooltipWidth / 2);
      }
      setXOffset(`calc(-50% + ${offsetPx}px)`);
      setActiveTooltipId(tooltipId);
    } else {
      setActiveTooltipId(null);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span 
        ref={spanRef}
        onClick={handleClick}
        style={{ 
          borderBottom: '1px dotted var(--text-secondary)', 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {text}
      </span>
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5, x: xOffset }}
            animate={{ opacity: 1, y: 0, x: xOffset }}
            exit={{ opacity: 0, y: 5, x: xOffset }}
            style={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: '50%', 
              marginBottom: '8px',
              backgroundColor: 'var(--surface-hover)', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)', 
              zIndex: 50,
              width: 'max-content', 
              maxWidth: '250px',
              fontSize: '0.85rem', 
              color: 'var(--text-primary)',
              textAlign: 'left',
              lineHeight: 1.4
            }}
          >
            <strong>{matchKey.toUpperCase()}</strong>: {GLOSSARY_MAP[matchKey]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecText;
