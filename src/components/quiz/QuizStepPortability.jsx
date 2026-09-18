import React from 'react';
import { Laptop, Monitor } from 'lucide-react';

const QuizStepPortability = ({ onSelect }) => {
  return (
    <div>
      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        Portability vs Screen Size
      </h4>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
        Which of these aspects is more important for your daily work?
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
        <button
          onClick={() => onSelect('portability')}
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
          <Laptop size={32} style={{ color: 'var(--accent-color)' }} />
          <div>
            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              Ultra-Light & Portable
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              I am always on the go. I need a lightweight device (under 3.2 lbs) that is easy to carry all day.
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelect('large-screen')}
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
          <Monitor size={32} style={{ color: 'var(--accent-color)' }} />
          <div>
            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
              Larger Display Space
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              I want maximum screen real estate (14" or larger) to multitask comfortably with multiple windows open.
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default QuizStepPortability;
