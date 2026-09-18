export function filterDevices(devices, activeFilters = {}, searchQuery = '') {
  const query = searchQuery.trim().toLowerCase();
  const hasQuery = query.length > 0;

  // Pre-process active filters outside device iteration
  const priceRange = activeFilters.priceRange;
  const hasPriceFilter = Boolean(priceRange && Array.isArray(priceRange) && priceRange.length === 2);
  const minPrice = hasPriceFilter ? priceRange[0] : 0;
  const maxPrice = hasPriceFilter ? priceRange[1] : Infinity;

  // Normalize Device filter options once
  const rawDeviceFilters = activeFilters.Device;
  const hasDeviceFilter = Boolean(rawDeviceFilters && rawDeviceFilters.length > 0);
  const deviceNormFilters = hasDeviceFilter
    ? rawDeviceFilters.map(v => v.toLowerCase().replace(/s$/, ''))
    : null;

  // Other category filters (excluding priceRange and Device)
  const categoryFilters = Object.entries(activeFilters).filter(([k, v]) => {
    return k !== 'priceRange' && k !== 'Device' && Array.isArray(v) && v.length > 0;
  });
  const hasCategoryFilters = categoryFilters.length > 0;

  return devices.filter(device => {
    // 1. Search Query Filter
    if (hasQuery) {
      const nameMatch = device['Device Name']?.toLowerCase()?.includes(query);
      const skuMatch = device.SKU?.toLowerCase()?.includes(query);
      const processorMatch = device.Processor?.toLowerCase()?.includes(query);
      const brandMatch = device['OEM (brand)']?.toLowerCase()?.includes(query);
      const personaMatch = device.Persona?.toLowerCase()?.includes(query);

      if (!nameMatch && !skuMatch && !processorMatch && !brandMatch && !personaMatch) {
        return false;
      }
    }

    // 2. Price Range Filter
    if (hasPriceFilter) {
      const price = Number(device.MSRP?.replace(/[^0-9.]/g, '') || 0);
      if (price < minPrice || price > maxPrice) {
        return false;
      }
    }

    // 3. Device Type Filter
    if (hasDeviceFilter) {
      const deviceVal = (device.Device || '').toLowerCase().replace(/s$/, '');
      const matches = deviceNormFilters.some(v => {
        if (v.includes('google') && (deviceVal.includes('google') || deviceVal.includes('graggle'))) return true;
        if (v.includes('chrome') && (deviceVal.includes('chrome') || deviceVal.includes('chromer'))) return true;
        return deviceVal.includes(v) || v.includes(deviceVal);
      });
      if (!matches) return false;
    }

    // 4. Other Category Filters
    if (hasCategoryFilters) {
      for (let i = 0; i < categoryFilters.length; i++) {
        const [key, selectedValues] = categoryFilters[i];
        if (!selectedValues.includes(device[key])) {
          return false;
        }
      }
    }

    return true;
  });
}
