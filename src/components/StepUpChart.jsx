import React from 'react';
import { TrendingUp, Check, ArrowRight, ArrowDown, Laptop, Smartphone } from 'lucide-react';
import { getPersonaColor } from '../utils/persona';

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
};

const getUpgrades = (prev, curr) => {
  if (!prev) return [];
  const upgrades = [];
  
  // CPU upgrade
  if (prev.Processor !== curr.Processor) {
    upgrades.push(`Processor: ${curr.Processor} (vs ${prev.Processor})`);
  }
  
  // RAM upgrade
  const prevRam = parseInt(prev['RAM/Memory']?.replace(/[^0-9]/g, ''), 10) || 0;
  const currRam = parseInt(curr['RAM/Memory']?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currRam > prevRam) {
    upgrades.push(`RAM: Upgraded to ${curr['RAM/Memory']} (from ${prev['RAM/Memory']})`);
  }
  
  // Storage upgrade
  const prevStorage = parseInt(prev.Storage?.replace(/[^0-9]/g, ''), 10) || 0;
  const currStorage = parseInt(curr.Storage?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currStorage > prevStorage) {
    upgrades.push(`Storage: Upgraded to ${curr.Storage} (from ${prev.Storage})`);
  }

  // NPU upgrade
  const prevNpu = parseInt(prev['NPU (TOPS)']?.replace(/[^0-9]/g, ''), 10) || 0;
  const currNpu = parseInt(curr['NPU (TOPS)']?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currNpu > prevNpu) {
    upgrades.push(`NPU: Upgraded to ${curr['NPU (TOPS)']} (from ${prev['NPU (TOPS)']})`);
  }

  // Touchscreen upgrade
  if (prev['Touchscreen?']?.toLowerCase() === 'no' && curr['Touchscreen?']?.toLowerCase() === 'yes') {
    upgrades.push("Touchscreen: Added touchscreen support");
  }

  // Pen compatibility upgrade
  if (prev['Pen Compatibility?']?.toLowerCase() === 'no' && curr['Pen Compatibility?']?.toLowerCase() === 'yes') {
    upgrades.push("Pen: Added stylus pen compatibility");
  }

  // Screen type upgrade
  if (prev['Screen Type']?.toLowerCase().includes('ips') && curr['Screen Type']?.toLowerCase().includes('oled')) {
    upgrades.push(`Display: Upgraded from IPS LCD to OLED screen`);
  }

  // Screen size upgrade
  const prevSize = parseFloat(prev['Screen Size']?.replace(/[^0-9.]/g, '')) || 0;
  const currSize = parseFloat(curr['Screen Size']?.replace(/[^0-9.]/g, '')) || 0;
  if (currSize > prevSize) {
    upgrades.push(`Screen Size: Larger ${curr['Screen Size']} display (from ${prev['Screen Size']})`);
  }

  // Fallback: If no distinct hardware upgrades detected, note general OEM differences
  if (upgrades.length === 0 && prev['OEM (brand)'] !== curr['OEM (brand)']) {
    upgrades.push(`Design: Premium build by ${curr['OEM (brand)']} (vs ${prev['OEM (brand)']})`);
  }

  return upgrades;
};

const StepUpChart = ({ devices, onSelectDevice }) => {
  if (!devices || devices.length === 0) return null;

  // Filter out any devices without valid price or SKU, then sort by price ascending
  const sortedDevices = [...devices]
    .filter(d => d.MSRP && d.SKU)
    .sort((a, b) => parsePrice(a.MSRP) - parsePrice(b.MSRP));

  return (
    <div style={{ padding: '0 0.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <TrendingUp size={24} style={{ color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Gragglebook Step Up Guide</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
          A visual progression ladder to help sales associates explain why higher-tier models command a premium price.
        </p>
      </div>

      <div className="step-up-ladder" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sortedDevices.map((device, index) => {
          const prevDevice = index > 0 ? sortedDevices[index - 1] : null;
          const upgrades = prevDevice ? getUpgrades(prevDevice, device) : [];
          
          const prevPrice = prevDevice ? parsePrice(prevDevice.MSRP) : 0;
          const currPrice = parsePrice(device.MSRP);
          const priceDiff = currPrice - prevPrice;
          
          const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');

          return (
            <React.Fragment key={device.SKU}>
              {/* Connector step showing price increase */}
              {prevDevice && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  height: '40px',
                  margin: '-0.5rem 0'
                }}>
                  {/* Vertical dotted line */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '2px',
                    borderLeft: '2px dotted var(--border-color)',
                    zIndex: 1
                  }} />
                  
                  {/* Price delta bubble */}
                  <div style={{
                    zIndex: 2,
                    backgroundColor: 'var(--surface-color)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '2rem',
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-color)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: 'var(--shadow-sm)'
                  }}>
                    <ArrowDown size={12} />
                    <span>Step Up +${priceDiff}</span>
                  </div>
                </div>
              )}

              {/* Device Card */}
              <div 
                className="card-wrapper" 
                style={{ cursor: 'default' }}
              >
                <div className="card" style={{ padding: '1.25rem !important' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    
                    {/* Header line */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 800, color: 'var(--accent-color)', letterSpacing: '0.05em' }}>
                            {device['OEM (brand)']}
                          </span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>•</span>
                          <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>SKU: {device.SKU}</span>
                        </div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: '0.2rem 0', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {isLaptop ? <Laptop size={18} style={{ color: 'var(--text-secondary)' }} /> : <Smartphone size={18} style={{ color: 'var(--text-secondary)' }} />}
                          <span>{device['Device Name']}</span>
                        </h3>
                      </div>
                      
                      {/* Price & Badge */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{device.MSRP}</div>
                        {device.Persona && (
                          <span className="persona-tag" style={{ backgroundColor: getPersonaColor(device.Persona), marginTop: '0.25rem' }}>
                            {device.Persona}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features list */}
                    <div style={{
                      backgroundColor: 'var(--surface-color)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '0.5rem',
                      padding: '0.75rem 1rem'
                    }}>
                      {!prevDevice ? (
                        // Base Model specs
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            Base Model Highlights
                          </div>
                          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                              <Check size={14} style={{ color: 'var(--accent-color)' }} />
                              <span>Processor: {device.Processor}</span>
                            </li>
                            <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                              <Check size={14} style={{ color: 'var(--accent-color)' }} />
                              <span>Memory & Storage: {device['RAM/Memory']} / {device.Storage}</span>
                            </li>
                            <li style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                              <Check size={14} style={{ color: 'var(--accent-color)' }} />
                              <span>Screen: {device['Screen Size']} {device['Screen Type']}</span>
                            </li>
                          </ul>
                        </div>
                      ) : (
                        // Upgrades list
                        <div>
                          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                            Upgrades (For +${priceDiff})
                          </div>
                          {upgrades.length > 0 ? (
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              {upgrades.map((upgrade, idx) => (
                                <li key={idx} style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                  <span style={{ color: '#34a853', fontWeight: 700, fontSize: '0.9rem', lineHeight: '1rem' }}>+</span>
                                  <span>{upgrade}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              Identical hardware specifications; price difference matches cosmetic or retailer differences.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* View Specs action button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                      <button 
                        className="btn-secondary"
                        onClick={() => onSelectDevice(device)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          fontSize: '0.75rem',
                          borderRadius: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <span>View Specs</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StepUpChart;
