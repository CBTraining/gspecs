import React from 'react';
import { getPersonaColor } from '../../utils/persona';

const DetailHeader = ({ device }) => {
  return (
    <div className="detail-header-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 className="detail-header-title">{device['Device Name']}</h2>
          <div className="detail-header-subtitle">{device.Formfactor || device['OEM (brand)']}</div>
        </div>
        {device.Persona && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {device.Persona.split(',').map((p, i) => (
              <span key={i} className="persona-tag" style={{ backgroundColor: getPersonaColor(p) }}>
                {p.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailHeader;
