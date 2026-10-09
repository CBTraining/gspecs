import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, X } from 'lucide-react';

export default function ScanningIndicator({ isScanning, onCancel }) {
  return (
    <AnimatePresence>
      {isScanning && (
        <div className="scanning-indicator-toast-wrapper">
          <motion.div
            className="scanning-indicator-toast"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
            role="status"
            aria-live="polite"
          >
            <div className="scanning-indicator-card">
              {/* Animated Scanner Graphic with sweeping laser beam */}
              <div className="scanner-animated-icon" aria-hidden="true">
                <Scan size={26} className="scanner-frame-icon" />
                <div className="scanner-laser-line" />
              </div>

              <div className="scanner-text-container">
                <div className="scanner-title">
                  <span>Scanning</span>
                  <span className="scanner-dots">
                    <span className="dot dot-1">.</span>
                    <span className="dot dot-2">.</span>
                    <span className="dot dot-3">.</span>
                  </span>
                </div>
                <div className="scanner-subtitle">
                  Point rear camera at a barcode
                </div>
              </div>

              <button
                className="scanner-cancel-btn"
                onClick={onCancel}
                aria-label="Cancel barcode scan"
                title="Stop scanning"
              >
                <X size={18} />
                <span>Cancel</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
