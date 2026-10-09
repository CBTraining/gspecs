import React from 'react';
import { Info } from 'lucide-react';
import { SpecText } from './SpecText';

const NON_PILL_LABELS = new Set([
  'about',
  'description',
  'overview',
  'summary',
  'notes',
  'details',
  'persona extended',
  'extra features',
  'msrp',
  'price',
  'external monitors'
]);

const getPillItems = (val, label) => {
  if (!val || typeof val !== 'string') return null;
  const str = val.trim();
  const normLabel = (label || '').trim().toLowerCase();

  // Never split designated narrative/paragraph or price fields
  if (NON_PILL_LABELS.has(normLabel)) return null;

  // Never split full prose (e.g. sentences with punctuation followed by capital letters)
  if (/[.!?]\s+[A-Z]/.test(str)) return null;

  // Never split price or numeric values like "$1,299" or "1,000"
  if (/^\$?\d{1,3}(,\d{3})+(\.\d+)?$/.test(str)) return null;

  // Split by comma
  const parts = str.split(',').map(s => s.trim()).filter(Boolean);

  // If it has multiple comma-separated items, return as pills
  if (parts.length > 1) {
    return parts;
  }

  // For multi-item category fields (Security, Ports, Build), display single items as pills too for visual consistency
  if (parts.length === 1 && (normLabel === 'security' || normLabel === 'ports' || normLabel === 'build')) {
    return parts;
  }

  return null;
};

export const SpecGroup = ({ title, icon: Icon, items, disclaimer }) => {
  const validItems = items.filter(item => item.value && String(item.value).toLowerCase() !== 'none' && String(item.value).trim() !== '');
  if (validItems.length === 0) return null;

  return (
    <div className="specs-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {Icon && <Icon size={20} style={{ color: 'var(--text-secondary)' }} />}
        <span>{title}</span>
      </h3>
      <div className="specs-list" style={{ flex: 1 }}>
        {validItems.map((spec, idx) => {
          const pillItems = getPillItems(spec.value, spec.label);
          const isPill = pillItems && pillItems.length > 0;
          const isLongText = !isPill && typeof spec.value === 'string' && spec.value.length > 60;

          return (
            <div 
              className={`spec-row ${isPill || isLongText ? 'spec-row-multiline' : ''}`} 
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
                <span 
                  className="spec-value"
                  style={isLongText ? { textAlign: 'left', maxWidth: '100%' } : undefined}
                >
                  <SpecText text={spec.value} />
                </span>
              )}
            </div>
          );
        })}
      </div>
      {disclaimer && (
        <div className="spec-group-disclaimer">
          <Info size={15} className="spec-disclaimer-icon" />
          <span className="spec-disclaimer-text">
            <strong>Disclaimer:</strong> {disclaimer}
          </span>
        </div>
      )}
    </div>
  );
};

export default SpecGroup;
