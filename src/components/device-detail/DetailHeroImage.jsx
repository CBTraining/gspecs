import React, { useState, useEffect } from 'react';
import ImageWithFallback from '../common/ImageWithFallback';
import { resolveBarcode } from '../../utils/barcode';
import { isLaptopDevice, cleanSku } from '../../utils/deviceUtils';

// Re-export for backwards compatibility
export const getBarcodeUrl = resolveBarcode;

const DetailHeroImage = ({ device }) => {
  const isLaptop = isLaptopDevice(device);

  const primaryBarcode = resolveBarcode(device);
  const skuCode = cleanSku(device.SKU);
  const localBarcode = skuCode ? `${import.meta.env.BASE_URL}barcodes/${skuCode}.png` : null;

  const [barcodeSrc, setBarcodeSrc] = useState(primaryBarcode || localBarcode);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setBarcodeSrc(primaryBarcode || localBarcode);
    setHasError(false);
  }, [primaryBarcode, localBarcode]);

  const handleBarcodeError = () => {
    // If the primary Column L barcode fails to load, gracefully fall back to local barcode asset
    if (barcodeSrc !== localBarcode && localBarcode) {
      setBarcodeSrc(localBarcode);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className="detail-image-card">
      <ImageWithFallback 
        src={device['Device Image']} 
        fallbackSrc={device['Drive Thumbnail']}
        alt={device['Device Name']} 
        isLaptop={isLaptop} 
        size={120}
        className="detail-large-image"
        loading="eager"
        style={{ height: 'auto', maxHeight: '280px' }}
      />
      {barcodeSrc && !hasError && (
        <img 
          src={barcodeSrc} 
          alt={`Barcode for ${device['Device Name'] || 'device'}`} 
          className="detail-barcode" 
          loading="lazy" 
          onError={handleBarcodeError} 
        />
      )}
    </div>
  );
};

export default DetailHeroImage;
