import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun, Laptop, ArrowLeft, BookOpen, Scan, TrendingUp, LayoutGrid } from 'lucide-react';

const Header = ({
  selectedDevice,
  onBack,
  theme,
  toggleTheme,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="app-header" style={{ zIndex: 150 }}>
      <div className="app-header-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AnimatePresence>
            {selectedDevice && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: 'auto' }}
                exit={{ opacity: 0, scale: 0.8, width: 0 }}
                className="btn-icon" 
                onClick={onBack} 
                aria-label="Go Back"
                style={{ padding: 0 }}
              >
                <ArrowLeft size={28} />
              </motion.button>
            )}
          </AnimatePresence>
          
          <div className="app-title">
            <img 
              src={theme === 'dark' ? `${import.meta.env.BASE_URL}gspecs_light.svg` : `${import.meta.env.BASE_URL}gspecs_dark.svg`} 
              alt="G-Specs" 
              style={{ height: '28px' }} 
            />
          </div>
        </div>

        <nav className="desktop-nav">
          <div 
            className={`nav-item ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => onTabChange('devices')}
          >
            <Laptop size={20} />
            <span>Devices</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'stepup' ? 'active' : ''}`}
            onClick={() => onTabChange('stepup')}
          >
            <TrendingUp size={20} />
            <span>Step Up</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'appindex' ? 'active' : ''}`}
            onClick={() => onTabChange('appindex')}
          >
            <LayoutGrid size={20} />
            <span>App Index</span>
          </div>
          <div 
            className={`nav-item ${activeTab === 'glossary' ? 'active' : ''}`}
            onClick={() => onTabChange('glossary')}
          >
            <BookOpen size={20} />
            <span>Glossary</span>
          </div>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            className="btn-icon" 
            onClick={() => alert('Barcode Scanner not developed yet.')} 
            aria-label="Scan Barcode"
            style={{ marginRight: '0.25rem' }}
          >
            <Scan size={24} />
          </button>
          <button className="btn-icon" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={24} /> : <Sun size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
