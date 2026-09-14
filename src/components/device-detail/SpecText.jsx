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
      const tooltipWidth = Math.min(300, window.innerWidth - 32); 
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

  // Convert matchKey like "screen brightness" -> "Screen Brightness"
  const formattedTitle = matchKey
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

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
              backgroundColor: 'var(--surface-color)', 
              padding: '0.85rem 1rem', 
              borderRadius: '0.75rem', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)', 
              zIndex: 100,
              width: 'max-content', 
              maxWidth: 'min(300px, calc(100vw - 32px))',
              fontSize: '0.85rem', 
              color: 'var(--text-primary)',
              textAlign: 'left',
              lineHeight: 1.45
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '0.35rem', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
              {formattedTitle}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
              {GLOSSARY_MAP[matchKey]}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecText;
