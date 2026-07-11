import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Laptop, Copy, Check, Globe, Info, User, Cpu, Monitor, Cable, Layers, ShoppingBag } from 'lucide-react';
import { getPersonaColor } from '../utils/persona';

const GLOSSARY = {
  'color accuracy': 'Color Accuracy: Measures how precisely the screen displays colors (e.g., sRGB, DCI-P3). Crucial for Content Creators, designers, and photographers who need exact color representation.',
  'screen type': 'Screen Type: The display technology used (e.g., IPS LCD, OLED). Determines color vibrancy, contrast ratios, battery consumption, and viewing angles.',
  'screen size': 'Screen Size: The diagonal measurement of the screen in inches. Smaller screens (10"-13") prioritize portability for students and travelers, while larger screens (15"-17") offer more workspace for multitasking.',
  'screen brightness': 'Screen Brightness: Measured in nits. Higher values (300-400+ nits) mean the screen is easier to read in bright outdoor conditions or under direct light.',
  'pen compatibility': 'Pen Compatibility: Support for a digital stylus pen. Essential for students taking handwritten notes, designers sketching, or professionals marking up documents.',
  'refresh rate': 'Refresh Rate: How many times per second the screen updates. Higher rates (e.g., 120Hz, 144Hz) mean smoother animation, scrolling, and gaming.',
  'aspect ratio': 'Aspect Ratio: The proportional relationship between screen width and height (e.g., 16:9 widescreen, 16:10 or 3:2 taller screens). Taller screens display more vertical content, ideal for productivity.',
  'ips': 'In-Plane Switching: A screen technology known for great colors and wide viewing angles.',
  'oled': 'Organic Light Emitting Diode: Provides perfect blacks, infinite contrast, and vibrant colors.',
  'emmc': 'Embedded MultiMediaCard: Basic, affordable flash storage common in entry-level devices.',
  'ssd': 'Solid State Drive: Faster, more reliable storage than older hard drives or eMMC.',
  'ram': 'Random Access Memory: Short-term memory for active tasks. More RAM means better multitasking.',
  'npu': 'Neural Processing Unit: A specialized chip designed to accelerate AI tasks efficiently.',
  'processor': 'The primary chip (CPU) responsible for executing instructions and running apps.',
  'storage': 'Permanent memory where all your files, OS, and applications are kept.',
  'thunderbolt': 'A super-fast port standard (USB-C shape) for data, video, and charging.',
  'hdmi': 'High-Definition Multimedia Interface: Standard port for connecting to TVs and monitors.',
  'msrp': 'Manufacturer’s Suggested Retail Price.',
  'resolution': 'The number of pixels on the screen (width x height). Higher means sharper text and images.',
  'formfactor': 'The physical design of the device (e.g., Clamshell laptop, Tablet, 2-in-1 Convertible).',
  'wi-fi': 'Wireless standard used for connecting to local networks and the internet.',
  'bluetooth': 'Wireless standard for connecting peripherals like headphones and mice.',
  'touchscreen': 'Allows you to interact directly with the display using your fingers.',
};

const SpecText = ({ text }) => {
  const [show, setShow] = useState(false);
  const [xOffset, setXOffset] = useState("-50%");
  const spanRef = useRef(null);

  useEffect(() => {
    if (!show) return;
    const handleDocumentClick = () => setShow(false);
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [show]);
  
  if (!text) return null;
  
  // Look for a glossary match, sorting keys by descending length to prevent substring collisions
  const textStr = String(text).toLowerCase();
  const matchKey = Object.keys(GLOSSARY)
    .sort((a, b) => b.length - a.length)
    .find(key => textStr.includes(key));

  if (!matchKey) return <span>{text}</span>;

  const handleClick = (e) => {
    e.stopPropagation();
    if (!show && spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      const tooltipWidth = 250; 
      const windowWidth = window.innerWidth;
      const centerX = rect.left + rect.width / 2;
      
      let offsetPx = 0;
      if (centerX - tooltipWidth / 2 < 16) {
        offsetPx = 16 - (centerX - tooltipWidth / 2);
      } else if (centerX + tooltipWidth / 2 > windowWidth - 16) {
        offsetPx = (windowWidth - 16) - (centerX + tooltipWidth / 2);
      }
      setXOffset(`calc(-50% + ${offsetPx}px)`);
    }
    setShow(!show);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span 
        ref={spanRef}
        onClick={handleClick}
        style={{ 
          borderBottom: '1px dotted var(--text-secondary)', 
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {text}
      </span>
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5, x: xOffset }}
            animate={{ opacity: 1, y: 0, x: xOffset }}
            exit={{ opacity: 0, y: 5, x: xOffset }}
            style={{ 
              position: 'absolute', 
              bottom: '100%', 
              left: '50%', 
              marginBottom: '8px',
              backgroundColor: 'var(--surface-hover)', 
              padding: '1rem', 
              borderRadius: '0.5rem', 
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-md)', 
              zIndex: 50,
              width: 'max-content', 
              maxWidth: '250px',
              fontSize: '0.85rem', 
              color: 'var(--text-primary)',
              textAlign: 'left',
              lineHeight: 1.4
            }}
          >
            <strong>{matchKey.toUpperCase()}</strong>: {GLOSSARY[matchKey]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ImageWithFallback = ({ src, alt, isLaptop }) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return isLaptop ? <Laptop size={120} color="var(--text-secondary)" /> : <Smartphone size={120} color="var(--text-secondary)" />;
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className="detail-large-image"
      onError={() => setError(true)}
    />
  );
};

const ActionButton = ({ icon: Icon, label, onClick }) => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    onClick();
    if (label.includes('UPC') || label.includes('SKU')) {
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button className="action-btn" onClick={handleClick}>
      {copied ? <Check size={20} /> : <Icon size={20} />}
      <span>{label}</span>
    </button>
  );
};

const SpecGroup = ({ title, icon: Icon, items }) => {
  const validItems = items.filter(item => item.value && item.value.toLowerCase() !== 'none' && item.value !== '');
  if (validItems.length === 0) return null;

  return (
    <div className="specs-card" style={{ height: '100%' }}>
      <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {Icon && <Icon size={20} style={{ color: 'var(--text-secondary)' }} />}
        <span>{title}</span>
      </h3>
      <div className="specs-list">
        {validItems.map((spec, idx) => (
          <div className="spec-row" key={idx}>
            <span className="spec-label"><SpecText text={spec.label} /></span>
            <span className="spec-value"><SpecText text={spec.value} /></span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DeviceDetail = ({ device, onBack }) => {
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
    <motion.div 
      className="detail-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      onClick={(e) => {
        // If clicking directly on the background or the container gap, go back
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
          <ImageWithFallback src={device['Device Image']} alt={device['Device Name']} isLaptop={isLaptop} />
          {barcodeSrc && (
            <img src={barcodeSrc} alt="Barcode" className="detail-barcode" />
          )}
        </motion.div>

        <div className="action-buttons-row">
          <ActionButton icon={Copy} label="SKU" onClick={() => copyToClipboard(device.SKU)} />
          <ActionButton icon={Copy} label="UPC" onClick={() => copyToClipboard(device.UPC)} />
          <ActionButton icon={Globe} label="Bestbuy.com" onClick={() => openLink(device['Device Online Listing'])} />
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
      </div>
    </motion.div>
  );
};

export default DeviceDetail;
