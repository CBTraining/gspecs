export const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return Number(priceStr.replace(/[^0-9.]/g, ''));
};

export const parseWeight = (weightStr) => {
  if (!weightStr) return 0;
  return Number(weightStr.replace(/[^0-9.]/g, ''));
};

export const parseBattery = (batteryStr) => {
  if (!batteryStr) return 0;
  return Number(batteryStr.replace(/[^0-9.]/g, ''));
};

export const calculateRecommendations = (devices, answers) => {
  if (!devices || devices.length === 0) return [];

  const scored = devices.map(device => {
    let score = 0;
    
    // 1. Persona match (40% weight)
    if (answers.persona && device.Persona === answers.persona) {
      score += 40;
    }

    // 2. Budget match (30% weight)
    const price = parsePrice(device.MSRP);
    if (price <= answers.budget) {
      score += 30;
    } else if (price <= answers.budget * 1.15) {
      score += 15;
    }

    // 3. Portability vs Screen Size match (15% weight)
    if (answers.portabilityVsScreen === 'portability') {
      const weight = parseWeight(device.Weight);
      if (weight > 0 && weight <= 3.2) score += 15;
    } else if (answers.portabilityVsScreen === 'large-screen') {
      const size = parseFloat(device['Screen Size']);
      if (size >= 14) score += 15;
    }

    // 4. Touchscreen vs Battery match (15% weight)
    if (answers.touchVsBattery === 'touch') {
      if (device['Touchscreen?'] === 'Yes') score += 15;
    } else if (answers.touchVsBattery === 'battery') {
      const hours = parseBattery(device['Battery Life']);
      if (hours >= 11) score += 15;
    }

    return {
      device,
      matchPercentage: score
    };
  });

  return scored
    .filter(item => item.matchPercentage > 0)
    .sort((a, b) => b.matchPercentage - a.matchPercentage)
    .slice(0, 3);
};
