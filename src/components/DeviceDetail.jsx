import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Globe, User, ShoppingBag, Share2 } from 'lucide-react';
import { getPersonaColor } from '../utils/persona';
import { getDeviceSpecGroups } from '../data/specSchema';
import ImageWithFallback from './common/ImageWithFallback';
import ActionButton from './device-detail/ActionButton';
import SpecGroup from './device-detail/SpecGroup';
import BasketItemTag from './device-detail/BasketItemTag';
import { TooltipContext } from './device-detail/TooltipContext';



const DeviceDetail = ({ device, onBack }) => {
  const [activeTooltipId, setActiveTooltipId] = useState(null);

  const specGroups = useMemo(() => {
    return getDeviceSpecGroups(device);
  }, [device]);

  if (!device) return null;


  const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');

  const copyToClipboard = (text) => {
    if (text) navigator.clipboard.writeText(text);
  };

  const openLink = (url) => {
    let link = url;
    if (link && !link.startsWith('http')) {
      link = 'https://' + link;
    }
    if (link) window.open(link, '_blank');
  };

  const barcodeSrc = device.SKU ? `/barcodes/${device.SKU.replace(/[^a-zA-Z0-9_-]/g, '')}.png` : null;

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
        <div className="container content-area">
          <div className="detail-header-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 className="detail-header-title">{device['Device Name']}</h2>
                <div className="detail-header-subtitle">{device.Formfactor || device['OEM (brand)']}</div>
              </div>
              {device.Persona && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {device.Persona.split(',').map((p, i) => (
                    <span key={i} className="persona-tag" style={{ backgroundColor: getPersonaColor(p) }}>
                      {p.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="detail-image-card">
            <ImageWithFallback 
              src={device['Device Image']} 
              alt={device['Device Name']} 
              isLaptop={isLaptop} 
              size={120}
              className="detail-large-image"
              loading="eager"
              style={{ height: 'auto', maxHeight: '280px' }}
            />
            {barcodeSrc && (
              <img 
                src={barcodeSrc} 
                alt="Barcode" 
                className="detail-barcode" 
                loading="lazy" 
                onError={(e) => { e.currentTarget.style.display = 'none'; }} 
              />
            )}
          </div>

          <div className="action-buttons-row">
            <ActionButton 
              icon={Copy} 
              label="SKU" 
              successLabel="SKU Copied!" 
              onClick={() => copyToClipboard(device.SKU)} 
            />
            <ActionButton 
              icon={Copy} 
              label="UPC" 
              successLabel="UPC Copied!" 
              onClick={() => copyToClipboard(device.UPC)} 
            />
            <ActionButton 
              icon={Globe} 
              label="Bestbuy.com" 
              successLabel="Opening..." 
              onClick={() => openLink(device['Device Online Listing'])} 
            />
            <ActionButton 
              icon={Share2} 
              label="Share Link" 
              successLabel="Link Copied!" 
              onClick={() => {
                const shareUrl = `${window.location.origin}${window.location.pathname}?sku=${encodeURIComponent(device.SKU)}`;
                copyToClipboard(shareUrl);
              }} 
            />
          </div>

          <div className="specs-grid">
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

            {device['Basket Recommendations'] && (
              <div className="specs-card" style={{ height: '100%' }}>
                <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShoppingBag size={20} style={{ color: 'var(--text-secondary)' }} />
                  <span>Basket Recommendations</span>
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
                  Tap any item to see why it fits this device and who looks for it.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {device['Basket Recommendations'].split(',').map((item, idx) => (
                    <BasketItemTag key={idx} item={item.trim()} />
                  ))}
                </div>
              </div>
            )}

            {specGroups.map((group, idx) => (
              <SpecGroup 
                key={group.title || idx} 
                title={group.title} 
                icon={group.icon} 
                items={group.items} 
              />
            ))}
          </div>

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
        </div>
      </motion.div>
    </TooltipContext.Provider>
  );
};

export default DeviceDetail;
