import React from 'react';
import { SpecText } from './SpecText';

export const SpecGroup = ({ title, icon: Icon, items }) => {
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

export default SpecGroup;
