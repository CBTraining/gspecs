export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return parseInt(priceStr.replace(/[^0-9]/g, ''), 10) || 0;
};

export const getUpgrades = (prev, curr) => {
  if (!prev) return [];
  const upgrades = [];
  
  // CPU upgrade
  if (prev.Processor !== curr.Processor) {
    upgrades.push(`Processor: ${curr.Processor} (vs ${prev.Processor})`);
  }
  
  // RAM upgrade
  const prevRam = parseInt(prev['RAM/Memory']?.replace(/[^0-9]/g, ''), 10) || 0;
  const currRam = parseInt(curr['RAM/Memory']?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currRam > prevRam) {
    upgrades.push(`RAM: Upgraded to ${curr['RAM/Memory']} (from ${prev['RAM/Memory']})`);
  }
  
  // Storage upgrade
  const prevStorage = parseInt(prev.Storage?.replace(/[^0-9]/g, ''), 10) || 0;
  const currStorage = parseInt(curr.Storage?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currStorage > prevStorage) {
    upgrades.push(`Storage: Upgraded to ${curr.Storage} (from ${prev.Storage})`);
  }

  // NPU upgrade
  const prevNpu = parseInt(prev['NPU (TOPS)']?.replace(/[^0-9]/g, ''), 10) || 0;
  const currNpu = parseInt(curr['NPU (TOPS)']?.replace(/[^0-9]/g, ''), 10) || 0;
  if (currNpu > prevNpu) {
    upgrades.push(`NPU: Upgraded to ${curr['NPU (TOPS)']} (from ${prev['NPU (TOPS)']})`);
  }

  // Touchscreen upgrade
  if (prev['Touchscreen?']?.toLowerCase() === 'no' && curr['Touchscreen?']?.toLowerCase() === 'yes') {
    upgrades.push("Touchscreen: Added touchscreen support");
  }

  // Pen compatibility upgrade
  if (prev['Pen Compatibility?']?.toLowerCase() === 'no' && curr['Pen Compatibility?']?.toLowerCase() === 'yes') {
    upgrades.push("Pen: Added stylus pen compatibility");
  }

  // Screen type upgrade
  if (prev['Screen Type']?.toLowerCase().includes('ips') && curr['Screen Type']?.toLowerCase().includes('oled')) {
    upgrades.push(`Display: Upgraded from IPS LCD to OLED screen`);
  }

  // Screen size upgrade
  const prevSize = parseFloat(prev['Screen Size']?.replace(/[^0-9.]/g, '')) || 0;
  const currSize = parseFloat(curr['Screen Size']?.replace(/[^0-9.]/g, '')) || 0;
  if (currSize > prevSize) {
    upgrades.push(`Screen Size: Larger ${curr['Screen Size']} display (from ${prev['Screen Size']})`);
  }

  // Fallback: If no distinct hardware upgrades detected, note general OEM differences
  if (upgrades.length === 0 && prev['OEM (brand)'] !== curr['OEM (brand)']) {
    upgrades.push(`Design: Premium build by ${curr['OEM (brand)']} (vs ${prev['OEM (brand)']})`);
  }

  return upgrades;
};
