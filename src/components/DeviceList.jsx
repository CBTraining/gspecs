import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Filter, Search } from 'lucide-react';
import FilterModal from './FilterModal';
import { getPersonaColor } from '../utils/persona';

const ImageWithFallback = ({ src, alt, isLaptop, sku }) => {
  const [error, setError] = React.useState(false);

  if (!src || error) {
    return isLaptop ? <Laptop size={32} color="var(--text-secondary)" /> : <Smartphone size={32} color="var(--text-secondary)" />;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      onError={() => setError(true)}
      style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 'inherit' }} 
    />
  );
};

const DeviceList = ({ devices, onSelectDevice, comparisonDevices = [], onToggleComparison, onOpenQuiz }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('gspecs_activeFilters');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('gspecs_activeFilters', JSON.stringify(activeFilters));
  }, [activeFilters]);

  // Determine current active Device Type toggle ('All', 'Googlebook', 'Chromebook')
  const currentDeviceType = useMemo(() => {
    const devFilter = activeFilters.Device || [];
    if (devFilter.length === 1) {
      const val = devFilter[0].toLowerCase();
      if (val.includes('google') || val.includes('graggle')) return 'Googlebook';
      if (val.includes('chrome') || val.includes('chromer')) return 'Chromebook';
    }
    return 'All';
  }, [activeFilters]);

  const handleSelectDeviceType = (type) => {
    setActiveFilters(prev => {
      const next = { ...prev };
      if (type === 'All') {
        delete next.Device;
      } else if (type === 'Googlebook') {
        next.Device = ['Googlebook'];
      } else if (type === 'Chromebook') {
        next.Device = ['Chromebook'];
      }
      return next;
    });
  };

  // Filter devices based on activeFilters and searchQuery
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      // 1. Search Query Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const nameMatch = device['Device Name']?.toLowerCase()?.includes(query);
        const skuMatch = device.SKU?.toLowerCase()?.includes(query);
        const processorMatch = device.Processor?.toLowerCase()?.includes(query);
        const brandMatch = device['OEM (brand)']?.toLowerCase()?.includes(query);
        const personaMatch = device.Persona?.toLowerCase()?.includes(query);
        
        if (!nameMatch && !skuMatch && !processorMatch && !brandMatch && !personaMatch) {
          return false;
        }
      }

      // 2. Active Category Filters
      for (const [key, selectedValues] of Object.entries(activeFilters)) {
        if (key === 'priceRange') {
          const price = Number(device.MSRP?.replace(/[^0-9.]/g, '') || 0);
          if (price < selectedValues[0] || price > selectedValues[1]) {
            return false;
          }
          continue;
        }
        if (!selectedValues || selectedValues.length === 0) continue;

        if (key === 'Device') {
          const deviceVal = (device.Device || '').toLowerCase().replace(/s$/, '');
          const matches = selectedValues.some(val => {
            const v = val.toLowerCase().replace(/s$/, '');
            if (v.includes('google') && (deviceVal.includes('google') || deviceVal.includes('graggle'))) return true;
            if (v.includes('chrome') && (deviceVal.includes('chrome') || deviceVal.includes('chromer'))) return true;
            return deviceVal.includes(v) || v.includes(deviceVal);
          });
          if (!matches) return false;
          continue;
        }

        if (!selectedValues.includes(device[key])) {
          return false;
        }
      }
      return true;
    });
  }, [devices, activeFilters, searchQuery]);

  // Group filtered devices by OEM and extract brands, memoized
  const { groupedDevices, brands } = useMemo(() => {
    const grouped = filteredDevices.reduce((acc, device) => {
      const brand = device['OEM (brand)'] || 'Other';
      if (!acc[brand]) acc[brand] = [];
      acc[brand].push(device);
      return acc;
    }, {});
    
    return {
      groupedDevices: grouped,
      brands: Object.keys(grouped).sort()
    };
  }, [filteredDevices]);
  
  const totalActiveFilters = useMemo(() => 
    Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0),
  [activeFilters]);

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', marginTop: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Devices ({filteredDevices.length})</h2>
        
        {/* Device Type Toggle Pills */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: 'var(--surface-color)',
            border: '1px solid var(--border-color)',
            padding: '3px',
            borderRadius: '2rem',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          {['All', 'Googlebook', 'Chromebook'].map((type) => {
            const isActive = currentDeviceType === type;
            return (
              <button
                key={type}
                onClick={() => handleSelectDeviceType(type)}
                style={{
                  border: 'none',
                  backgroundColor: isActive ? 'var(--accent-color)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  padding: '0.4rem 1rem',
                  borderRadius: '1.5rem',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none'
                }}
              >
                {type}
              </button>
            );
          })}
        </div>

        <button 
          className="btn-secondary" 
          onClick={() => setIsFilterOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', position: 'relative' }}
        >
          <Filter size={18} />
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              width: '14px',
              height: '14px',
              backgroundColor: 'var(--accent-color)',
              border: '2px solid var(--bg-color)',
              borderRadius: '50%'
            }} />
          )}
        </button>
      </div>

      {/* Search Input Bar */}
      <div 
        style={{
          position: 'relative',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          maxWidth: '500px'
        }}
      >
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }} 
        />
        <input
          type="text"
          placeholder="Search devices by name, SKU, or specs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem 0.65rem 2.5rem',
            borderRadius: '1.5rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)',
            fontSize: '0.9rem',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease'
          }}
          className="search-input"
        />
      </div>

      {/* Quiz Prompt Banner */}
      {onOpenQuiz && (
        <div className="quiz-banner">
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ fontSize: '1.75rem' }}>✨</span>
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                Find Your Googlebook
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Answer 3 quick questions to discover the perfect model matching your budget & needs.
              </p>
            </div>
          </div>
          <button 
            className="btn-primary" 
            onClick={onOpenQuiz}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem',
              borderRadius: '1rem',
              whiteSpace: 'nowrap'
            }}
          >
            <span>Take Quiz</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      )}

      {brands.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>No devices found matching your filters.</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '1rem', margin: '0 auto' }} 
            onClick={() => {
              setActiveFilters({});
              setSearchQuery('');
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        brands.map(brand => (
          <div key={brand} style={{ marginBottom: '2.5rem' }}>
            <h2 className="section-title">{brand}</h2>
            <motion.div 
              className="device-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {groupedDevices[brand].map((device, index) => {
                const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');

                return (
                  <motion.div 
                    key={device.SKU || index} 
                    className="card-wrapper"
                    onClick={() => onSelectDevice(device)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layoutId={`wrapper-${device.SKU}`}
                  >
                    <div className="card-glow-mask">
                      <div className="card-glow-spinner"></div>
                    </div>
                    <div 
                      className="card" 
                      layoutId={`card-${device.SKU}`}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                      }}
                    >
                      <div className="card-spotlight"></div>
                      
                      {/* Compare Checkbox */}
                      {onToggleComparison && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleComparison(device);
                          }}
                          style={{
                            position: 'absolute',
                            bottom: '0.75rem',
                            right: '0.75rem',
                            zIndex: 10,
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            border: `2px solid ${comparisonDevices.some(d => d.SKU === device.SKU) ? 'var(--accent-color)' : '#e5e7eb'}`,
                            backgroundColor: comparisonDevices.some(d => d.SKU === device.SKU) ? 'var(--accent-color)' : 'rgba(255, 255, 255, 0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            padding: 0,
                            outline: 'none',
                            transition: 'all 0.2s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                          aria-label="Compare device"
                        >
                          {comparisonDevices.some(d => d.SKU === device.SKU) && (
                            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1.5 4L3.5 6L8.5 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      )}

                      <div className="device-card-content-vertical">
                        <motion.div className="device-card-image-large" layoutId={`image-${device.SKU}`}>
                          <ImageWithFallback src={device['Device Image']} alt={device['Device Name']} isLaptop={isLaptop} />
                        </motion.div>
                        <div className="device-card-info-vertical">
                          <div className="device-brand-text">{device.Formfactor || brand}</div>
                          <motion.h3 className="device-title-text">
                            {device['Device Name']}
                          </motion.h3>
                          <div className="device-sku-text">SKU: {device.SKU || 'N/A'}</div>
                          {device.Persona && (
                            <span className="persona-tag" style={{ backgroundColor: getPersonaColor(device.Persona) }}>
                              {device.Persona}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        ))
      )}

      <FilterModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        devices={devices}
        activeFilters={activeFilters}
        onApply={setActiveFilters}
      />
    </div>
  );
};

export default DeviceList;
