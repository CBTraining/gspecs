import React, { useState, useMemo } from 'react';
import { Search, Monitor, Cpu, Cable, HelpCircle } from 'lucide-react';

const GLOSSARY_CATEGORIES = [
  {
    title: 'Display & Screen',
    icon: Monitor,
    terms: [
      { name: 'Color Accuracy', text: 'Measures how precisely the screen displays colors (e.g., sRGB, DCI-P3). Crucial for Content Creators, designers, and photographers who need exact color representation.' },
      { name: 'Screen Type', text: 'The display technology used (e.g., IPS LCD, OLED). Determines color vibrancy, contrast ratios, battery consumption, and viewing angles.' },
      { name: 'Screen Size', text: 'The diagonal measurement of the screen in inches. Smaller screens (10"-13") prioritize portability for students and travelers, while larger screens (15"-17") offer more workspace for multitasking.' },
      { name: 'Screen Brightness', text: 'Measured in nits. Higher values (300-400+ nits) mean the screen is easier to read in bright outdoor conditions or under direct light.' },
      { name: 'Pen Compatibility', text: 'Support for a digital stylus pen. Essential for students taking handwritten notes, designers sketching, or professionals marking up documents.' },
      { name: 'Refresh Rate', text: 'How many times per second the screen updates. Higher rates (e.g., 120Hz, 144Hz) mean smoother animation, scrolling, and gaming.' },
      { name: 'Aspect Ratio', text: 'The proportional relationship between screen width and height (e.g., 16:9 widescreen, 16:10 or 3:2 taller screens). Taller screens display more vertical content, ideal for productivity.' },
      { name: 'IPS', text: 'In-Plane Switching: A screen technology known for great colors and wide viewing angles.' },
      { name: 'OLED', text: 'Organic Light Emitting Diode: Provides perfect blacks, infinite contrast, and vibrant colors.' },
      { name: 'Touchscreen', text: 'Allows you to interact directly with the display using your fingers.' }
    ]
  },
  {
    title: 'Hardware & Performance',
    icon: Cpu,
    terms: [
      { name: 'Processor', text: 'The primary chip (CPU) responsible for executing instructions and running apps.' },
      { name: 'NPU', text: 'Neural Processing Unit: A specialized co-processor dedicated to accelerating AI tasks (like background blur or generative content) efficiently without draining CPU or battery power.' },
      { name: 'RAM', text: 'Random Access Memory: Short-term memory for active tasks. More RAM means better multitasking.' },
      { name: 'Storage', text: 'Permanent memory where all your files, OS, and applications are kept.' },
      { name: 'SSD', text: 'Solid State Drive: Faster, more reliable storage than older hard drives or eMMC.' },
      { name: 'eMMC', text: 'Embedded MultiMediaCard: Basic, affordable flash storage common in entry-level devices.' }
    ]
  },
  {
    title: 'Ports & Connectivity',
    icon: Cable,
    terms: [
      { name: 'Thunderbolt', text: 'A super-fast port standard (USB-C shape) for high-speed data transfer, video output, and charging.' },
      { name: 'HDMI', text: 'High-Definition Multimedia Interface: Standard port for connecting to external monitors, TVs, and projectors.' },
      { name: 'Wi-Fi', text: 'Wireless standard used for connecting to local networks and high-speed internet.' },
      { name: 'Bluetooth', text: 'Wireless standard for connecting peripherals like headphones, keyboards, mice, and stylus pens.' }
    ]
  },
  {
    title: 'General & Design',
    icon: HelpCircle,
    terms: [
      { name: 'MSRP', text: "Manufacturer's Suggested Retail Price. The baseline pricing guide for consumer comparison." },
      { name: 'Formfactor', text: 'The physical design of the device (e.g., Clamshell laptop, Tablet, 2-in-1 Convertible).' }
    ]
  }
];

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
          const CategoryIcon = category.icon;

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
