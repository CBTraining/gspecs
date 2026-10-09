import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

export default function UpdateNotification({ show, isUpdating }) {
  return (
    <AnimatePresence>
      {(show || isUpdating) && (
        <div
          style={{
            position: 'fixed',
            top: '1rem',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            pointerEvents: 'none',
            padding: '0 1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.95 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              width: '100%',
              maxWidth: '440px',
              pointerEvents: 'auto'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.15rem',
                background: 'var(--surface-color)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid var(--accent-color)',
                borderRadius: '1rem',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 0 15px rgba(49, 132, 254, 0.25)',
                color: 'var(--text-primary)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(49, 132, 254, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-color)',
                  flexShrink: 0
                }}
              >
                <RefreshCw
                  size={18}
                  style={{
                    animation: 'spin 1.2s linear infinite'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '0.925rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Updating to latest version...
                </span>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>
                  Loading the newest catalog and features
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
