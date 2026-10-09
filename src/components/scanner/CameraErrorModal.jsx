import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function CameraErrorModal({ isOpen, error, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
          <motion.div
            className="filter-modal scanner-dialog-modal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="camera-error-title"
          >
            <div className="filter-header" style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(239, 68, 68, 0.12)',
                    color: '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  <AlertCircle size={20} />
                </div>
                <h3 id="camera-error-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                  Camera Access Required
                </h3>
              </div>
              <button
                className="btn-icon"
                onClick={onClose}
                aria-label="Close dialog"
                style={{ padding: '0.35rem' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="filter-body" style={{ padding: '1.5rem', gap: '1rem' }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {error || 'Unable to access your device camera for barcode scanning.'}
              </p>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Please ensure you have granted camera permissions to this site in your browser settings and that no other application is using the camera.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <button className="btn-primary" onClick={onClose} style={{ padding: '0.6rem 1.5rem' }}>
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
