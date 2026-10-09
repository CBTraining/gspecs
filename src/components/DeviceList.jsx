import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, AlertTriangle } from 'lucide-react';
import FilterModal from './FilterModal';
import DeviceCard from './DeviceCard';
import QuizBanner from './quiz/QuizBanner';
import { filterDevices } from '../utils/filterDevices';
import { isLaptopDevice } from '../utils/deviceUtils';

const DeviceList = ({ devices, onSelectDevice, comparisonDevices = [], onToggleComparison, onOpenQuiz }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState(() => {
    try {
      const saved = localStorage.getItem('gspecs_activeFilters');
      return saved ? JSON.parse(saved) : {};
    } catch {
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
    return filterDevices(devices, activeFilters, searchQuery);
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
      {/* Internal Warning Banner */}
      <div className="internal-warning-banner" role="alert">
        <AlertTriangle size={20} />
        <span>
          G-Specs is a utility developed for use by CSS. Please do not share with RSAs or customers, as this is an internal tool.
        </span>
      </div>

      <div className="device-list-controls">
        <h2 className="device-list-title">Devices ({filteredDevices.length})</h2>
        
        {/* Device Type Toggle Pills */}
        <div className="device-type-pills">
          {['All', 'Googlebook', 'Chromebook'].map((type) => {
            const isActive = currentDeviceType === type;
            return (
              <button
                key={type}
                onClick={() => handleSelectDeviceType(type)}
                className={`device-type-pill-btn ${isActive ? 'active' : ''}`}
              >
                {type}
              </button>
            );
          })}
        </div>

        <button 
          className="btn-secondary device-filter-btn" 
          onClick={() => setIsFilterOpen(true)}
        >
          <Filter size={18} />
          <span>Filters</span>
          {totalActiveFilters > 0 && (
            <span className="filter-active-badge" />
          )}
        </button>
      </div>

      {/* Search Input Bar & Quiz Prompt Banner (Shared Row) */}
      <div className="search-quiz-row">
        <div className="search-bar-wrapper">
          <Search 
            size={18} 
            className="search-icon"
          />
          <input
            type="text"
            aria-label="Search devices"
            placeholder="Search devices by name, SKU, or specs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <QuizBanner onOpenQuiz={onOpenQuiz} />
      </div>

      {brands.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem 1.5rem', 
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          <p style={{ fontSize: '1.05rem', margin: 0 }}>No devices found matching your filters.</p>
          <button 
            className="btn-primary" 
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
              {groupedDevices[brand].map((device) => {
                const isLaptop = isLaptopDevice(device);
                const isSelectedForCompare = comparisonDevices.some(d => d.SKU === device.SKU);

                return (
                  <DeviceCard
                    key={device.SKU || device['Device Name']}
                    device={device}
                    brand={brand}
                    isLaptop={isLaptop}
                    isSelectedForCompare={isSelectedForCompare}
                    onSelectDevice={onSelectDevice}
                    onToggleComparison={onToggleComparison}
                  />
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
