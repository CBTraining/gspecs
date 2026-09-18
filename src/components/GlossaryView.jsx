import React, { useState, useMemo } from 'react';
import { Search, Monitor, Cpu, Cable, HelpCircle } from 'lucide-react';
import { GLOSSARY_CATEGORIES } from '../data/glossary';

const ICON_MAP = { Monitor, Cpu, Cable, HelpCircle };

const GlossaryView = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter categories and terms based on search query
  const filteredGlossary = useMemo(() => {
    if (!searchQuery.trim()) return GLOSSARY_CATEGORIES;

    const query = searchQuery.toLowerCase();
    return GLOSSARY_CATEGORIES.map(cat => {
      const filteredTerms = cat.terms.filter(
        t => t.name.toLowerCase().includes(query) || t.text.toLowerCase().includes(query)
      );
      return { ...cat, terms: filteredTerms };
    }).filter(cat => cat.terms.length > 0);
  }, [searchQuery]);

  const hasResults = filteredGlossary.length > 0;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', marginTop: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tech Glossary</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Understand technical specifications and find the right features for your needs.
        </p>
      </div>

      {/* Search Input */}
      <div 
        style={{
          position: 'relative',
          maxWidth: '500px',
          margin: '0 auto 2.5rem auto',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Search 
          size={18} 
          style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }} 
        />
        <input
          type="text"
          aria-label="Search glossary terms"
          placeholder="Search glossary terms (e.g. OLED, NPU)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.75rem',
            borderRadius: '2rem',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color)',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
            outline: 'none',
            transition: 'border-color 0.2s ease',
            fontFamily: 'inherit'
          }}
          className="search-input"
        />
      </div>

      {/* Glossary Content */}
      {!hasResults ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          <p>No glossary terms found matching "{searchQuery}".</p>
          <button 
            className="btn-primary" 
            style={{ marginTop: '1rem', margin: '0 auto' }} 
            onClick={() => setSearchQuery('')}
          >
            Clear Search
          </button>
        </div>
      ) : (
        filteredGlossary.map(category => {
          const CategoryIcon = category.icon || ICON_MAP[category.iconType] || HelpCircle;

          return (
            <div key={category.title} style={{ marginBottom: '2.5rem' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border-color)',
                  paddingBottom: '0.5rem'
                }}
              >
                <CategoryIcon size={22} style={{ color: 'var(--accent-color)' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{category.title}</h3>
              </div>

              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
                  gap: '1rem' 
                }}
              >
                {category.terms.map(term => (
                  <div 
                    key={term.name} 
                    className="specs-card" 
                    style={{ 
                      padding: '1.25rem', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.5rem',
                      height: '100%' 
                    }}
                  >
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {term.name}
                    </h4>
                    <p style={{ fontSize: '0.9rem', lineHeight: '1.4', color: 'var(--text-secondary)' }}>
                      {term.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default GlossaryView;
