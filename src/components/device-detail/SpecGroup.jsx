import React from 'react';
import { SpecText } from './SpecText';

const getPillItems = (val, label) => {
  if (!val || typeof val !== 'string') return null;
  const str = val.trim();

  // Never split price or numeric values like "$1,299" or "1,000"
  if (/^\$?\d{1,3}(,\d{3})+(\.\d+)?$/.test(str)) return null;

  // Split by comma
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);

  // If it has multiple comma-separated items, return as pills
  if (parts.length > 1) {
    return parts;
  }

  // For multi-item category fields (Security, Ports, Build), display single items as pills too for visual consistency
  const normLabel = (label || '').trim().toLowerCase();
  if (parts.length === 1 && (normLabel === 'security' || normLabel === 'ports' || normLabel === 'build')) {
    return parts;
  }

  return null;
};

export const SpecGroup = ({ title, icon: Icon, items }) => {
  const validItems = items.filter(item => item.value && String(item.value).toLowerCase() !== 'none' && String(item.value).trim() !== '');
  if (validItems.length === 0) return null;

  return (
    <div className="specs-card" style={{ height: '100%' }}>
      <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {Icon && <Icon size={20} style={{ color: 'var(--text-secondary)' }} />}
        <span>{title}</span>
      </h3>
      <div className="specs-list">
        {validItems.map((spec, idx) => {
          const pillItems = getPillItems(spec.value, spec.label);
          const isPill = pillItems && pillItems.length > 0;

          return (
            <div 
              className={`spec-row ${isPill ? 'spec-row-multiline' : ''}`} 
              key={idx}
            >
              <span className="spec-label">
                <SpecText text={spec.label} />
              </span>
              {isPill ? (
                <div className="spec-pills-wrap">
                  {pillItems.map((item, i) => (
                    <span className="spec-pill" key={i}>
                      <SpecText text={item} />
                    </span>
                  ))}
                </div>
              ) : (
                <span className="spec-value">
                  <SpecText text={spec.value} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpecGroup;
