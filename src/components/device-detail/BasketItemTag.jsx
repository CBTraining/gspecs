import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Sparkles, Users } from 'lucide-react';
import { getBasketItemInfo } from '../../data/basketContext';
import { TooltipContext } from './TooltipContext';

export const BasketItemTag = ({ item }) => {
  const { activeTooltipId, setActiveTooltipId } = useContext(TooltipContext);
  const tagId = useRef(Math.random().toString(36).substr(2, 9)).current;
  const show = activeTooltipId === tagId;
  const [xOffset, setXOffset] = useState('-50%');
  const spanRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handleDocumentClick = () => setActiveTooltipId(null);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [show, setActiveTooltipId]);

  if (!item) return null;

  const info = getBasketItemInfo(item);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!show && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      const tooltipWidth = Math.min(320, window.innerWidth - 32);
      const windowWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;

      let offsetPx = 0;
      if (centerX - tooltipWidth / 2 < 16) {
        offsetPx = 16 - (centerX - tooltipWidth / 2);
      } else if (centerX + tooltipWidth / 2 > windowWidth - 16) {
        offsetPx = (windowWidth - 16) - (centerX + tooltipWidth / 2);
      }
      setXOffset(`calc(-50% + ${offsetPx}px)`);
      setActiveTooltipId(tagId);
    } else {
      setActiveTooltipId(null);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        ref={spanRef}
        type="button"
        onClick={handleClick}
        style={{
          backgroundColor: show ? 'var(--surface-color)' : 'var(--surface-hover)',
          border: `1px solid ${show ? 'var(--accent-color)' : 'var(--border-color)'}`,
          borderRadius: '0.5rem',
          padding: '0.45rem 0.85rem',
          fontSize: '0.85rem',
          fontWeight: '500',
          color: 'var(--text-primary)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.45rem',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          outline: 'none',
          boxShadow: show ? 'var(--shadow-sm)' : 'none'
        }}
      >
        <span>{item}</span>
        <HelpCircle size={13} style={{ opacity: 0.6, color: 'var(--text-secondary)' }} />
      </button>

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 5, x: xOffset }}
            animate={{ opacity: 1, y: 0, x: xOffset }}
            exit={{ opacity: 0, y: 5, x: xOffset }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              bottom: '100%',
              left: '50%',
              marginBottom: '8px',
              backgroundColor: 'var(--surface-color)',
              padding: '0.9rem 1rem',
              borderRadius: '0.75rem',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              zIndex: 100,
              width: 'max-content',
              maxWidth: 'min(320px, calc(100vw - 32px))',
              fontSize: '0.825rem',
              color: 'var(--text-primary)',
              textAlign: 'left',
              lineHeight: 1.45
            }}
          >
            <div style={{ fontWeight: '700', marginBottom: '0.6rem', color: 'var(--accent-color)', fontSize: '0.875rem' }}>
              {item}
            </div>

            {info && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', marginBottom: '0.15rem' }}>
                    <Sparkles size={14} style={{ color: '#f59e0b' }} />
                    <span>Why it's great for the basket:</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {info.why}
                  </p>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.8rem', marginBottom: '0.15rem' }}>
                    <Users size={14} style={{ color: '#3b82f6' }} />
                    <span>Who looks for this:</span>
                  </div>
                  <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                    {info.customer}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BasketItemTag;
