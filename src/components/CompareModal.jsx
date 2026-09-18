import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare } from 'lucide-react';
import CompareTable from './comparison/CompareTable';

const CompareModal = ({ isOpen, onClose, devices }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-backdrop" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 1000 }}
        >
          <motion.div 
            className="filter-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '900px', 
              height: '90vh', 
              borderRadius: '2rem 2rem 0 0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="filter-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitCompare size={24} style={{ color: 'var(--accent-color)' }} />
                <span>Compare Devices</span>
              </h3>
              <button className="btn-icon" onClick={onClose} aria-label="Close comparison">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Comparison Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
              <CompareTable devices={devices} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default CompareModal;
