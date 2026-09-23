import React from 'react';
import { LayoutGrid, Sparkles } from 'lucide-react';

const AppIndexView = () => {
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
          <LayoutGrid size={32} />
        </div>

        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
            <Sparkles size={16} />
            <span>App Index</span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            App Index
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>
            Coming soon, an easy and quick reference to see what applications are recommended on Googlebook and Chromebook, and alternatives to look into!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AppIndexView;
