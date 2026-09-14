import React from 'react';
import { ArrowRight } from 'lucide-react';
import { getPersonaColor } from '../../utils/persona';
import ImageWithFallback from '../common/ImageWithFallback';

export const QuizResultCard = ({ device, matchPercentage, onSelectDevice, onClose }) => {
  const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');

  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        backgroundColor: 'var(--surface-hover)',
        border: '1px solid var(--border-color)',
        borderRadius: '1.25rem',
        padding: '1rem'
      }}
    >
      <div style={{ 
        width: '70px', 
        height: '70px', 
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid var(--border-color)',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <ImageWithFallback 
          src={device['Device Image']} 
          alt={device['Device Name']} 
          isLaptop={isLaptop} 
          size={24} 
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <h5 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {device['Device Name']}
        </h5>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '700' }}>
            {matchPercentage}% Match
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>|</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {device.MSRP}
          </span>
          {device.Persona && (
            <span style={{ 
              fontSize: '0.75rem', 
              color: '#ffffff', 
              backgroundColor: getPersonaColor(device.Persona), 
              borderRadius: '0.25rem',
              padding: '0.1rem 0.4rem',
              fontWeight: '600'
            }}>
              {device.Persona}
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
  );
};

export default QuizResultCard;
