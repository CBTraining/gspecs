import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Info, X } from 'lucide-react';
import { getDeviceSpecGroups } from '../data/specSchema';
import DetailHeader from './device-detail/DetailHeader';
import DetailHeroImage from './device-detail/DetailHeroImage';
import DetailActions from './device-detail/DetailActions';
import DetailBasketSection from './device-detail/DetailBasketSection';
import SpecGroup from './device-detail/SpecGroup';
import { TooltipContext } from './device-detail/TooltipContext';

const DeviceDetail = ({ device, onBack, embedded = false }) => {
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  const specGroups = useMemo(() => {
    return getDeviceSpecGroups(device);
  }, [device]);

  if (!device) return null;

  const content = (
    <div className={embedded ? "detail-embedded-content" : "container content-area"}>
      {embedded && (
        <div className="detail-embedded-top-bar">
          <div className="detail-embedded-badge">
            <span>Device Overview</span>
          </div>
          {onBack && (
            <button 
              className="btn-icon detail-embedded-close-btn" 
              onClick={onBack}
              aria-label="Close device details"
              title="Close panel"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <DetailHeader device={device} />

      <DetailHeroImage device={device} />

      <DetailActions device={device} />

      <div className="specs-grid">
        {(device['About'] || device['about']) && (
          <div className="specs-card" style={{ height: '100%' }}>
            <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Info size={20} style={{ color: 'var(--text-secondary)' }} />
              <span>About</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: 'var(--text-secondary)' }}>
              {device['About'] || device['about']}
            </p>
          </div>
        )}

        {device['Persona Extended'] && (
          <div className="specs-card" style={{ height: '100%' }}>
            <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--text-secondary)' }} />
              <span>Persona Overview</span>
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
              {device['Persona Extended']}
            </p>
          </div>
        )}

        <DetailBasketSection recommendations={device['Basket Recommendations']} />

        {specGroups.map((group, idx) => (
          <SpecGroup 
            key={group.title || idx} 
            title={group.title} 
            icon={group.icon} 
            items={group.items} 
            disclaimer={group.disclaimer}
          />
        ))}
      </div>

      {!embedded && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem', marginBottom: '1.5rem' }}>
          <button 
            className="btn-secondary"
            onClick={onBack}
            style={{
              width: '100%',
              maxWidth: '280px',
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <TooltipContext.Provider value={{ activeTooltipId, setActiveTooltipId }}>
        <motion.div
          key={device.SKU || device['Device Name']}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="detail-embedded-wrapper"
        >
          {content}
        </motion.div>
      </TooltipContext.Provider>
    );
  }

  return (
    <TooltipContext.Provider value={{ activeTooltipId, setActiveTooltipId }}>
      <motion.div 
        className="detail-view"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        onClick={(e) => {
          if (e.target.classList.contains('detail-view') || e.target.classList.contains('container')) {
            onBack();
          }
        }}
      >
        {content}
      </motion.div>
    </TooltipContext.Provider>
  );
};

export default DeviceDetail;
