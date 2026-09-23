import React from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { getPersonaColor } from '../../utils/persona';
import ImageWithFallback from '../common/ImageWithFallback';
import { isLaptopDevice } from '../../utils/deviceUtils';

export const QuizResultCard = ({ device, matchPercentage, highlights = [], onSelectDevice, onClose }) => {
  const isLaptop = isLaptopDevice(device);

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        backgroundColor: 'var(--surface-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: '1.25rem',
        padding: '1.25rem',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ 
          width: '75px', 
          height: '75px', 
          backgroundColor: '#ffffff',
          borderRadius: '0.75rem',
          padding: '0.35rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          flexShrink: 0
        }}>
          <ImageWithFallback 
            src={device['Device Image']} 
            fallbackSrc={device['Drive Thumbnail']}
            alt={device['Device Name']} 
            isLaptop={isLaptop} 
            size={28} 
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              color: 'var(--accent-color)', 
              backgroundColor: 'rgba(49, 132, 254, 0.12)', 
              padding: '0.15rem 0.5rem', 
              borderRadius: '1rem' 
            }}>
              {matchPercentage}% Match
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
              SKU: {device.SKU}
            </span>
          </div>

          <h5 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {device['Device Name']}
          </h5>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {device.MSRP || 'Pricing in-store'}
            </span>
            {device.Persona && (
              <span style={{ 
                fontSize: '0.7rem', 
                color: '#ffffff', 
                backgroundColor: getPersonaColor(device.Persona), 
                borderRadius: '0.25rem',
                padding: '0.1rem 0.4rem',
                fontWeight: '600'
              }}>
                {device.Persona.split(',')[0]}
              </span>
            )}
          </div>
        </div>

        <button 
          className="btn-primary" 
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem', flexShrink: 0 }}
          onClick={() => {
            onSelectDevice(device);
            onClose();
          }}
        >
          <span>View</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Key Match Highlights */}
      {highlights && highlights.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '0.4rem', 
          paddingTop: '0.5rem', 
          borderTop: '1px solid var(--border-color)' 
        }}>
          {highlights.map((tag, idx) => (
            <span 
              key={idx}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
                padding: '0.2rem 0.5rem',
                color: 'var(--text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontWeight: 500
              }}
            >
              <Check size={12} style={{ color: 'var(--accent-color)' }} />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizResultCard;
