import React from 'react';
import { PERSONA_OPTIONS } from '../../data/quizQuestions';

const QuizStepPersona = ({ onSelect }) => {
  return (
    <div>
      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        What is your primary use case?
      </h4>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {PERSONA_OPTIONS.map(option => (
          <button
            key={option.key}
            onClick={() => onSelect(option.key)}
            style={{
              textAlign: 'left',
              padding: '1.25rem',
              borderRadius: '1rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--surface-color)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              outline: 'none',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{option.label}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{option.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizStepPersona;
