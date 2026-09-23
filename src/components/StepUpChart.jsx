import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

const StepUpChart = () => {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '650px', margin: '0 auto', textAlign: 'center' }}>
      <div 
        className="glass-panel" 
        style={{ 
          padding: '3rem 2rem', 
          borderRadius: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <div 
          style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'var(--surface-hover)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'var(--accent-color)',
            boxShadow: 'var(--glow-primary)'
          }}
        >
          <TrendingUp size={32} />
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span>Step Up Guide</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Releasing this section soon!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto', lineHeight: 1.5 }}>
            We're building an interactive comparison ladder to help you easily understand feature upgrades between models for your own information. Check back soon!
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepUpChart;
