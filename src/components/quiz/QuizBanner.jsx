import React from 'react';

const QuizBanner = ({ onOpenQuiz }) => {
  if (!onOpenQuiz) return null;

  return (
    <div className="quiz-banner">
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '1.75rem' }}>✨</span>
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
            Find Your Googlebook
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Compare ports, screen size, color accuracy, and battery to find your ideal Googlebook match.
          </p>
        </div>
      </div>
      <button 
        className="btn-primary" 
        onClick={onOpenQuiz}
        style={{ 
          padding: '0.5rem 1rem', 
          fontSize: '0.85rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem',
          borderRadius: '1rem',
          whiteSpace: 'nowrap'
        }}
      >
        <span>Take Quiz</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default QuizBanner;
