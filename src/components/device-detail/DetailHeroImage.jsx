import React from 'react';
import ImageWithFallback from '../common/ImageWithFallback';

const DetailHeroImage = ({ device }) => {
  const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');
  const barcodeSrc = device.SKU ? `/barcodes/${device.SKU.replace(/[^a-zA-Z0-9_-]/g, '')}.png` : null;

  return (
    <div className="detail-image-card">
      <ImageWithFallback 
        src={device['Device Image']} 
        alt={device['Device Name']} 
        isLaptop={isLaptop} 
        size={120}
        className="detail-large-image"
        loading="eager"
        style={{ height: 'auto', maxHeight: '280px' }}
      />
      {barcodeSrc && (
        <img 
          src={barcodeSrc} 
          alt="Barcode" 
          className="detail-barcode" 
          loading="lazy" 
          onError={(e) => { e.currentTarget.style.display = 'none'; }} 
        />
      )}
    </div>
  );
};

export default DetailHeroImage;
