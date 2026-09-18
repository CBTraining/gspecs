import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { parsePrice, getUpgrades } from '../utils/stepUpLogic';
import StepUpTierCard from './stepup/StepUpTierCard';

const StepUpChart = ({ devices, onSelectDevice }) => {
  // Filter out any devices without valid price or SKU, then sort by price ascending
  const sortedDevices = useMemo(() => {
    if (!devices || devices.length === 0) return [];
    return [...devices]
      .filter(d => d.MSRP && d.SKU)
      .sort((a, b) => parsePrice(a.MSRP) - parsePrice(b.MSRP));
  }, [devices]);

  if (!devices || devices.length === 0) return null;

  return (
    <div style={{ padding: '0 0.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <TrendingUp size={24} style={{ color: 'var(--accent-color)' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Googlebook Step Up Guide</h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.4 }}>
          A visual progression ladder to help sales associates explain why higher-tier models command a premium price.
        </p>
      </div>

      <div className="step-up-ladder" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sortedDevices.map((device, index) => {
          const prevDevice = index > 0 ? sortedDevices[index - 1] : null;
          const upgrades = prevDevice ? getUpgrades(prevDevice, device) : [];
          
          const prevPrice = prevDevice ? parsePrice(prevDevice.MSRP) : 0;
          const currPrice = parsePrice(device.MSRP);
          const priceDiff = currPrice - prevPrice;

          return (
            <StepUpTierCard
              key={device.SKU}
              device={device}
              prevDevice={prevDevice}
              upgrades={upgrades}
              priceDiff={priceDiff}
              onSelectDevice={onSelectDevice}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StepUpChart;
