import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackExitToast({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.25rem', // Sits comfortably above the bottom navigation bar
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99999,
            pointerEvents: 'none',
            padding: '0 1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.94 }}
            transition={{ duration: 0.18, ease: [0.25, 1, 0.5, 1] }}
            style={{
              backgroundColor: 'rgba(28, 28, 30, 0.92)',
              color: '#ffffff',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '0.6rem 1.25rem',
              borderRadius: '9999px',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              letterSpacing: '0.01em',
              fontFamily: 'inherit'
            }}
          >
            <span>Press back again to exit</span>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
