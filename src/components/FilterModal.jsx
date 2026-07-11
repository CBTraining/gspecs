import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const FILTER_CATEGORIES = [
  { key: 'OEM (brand)', label: 'Brand' },
  { key: 'Formfactor', label: 'Form Factor' },
  { key: 'Screen Size', label: 'Screen Size' },
  { key: 'Storage', label: 'Storage' },
  { key: 'RAM/Memory', label: 'RAM' },
  { key: 'Touchscreen?', label: 'Touchscreen' },
  { key: 'Pen Compatibility?', label: 'Pen Compatible' }
];

const FilterModal = ({ isOpen, onClose, devices, activeFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(activeFilters || {});

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

  // Extract unique values for each category
  const filterOptions = FILTER_CATEGORIES.reduce((acc, cat) => {
    const uniqueVals = [...new Set(devices.map(d => d[cat.key]).filter(v => v && v.toLowerCase() !== 'none'))];
    acc[cat.key] = uniqueVals.sort();
    return acc;
  }, {});

  const toggleFilter = (categoryKey, value) => {
    setLocalFilters(prev => {
      const current = prev[categoryKey] || [];
      if (current.includes(value)) {
        return { ...prev, [categoryKey]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [categoryKey]: [...current, value] };
      }
    });
  };

  const handleApply = () => {
    // clean up empty arrays
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([_, vals]) => vals.length > 0)
    );
    onApply(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onApply({});
    onClose();
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-backdrop" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="filter-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
          >
            <div className="filter-header">
              <h3>Filters</h3>
              <button className="btn-icon" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            
            <div className="filter-body">
              {FILTER_CATEGORIES.map(cat => {
                if (!filterOptions[cat.key] || filterOptions[cat.key].length === 0) return null;

                return (
                  <div key={cat.key} className="filter-section">
                    <h4>{cat.label}</h4>
                    <div className="filter-pills-container">
                      {filterOptions[cat.key].map(val => {
                        const isActive = localFilters[cat.key]?.includes(val);
                        return (
                          <button
                            key={val}
                            className={`filter-pill ${isActive ? 'active' : ''}`}
                            onClick={() => toggleFilter(cat.key, val)}
                          >
                            {val}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="filter-footer">
              <button className="btn-secondary" onClick={handleClear}>Clear All</button>
              <button className="btn-primary" onClick={handleApply}>Show Results</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default FilterModal;
