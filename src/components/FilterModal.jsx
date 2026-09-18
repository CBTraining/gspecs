import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FILTER_CATEGORIES, parsePrice } from '../data/filterCategories';

const FilterModal = ({ isOpen, onClose, devices, activeFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(activeFilters || {});

  // Extract catalog price limits dynamically
  const prices = devices.map(d => parsePrice(d.MSRP)).filter(p => p > 0);
  const catalogMinPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const catalogMaxPrice = prices.length > 0 ? Math.max(...prices) : 2000;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setLocalFilters(activeFilters || {});
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, activeFilters]);

  // Extract unique values for each category
  const filterOptions = FILTER_CATEGORIES.reduce((acc, cat) => {
    let uniqueVals = [...new Set(devices.map(d => d[cat.key]).filter(v => v && v.toLowerCase() !== 'none'))];
    if (cat.key === 'Device') {
      const normalizedSet = new Set();
      uniqueVals.forEach(v => {
        const norm = v.trim().replace(/s$/, '');
        if (norm.toLowerCase() === 'chromerbook' || norm.toLowerCase() === 'chromebook') normalizedSet.add('Chromebook');
        else if (norm.toLowerCase() === 'gragglebook' || norm.toLowerCase() === 'googlebook') normalizedSet.add('Googlebook');
        else normalizedSet.add(v.trim());
      });
      uniqueVals = [...normalizedSet];
    }
    acc[cat.key] = uniqueVals.sort();
    return acc;
  }, {});

  const toggleFilter = (categoryKey, value) => {
    setLocalFilters(prev => {
      const current = prev[categoryKey] || [];
      if (categoryKey === 'Device') {
        const targetNorm = value.toLowerCase().replace(/s$/, '');
        const exists = current.some(s => s.toLowerCase().replace(/s$/, '') === targetNorm);
        let updated;
        if (exists) {
          updated = current.filter(s => s.toLowerCase().replace(/s$/, '') !== targetNorm);
        } else {
          updated = [...current, value];
        }
        return { ...prev, [categoryKey]: updated };
      }
      if (current.includes(value)) {
        return { ...prev, [categoryKey]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [categoryKey]: [...current, value] };
      }
    });
  };

  const handleApply = () => {
    // clean up empty arrays (except priceRange)
    const cleanedFilters = Object.fromEntries(
      Object.entries(localFilters).filter(([key, vals]) => {
        if (key === 'priceRange') {
          // Keep price range if it restricts the catalog max price
          return vals[1] < catalogMaxPrice;
        }
        return vals.length > 0;
      })
    );
    onApply(cleanedFilters);
    onClose();
  };

  const handleClear = () => {
    setLocalFilters({});
    onApply({});
    onClose();
  };

  const priceRange = localFilters.priceRange || [catalogMinPrice, catalogMaxPrice];

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
              {/* MSRP Range Slider */}
              {prices.length > 0 && (
                <div className="filter-section" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
                  <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Budget Limit</span>
                    <span style={{ color: 'var(--accent-color)', fontWeight: '700' }}>Under ${priceRange[1]}</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                    <input 
                      type="range" 
                      min={catalogMinPrice} 
                      max={catalogMaxPrice} 
                      step={50}
                      value={priceRange[1]} 
                      onChange={(e) => {
                        const maxVal = Number(e.target.value);
                        setLocalFilters(prev => ({
                          ...prev,
                          priceRange: [catalogMinPrice, maxVal]
                        }));
                      }}
                      style={{
                        width: '100%',
                        accentColor: 'var(--accent-color)',
                        height: '6px',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      <span>Min: ${catalogMinPrice}</span>
                      <span>Max: ${catalogMaxPrice}</span>
                    </div>
                  </div>
                </div>
              )}

              {FILTER_CATEGORIES.map(cat => {
                if (!filterOptions[cat.key] || filterOptions[cat.key].length === 0) return null;

                return (
                  <div key={cat.key} className="filter-section">
                    <h4>{cat.label}</h4>
                    <div className="filter-pills-container">
                      {filterOptions[cat.key].map(val => {
                        const selected = localFilters[cat.key] || [];
                        let isActive = selected.includes(val);
                        if (cat.key === 'Device') {
                          const targetNorm = val.toLowerCase().replace(/s$/, '');
                          isActive = selected.some(s => s.toLowerCase().replace(/s$/, '') === targetNorm);
                        }
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
