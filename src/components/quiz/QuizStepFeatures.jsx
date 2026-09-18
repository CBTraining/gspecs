import React from 'react';
import { Smartphone, Battery } from 'lucide-react';

const QuizStepFeatures = ({ onSelect }) => {
  return (
    <div>
      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        Touchscreen vs Battery Life
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
        Choose your priority feature:
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <button
          onClick={() => onSelect('touch')}
          style={{
            textAlign: 'center',
            padding: '2rem 1.5rem',
            borderRadius: '1.25rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <Smartphone size={32} style={{ color: 'var(--accent-color)' }} />
          <div>
            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              Touchscreen & Pen Support
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              I want a touch-sensitive screen or tablet convertible mode for taking notes, sketching, and drawing.
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelect('battery')}
          style={{
            textAlign: 'center',
            padding: '2rem 1.5rem',
            borderRadius: '1.25rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
        >
          <Battery size={32} style={{ color: 'var(--accent-color)' }} />
          <div>
            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              Long-Lasting Battery
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              I need all-day battery life (11+ hours) so I don't have to carry a charger or hunt for outlets.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuizStepFeatures;
