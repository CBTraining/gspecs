import React from 'react';

const QuizQuestionStep = ({ question, onSelect }) => {
  if (!question) return null;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-primary)' }}>
          {question.title}
        </h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.4 }}>
          {question.subtitle}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {question.options.map(option => {
          const OptionIcon = option.icon;
          return (
            <button
              key={option.key}
              onClick={() => onSelect(option.key)}
              style={{
                textAlign: 'left',
                padding: '1.2rem',
                borderRadius: '1.15rem',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {OptionIcon && (
                <div 
                  style={{ 
                    width: '42px', 
                    height: '42px', 
                    borderRadius: '0.75rem', 
                    backgroundColor: 'var(--surface-hover)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--accent-color)',
                    flexShrink: 0
                  }}
                >
                  <OptionIcon size={22} />
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {option.title}
                  </span>
                  {option.badge && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: 700, 
                      color: 'var(--accent-color)', 
                      backgroundColor: 'rgba(49, 132, 254, 0.1)', 
                      padding: '0.15rem 0.5rem', 
                      borderRadius: '0.75rem' 
                    }}>
                      {option.badge}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4, display: 'block' }}>
                  {option.desc}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizQuestionStep;
