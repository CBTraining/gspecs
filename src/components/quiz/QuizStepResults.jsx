import React from 'react';
import { RefreshCw } from 'lucide-react';
import QuizResultCard from './QuizResultCard';

const QuizStepResults = ({ recommendations, onSelectDevice, onClose, onReset }) => {
  return (
    <div>
      <h4 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
        Recommended Googlebooks
      </h4>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
        Based on your requirements, here are the best matches:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {recommendations.map(({ device, matchPercentage }) => (
          <QuizResultCard
            key={device.SKU}
            device={device}
            matchPercentage={matchPercentage}
            onSelectDevice={onSelectDevice}
            onClose={onClose}
          />
        ))}

        {recommendations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
            <p>No perfect matches found. Try widening your budget or changing priorities.</p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
        <button 
          className="btn-secondary" 
          onClick={onReset}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '1.5rem', padding: '0.6rem 1.2rem' }}
        >
          <RefreshCw size={16} />
          <span>Retake Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default QuizStepResults;
