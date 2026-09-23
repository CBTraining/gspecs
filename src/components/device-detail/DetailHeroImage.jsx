import React, { useState, useEffect } from 'react';
import ImageWithFallback from '../common/ImageWithFallback';

export const getBarcodeUrl = (device) => {
  if (!device) return null;

  const rawBarcode = (device['Barcode'] || device.Barcode || '').trim();

  // 1. Direct image URL (http / https / data)
  if (rawBarcode.startsWith('http://') || rawBarcode.startsWith('https://') || rawBarcode.startsWith('data:')) {
    return rawBarcode;
  }

  // 2. Extracted from IMAGE("...") formula if raw formula string exists
  if (rawBarcode.startsWith('=IMAGE') || rawBarcode.startsWith('IMAGE')) {
    const match = rawBarcode.match(/IMAGE\s*\(\s*["']([^"']+)["']/i);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 3. Raw barcode / UPC in Column L
  if (rawBarcode && rawBarcode.toLowerCase() !== 'none') {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(rawBarcode)}&code=UPCA`;
  }

  // 4. Column L formula in sheet is =IMAGE("https://barcode.tec-it.com/barcode.ashx?data=" & ENCODEURL(J2) & "&code=UPCA")
  // where J2 is the UPC column (Column J).
  const code = String(device['UPC'] || device['SKU'] || '').trim();
  if (code && code.toLowerCase() !== 'none') {
    return `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(code)}&code=UPCA`;
  }

  return null;
};

const DetailHeroImage = ({ device }) => {
  const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');

  const primaryBarcode = getBarcodeUrl(device);
  const cleanSku = device.SKU ? String(device.SKU).replace(/[^a-zA-Z0-9_-]/g, '') : null;
  const localBarcode = cleanSku ? `${import.meta.env.BASE_URL}barcodes/${cleanSku}.png` : null;

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
