import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Monitor, Cable, Layers, DollarSign, Weight, Clock, Laptop, Smartphone, ShieldCheck } from 'lucide-react';

const SPEC_ROWS = [
  { label: 'MSRP', key: 'MSRP', icon: DollarSign },
  { label: 'Processor', key: 'Processor', icon: Cpu },
  { label: 'NPU', key: 'NPU', icon: Cpu },
  { label: 'RAM / Memory', key: 'RAM/Memory', icon: Layers },
  { label: 'Storage', key: 'Storage', icon: Layers },
  { label: 'Screen Size', key: 'Screen Size', icon: Monitor },
  { label: 'Screen Type', key: 'Screen Type', icon: Monitor },
  { label: 'Resolution', key: 'Resolution', icon: Monitor },
  { label: 'Color Accuracy', key: 'Color Accuracy', icon: Monitor },
  { label: 'Aspect Ratio', key: 'Aspect Ratio', icon: Monitor },
  { label: 'Screen Brightness', key: 'Screen Brightness (nits)', icon: Monitor, suffix: ' nits' },
  { label: 'Touchscreen', key: 'Touchscreen?', icon: Monitor },
  { label: 'Pen Compatibility', key: 'Pen Compatibility?', icon: Monitor },
  { label: 'Battery Life', key: 'Battery Life', icon: Clock },
  { label: 'Weight', key: 'Weight', icon: Weight },
  { label: 'Form Factor', key: 'Formfactor', icon: Laptop },
  { label: 'Ports', key: 'Ports', icon: Cable },
  { label: 'Security', key: 'Security', icon: ShieldCheck },
  { label: 'Build', key: 'Build', icon: Layers },
  { label: 'USB-C Ports', key: 'USB-C', icon: Cable },
  { label: 'USB-A Ports', key: 'USB-A', icon: Cable },
  { label: 'HDMI', key: 'HDMI', icon: Cable },
  { label: 'Thunderbolt', key: 'Thunderbolt 4', icon: Cable }
];

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
            className="filter-modal" // Reusing styling classes
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
                <GitCompareIcon size={24} style={{ color: 'var(--accent-color)' }} />
                <span>Compare Devices</span>
              </h3>
              <button className="btn-icon" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Comparison Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
              <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left' }}>
                {/* Column Headers (Device Names and Images) */}
                <thead>
                  <tr>
                    <th style={{ 
                      padding: '1rem', 
                      width: '25%', 
                      borderBottom: '2px solid var(--border-color)',
                      color: 'var(--text-secondary)',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}>
                      Device Details
                    </th>
                    {devices.map(device => {
                      const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');
                      return (
                        <th 
                          key={device.SKU} 
                          style={{ 
                            padding: '1rem', 
                            width: `${75 / devices.length}%`, 
                            borderBottom: '2px solid var(--border-color)',
                            textAlign: 'center',
                            verticalAlign: 'top'
                          }}
                        >
                          <div style={{ 
                            width: '100%', 
                            height: '100px', 
                            backgroundColor: '#ffffff', // White BG for crisp image rendering
                            borderRadius: '0.75rem',
                            padding: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.75rem',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                          }}>
                            {device['Device Image'] ? (
                              <img 
                                src={device['Device Image']} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              isLaptop ? <Laptop size={32} color="var(--text-secondary)" /> : <Smartphone size={32} color="var(--text-secondary)" />
                            )}
                          </div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                            {device['Device Name']}
                          </h4>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                            {device.SKU}
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>

                {/* Rows of specs */}
                <tbody>
                  {SPEC_ROWS.map((row, idx) => {
                    const RowIcon = row.icon;
                    return (
                      <tr 
                        key={row.key} 
                        style={{ 
                          backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-hover)',
                          borderBottom: '1px solid var(--border-color)'
                        }}
                      >
                        <td style={{ 
                          padding: '0.85rem 1rem', 
                          fontWeight: '600', 
                          fontSize: '0.85rem', 
                          color: 'var(--text-primary)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}>
                          <RowIcon size={16} style={{ color: 'var(--text-secondary)' }} />
                          <span>{row.label}</span>
                        </td>
                        {devices.map(device => {
                          let val = device[row.key];
                          if (val && row.suffix && !String(val).endsWith(row.suffix)) {
                            val = `${val}${row.suffix}`;
                          }

                          const pillItems = typeof val === 'string' && !/^\$?\d{1,3}(,\d{3})+(\.\d+)?$/.test(val.trim()) && val.includes(',')
                            ? val.split(',').map(s => s.trim()).filter(Boolean)
                            : null;

                          return (
                            <td 
                              key={device.SKU} 
                              style={{ 
                                padding: '0.85rem 1rem', 
                                textAlign: 'center', 
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              {pillItems && pillItems.length > 1 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
                                  {pillItems.map((p, i) => (
                                    <span key={i} className="spec-pill" style={{ fontSize: '0.78rem', padding: '0.2rem 0.55rem' }}>
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                val || 'N/A'
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

// Help helper icon component
const GitCompareIcon = ({ size, style }) => (
  <svg width={size} height={size} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <path d="M13 6h3a2 2 0 0 1 2 2v7" />
    <path d="M11 18H8a2 2 0 0 1-2-2V9" />
  </svg>
);

export default CompareModal;
