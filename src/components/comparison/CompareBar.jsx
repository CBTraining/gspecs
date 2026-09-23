import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Smartphone, X, Trash2, GitCompare } from 'lucide-react';
import { isLaptopDevice } from '../../utils/deviceUtils';

const CompareBar = ({
  comparisonDevices = [],
  onToggleComparison,
  onClear,
  onCompare
}) => {
  return (
    <motion.div
      className="compare-bar"
      initial={{ y: 100, x: '-50%', opacity: 0 }}
      animate={{ y: 0, x: '-50%', opacity: 1 }}
      exit={{ y: 100, x: '-50%', opacity: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
    >
      {/* Thumbnails list */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        {comparisonDevices.map(device => {
          const isLaptop = isLaptopDevice(device);
          return (
            <div 
              key={device.SKU} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '1.5rem',
                padding: '0.25rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: '500'
              }}
            >
              <div style={{ width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {device['Device Image'] ? (
                  <img 
                    src={device['Device Image']} 
                    alt="" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  isLaptop ? <Laptop size={14} /> : <Smartphone size={14} />
                )}
              </div>
              <span style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {device['Device Name']}
              </span>
              <button 
                onClick={() => onToggleComparison(device)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  padding: 0, 
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label="Remove from compare"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button 
          onClick={onClear}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem' }}
        >
          <Trash2 size={14} />
          <span>Clear</span>
        </button>
        <button 
          onClick={onCompare}
          className="btn-primary"
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem' }}
          disabled={comparisonDevices.length < 2}
        >
          <GitCompare size={14} />
          <span>Compare ({comparisonDevices.length})</span>
        </button>
      </div>
    </motion.div>
  );
};

export default CompareBar;
