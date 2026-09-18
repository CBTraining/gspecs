import React from 'react';
import { Laptop, Smartphone } from 'lucide-react';
import { SPEC_ROWS } from '../../data/compareFields';

const CompareTable = ({ devices }) => {
  return (
    <table style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse', textAlign: 'left' }}>
      {/* Column Headers (Device Names and Images) */}
      <thead>
        <tr>
          <th style={{ 
            padding: '1rem', 
            width: '25%', 
            borderBottom: '2px solid var(--border-color)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            fontWeight: '600'
          }}>
            Device Details
          </th>
          {devices.map(device => {
            const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');
            return (
              <th 
                key={device.SKU} 
                style={{ 
                  padding: '1rem', 
                  width: `${75 / devices.length}%`, 
                  borderBottom: '2px solid var(--border-color)',
                  textAlign: 'center',
                  verticalAlign: 'top'
                }}
              >
                <div style={{ 
                  width: '100%', 
                  height: '100px', 
                  backgroundColor: '#ffffff',
                  borderRadius: '0.75rem',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                  border: '1px solid var(--border-color)',
                  overflow: 'hidden'
                }}>
                  {device['Device Image'] ? (
                    <img 
                      src={device['Device Image']} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    isLaptop ? <Laptop size={32} color="var(--text-secondary)" /> : <Smartphone size={32} color="var(--text-secondary)" />
                  )}
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {device['Device Name']}
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>
                  {device.SKU}
                </span>
              </th>
            );
          })}
        </tr>
      </thead>

      {/* Rows of specs */}
      <tbody>
        {SPEC_ROWS.map((row, idx) => {
          const RowIcon = row.icon;
          return (
            <tr 
              key={row.key} 
              style={{ 
                backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--surface-hover)',
                borderBottom: '1px solid var(--border-color)'
              }}
            >
              <td style={{ 
                padding: '0.85rem 1rem', 
                fontWeight: '600', 
                fontSize: '0.85rem', 
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <RowIcon size={16} style={{ color: 'var(--text-secondary)' }} />
                <span>{row.label}</span>
              </td>
              {devices.map(device => {
                let val = device[row.key];
                if (val && row.suffix && !String(val).endsWith(row.suffix)) {
                  val = `${val}${row.suffix}`;
                }

                const pillItems = typeof val === 'string' && !/^\$?\d{1,3}(,\d{3})+(\.\d+)?$/.test(val.trim()) && val.includes(',')
                  ? val.split(',').map(s => s.trim()).filter(Boolean)
                  : null;

                return (
                  <td 
                    key={device.SKU} 
                    style={{ 
                      padding: '0.85rem 1rem', 
                      textAlign: 'center', 
                      fontSize: '0.85rem',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {pillItems && pillItems.length > 1 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center' }}>
                        {pillItems.map((p, i) => (
                          <span key={i} className="spec-pill" style={{ fontSize: '0.78rem', padding: '0.2rem 0.55rem' }}>
                            {p}
                          </span>
                        ))}
                      </div>
                    ) : (
                      val || 'N/A'
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CompareTable;
