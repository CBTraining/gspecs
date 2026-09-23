import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GLOSSARY_MAP, getGlossaryTitle } from '../../data/glossary';
import { TooltipContext } from './TooltipContext';

// Spec labels that describe generic categories rather than specific hardware technologies
const GENERIC_SPEC_LABELS = new Set([
  'processor',
  'storage',
  'build',
  'ports',
  'formfactor',
  'security',
  'weight',
  'keyboard',
  'camera'
]);

const sortedGlossaryKeys = Object.keys(GLOSSARY_MAP).sort((a, b) => b.length - a.length);

export const findGlossaryMatch = (text) => {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  // Don't match on long narrative text, paragraphs, or full sentences
  if (trimmed.length > 50 || (trimmed.includes('.') && trimmed.length > 35)) return null;

  const textLower = trimmed.toLowerCase();

  // 1. Exact match first
  if (GLOSSARY_MAP[textLower]) {
    return textLower;
  }

  // 2. Whole-word / phrase match against sorted glossary keys (longest phrase first)
  for (const key of sortedGlossaryKeys) {
    if (GENERIC_SPEC_LABELS.has(key)) {
      // Only match generic labels if the text itself represents that label (e.g. "Processor", "Ports", "RAM/Memory")
      const stripped = textLower.replace(/[^a-z0-9]/g, '');
      const keyStripped = key.replace(/[^a-z0-9]/g, '');
      if (stripped === keyStripped) {
        return key;
      }
      continue;
    }

    // For specific hardware components, features, and materials:
    // Match with strict word boundaries to prevent false positives like "ceramic" matching "ram"
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9])${escaped}([^a-zA-Z0-9]|$)`, 'i');
    if (regex.test(textLower)) {
      return key;
    }
  }

  return null;
};

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
  
  const matchKey = findGlossaryMatch(String(text));

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

  const formattedTitle = getGlossaryTitle(matchKey);

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
