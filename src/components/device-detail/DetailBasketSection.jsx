import React from 'react';
import { ShoppingBag } from 'lucide-react';
import BasketItemTag from './BasketItemTag';

const DetailBasketSection = ({ recommendations }) => {
  if (!recommendations) return null;

  const items = String(recommendations)
    .split(',')
    .map(item => item.trim())
    .filter(item => item && !['none', 'n/a', 'check data', '0'].includes(item.toLowerCase()));
  if (items.length === 0) return null;

  return (
    <div className="specs-card" style={{ height: '100%' }}>
      <h3 className="specs-card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShoppingBag size={20} style={{ color: 'var(--text-secondary)' }} />
        <span>Basket Recommendations</span>
      </h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
        Tap any item to see why it fits this device and who looks for it.
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {items.map((item, idx) => (
          <BasketItemTag key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default DetailBasketSection;
