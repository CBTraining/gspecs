import React from 'react';
import { Laptop, TrendingUp, BookOpen, LayoutGrid } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
  return (
    <nav className="bottom-nav" style={{ zIndex: 150 }}>
      <div 
        className={`nav-item ${activeTab === 'devices' ? 'active' : ''}`} 
        onClick={() => onTabChange('devices')}
      >
        <Laptop size={24} />
        <span>Devices</span>
      </div>
      <div 
        className={`nav-item ${activeTab === 'stepup' ? 'active' : ''}`} 
        onClick={() => onTabChange('stepup')}
      >
        <TrendingUp size={24} />
        <span>Step Up</span>
      </div>
      <div 
        className={`nav-item ${activeTab === 'appindex' ? 'active' : ''}`} 
        onClick={() => onTabChange('appindex')}
      >
        <LayoutGrid size={24} />
        <span>App Index</span>
      </div>
      <div 
        className={`nav-item ${activeTab === 'glossary' ? 'active' : ''}`} 
        onClick={() => onTabChange('glossary')}
      >
        <BookOpen size={24} />
        <span>Glossary</span>
      </div>
    </nav>
  );
};

export default BottomNav;
