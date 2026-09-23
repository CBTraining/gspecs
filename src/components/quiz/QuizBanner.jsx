import React from 'react';

const QuizBanner = ({ onOpenQuiz }) => {
  if (!onOpenQuiz) return null;

  return (
    <div className="quiz-banner">
      <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: '1.4rem', flexShrink: 0, lineHeight: 1 }}>✨</span>
        <div style={{ minWidth: 0 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Find Your Googlebook
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.25, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            Compare specs & find your ideal match
          </p>
        </div>
      </div>
      <button 
        className="btn-primary" 
        onClick={onOpenQuiz}
        style={{ 
          padding: '0.45rem 0.85rem', 
          fontSize: '0.8rem', 
          fontWeight: 700,
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.35rem',
          borderRadius: '0.875rem',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}
      >
        <span>Take Quiz</span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
    </div>
  );
};

export default QuizBanner;
