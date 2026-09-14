import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Copy, Globe, User, Cpu, Monitor, Cable, Layers, ShoppingBag, Share2 } from 'lucide-react';
import { getPersonaColor } from '../utils/persona';
import ImageWithFallback from './common/ImageWithFallback';
import ActionButton from './device-detail/ActionButton';
import SpecGroup from './device-detail/SpecGroup';
import { TooltipContext } from './device-detail/TooltipContext';

const DeviceDetail = ({ device, onBack }) => {
  const [activeTooltipId, setActiveTooltipId] = useState(null);

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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
        transition={{ duration: 0.15, ease: "easeInOut" }}
        onClick={(e) => {
          if (e.target.classList.contains('detail-view') || e.target.classList.contains('container')) {
            onBack();
          }
        }}
      >
        <div className="container content-area">
          <motion.div className="detail-header-card" layoutId={`card-${device.SKU}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <motion.h2 className="detail-header-title">{device['Device Name']}</motion.h2>
                <div className="detail-header-subtitle">{device.Formfactor || device['OEM (brand)']}</div>
              </div>
              {device.Persona && (
                <span className="persona-tag" style={{ backgroundColor: getPersonaColor(device.Persona) }}>
                  {device.Persona}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div className="detail-image-card" layoutId={`image-${device.SKU}`}>
            <ImageWithFallback 
              src={device['Device Image']} 
              alt={device['Device Name']} 
              isLaptop={isLaptop} 
              size={120}
              className="detail-large-image"
            />
            {barcodeSrc && (
              <img src={barcodeSrc} alt="Barcode" className="detail-barcode" />
            )}
          </motion.div>

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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                  {device['Basket Recommendations'].split(',').map((item, idx) => (
                    <span 
                      key={idx} 
                      style={{
                        backgroundColor: 'var(--surface-hover)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '0.5rem',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.85rem',
                        fontWeight: '500',
                        color: 'var(--text-primary)',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <SpecGroup title="Specs" icon={Cpu} items={[
              { label: 'MSRP', value: device.MSRP },
              { label: 'Processor', value: device.Processor },
              { label: 'NPU', value: device.NPU },
              { label: 'RAM', value: device['RAM/Memory'] },
              { label: 'Storage', value: device.Storage },
              { label: 'Formfactor', value: device.Formfactor }
            ]} />

            <SpecGroup title="Screen" icon={Monitor} items={[
              { label: 'Screen Size', value: device['Screen Size'] },
              { label: 'Screen Type', value: device['Screen Type'] },
              { label: 'Resolution', value: device['Resolution'] },
              { label: 'Aspect Ratio', value: device['Aspect Ratio'] },
              { label: 'Screen Brightness', value: device['Screen Brightness (nits)'] ? `${device['Screen Brightness (nits)']} nits` : '' },
              { label: 'Color Accuracy', value: device['Color Accuracy'] },
              { label: 'Touchscreen', value: device['Touchscreen?'] },
              { label: 'Pen Compatibility', value: device['Pen Compatibility?'] }
            ]} />

            <SpecGroup title="Ports & Connectivity" icon={Cable} items={[
              { label: 'USB-A', value: device['USB-A'] },
              { label: 'USB-C', value: device['USB-C'] },
              { label: 'Thunderbolt 4', value: device['Thunderbolt 4'] },
              { label: 'HDMI', value: device['HDMI'] },
              { label: 'SD Card Slot', value: device['SD Card Slot'] },
              { label: 'Headphone Jack', value: device['Headphone Jack'] },
              { label: 'Wi-Fi standard', value: device['Wi-Fi standard'] },
              { label: 'Bluetooth Version', value: device['Bluetooth Version'] }
            ]} />

            <SpecGroup title="Other" icon={Layers} items={[
              { label: 'Keyboard Size', value: device['Keyboard size'] },
              { label: 'Backlit Keyboard', value: device['Backlit Keyboard?'] },
              { label: 'Weight', value: device.Weight },
              { label: 'Battery Life', value: device['Battery Life'] }
            ]} />
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
