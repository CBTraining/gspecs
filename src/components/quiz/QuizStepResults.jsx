import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import QuizResultCard from './QuizResultCard';

const QuizStepResults = ({ recommendations, onSelectDevice, onClose, onReset }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          <Sparkles size={14} />
          <span>Top Matches</span>
        </div>
        <h4 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
          Recommended Googlebooks
        </h4>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.4 }}>
          Based on your ports, screen, form factor, and platform requirements:
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.map(({ device, matchPercentage, highlights }) => (
          <QuizResultCard
            key={device.SKU}
            device={device}
            matchPercentage={matchPercentage}
            highlights={highlights}
            onSelectDevice={onSelectDevice}
            onClose={onClose}
          />
        ))}

        {recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No matches found matching all criteria. Try retaking the quiz with different options.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
        <button 
          className="btn-secondary" 
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '1.5rem', padding: '0.6rem 1.4rem', fontWeight: 600 }}
        >
          <RefreshCw size={16} />
          <span>Retake Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default QuizStepResults;
