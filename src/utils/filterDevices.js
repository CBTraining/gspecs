export function filterDevices(devices, activeFilters, searchQuery) {
  return devices.filter(device => {
    // 1. Search Query Filter
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const nameMatch = device['Device Name']?.toLowerCase()?.includes(query);
      const skuMatch = device.SKU?.toLowerCase()?.includes(query);
      const processorMatch = device.Processor?.toLowerCase()?.includes(query);
      const brandMatch = device['OEM (brand)']?.toLowerCase()?.includes(query);
      const personaMatch = device.Persona?.toLowerCase()?.includes(query);
      
      if (!nameMatch && !skuMatch && !processorMatch && !brandMatch && !personaMatch) {
        return false;
      }
    }

    // 2. Active Category Filters
    for (const [key, selectedValues] of Object.entries(activeFilters)) {
      if (key === 'priceRange') {
        const price = Number(device.MSRP?.replace(/[^0-9.]/g, '') || 0);
        if (price < selectedValues[0] || price > selectedValues[1]) {
          return false;
        }
        continue;
      }
      if (!selectedValues || selectedValues.length === 0) continue;

      if (key === 'Device') {
        const deviceVal = (device.Device || '').toLowerCase().replace(/s$/, '');
        const matches = selectedValues.some(val => {
          const v = val.toLowerCase().replace(/s$/, '');
          if (v.includes('google') && (deviceVal.includes('google') || deviceVal.includes('graggle'))) return true;
          if (v.includes('chrome') && (deviceVal.includes('chrome') || deviceVal.includes('chromer'))) return true;
          return deviceVal.includes(v) || v.includes(deviceVal);
        });
        if (!matches) return false;
        continue;
      }

      if (!selectedValues.includes(device[key])) {
        return false;
      }
    }
    return true;
  });
}
