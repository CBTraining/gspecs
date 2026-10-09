import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, Scan, X } from 'lucide-react';

export default function BarcodeNotFoundModal({
  isOpen,
  scannedCode,
  onClose,
  onScanAgain
}) {
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="scanner-not-found-title"
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
                  <SearchX size={20} />
                </div>
                <h3 id="scanner-not-found-title" style={{ margin: 0, fontSize: '1.15rem' }}>
                  Device Not Found
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
                We scanned the barcode, but couldn't find a matching Chromebook or Googlebook in the catalog.
              </p>

              {scannedCode && (
                <div
                  style={{
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '0.75rem',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Scanned Value (SKU / UPC)
                  </span>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                      wordBreak: 'break-all'
                    }}
                  >
                    {scannedCode}
                  </span>
                </div>
              )}

              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Tip: Make sure the barcode belongs to a product carried in this store catalog, or verify the product tag.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.75rem',
                padding: '1rem 1.5rem',
                borderTop: '1px solid var(--border-color)'
              }}
            >
              <button className="btn-secondary" onClick={onClose} style={{ padding: '0.6rem 1.25rem' }}>
                Dismiss
              </button>
              <button
                className="btn-primary"
                onClick={onScanAgain}
                style={{ padding: '0.6rem 1.25rem', gap: '0.5rem' }}
              >
                <Scan size={18} />
                <span>Scan Again</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
