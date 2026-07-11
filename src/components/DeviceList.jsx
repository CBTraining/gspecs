import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Laptop, Filter } from 'lucide-react';
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

const DeviceList = ({ devices, onSelectDevice }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  // Filter devices based on activeFilters
  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      for (const [key, selectedValues] of Object.entries(activeFilters)) {
        if (selectedValues.length === 0) continue;
        if (!selectedValues.includes(device[key])) {
          return false;
        }
      }
      return true;
    });
  }, [devices, activeFilters]);

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Devices ({filteredDevices.length})</h2>
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

      {brands.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>No devices found matching your filters.</p>
          <button className="btn-primary" style={{ marginTop: '1rem', margin: '0 auto' }} onClick={() => setActiveFilters({})}>Clear Filters</button>
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
