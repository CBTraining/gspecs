import { Cpu, Monitor, Cable, Layers, Info } from 'lucide-react';

/**
 * Standard known fields assigned to dedicated primary cards.
 */
export const KNOWN_SPEC_GROUPS = [
  {
    title: 'Specs',
    icon: Cpu,
    fields: [
      { label: 'MSRP', key: 'MSRP' },
      { label: 'Processor', key: 'Processor' },
      { label: 'NPU', key: 'NPU' },
      { label: 'RAM', key: 'RAM/Memory' },
      { label: 'Storage', key: 'Storage' },
      { label: 'Formfactor', key: 'Formfactor' }
    ]
  },
  {
    title: 'Display',
    icon: Monitor,
    disclaimer: "External monitor support reflects the maximum total displays supported by the CPU, which includes the device's built-in screen. The actual number of external monitors you can connect simultaneously is also limited by the available physical ports on the device.",
    fields: [
      { label: 'Screen Size', key: 'Screen Size' },
      { label: 'Screen Type', key: 'Screen Type' },
      { label: 'Resolution', key: 'Resolution' },
      { label: 'Aspect Ratio', key: 'Aspect Ratio' },
      { 
        label: 'Screen Brightness', 
        key: 'Screen Brightness (nits)',
        format: (val) => {
          if (!val) return '';
          const str = String(val).trim();
          return /nit/i.test(str) ? str : `${str} nits`;
        }
      },
      { label: 'Color Accuracy', key: 'Color Accuracy' },
      { label: 'Touchscreen', key: 'Touchscreen?' },
      { label: 'Pen Compatibility', key: 'Pen Compatibility?' },
      { label: 'External Monitors', key: 'External Monitors' }
    ]
  },
  {
    title: 'Ports & Connectivity',
    icon: Cable,
    fields: [
      { label: 'Ports', key: 'Ports' },
      { label: 'USB-A', key: 'USB-A' },
      { label: 'USB-C', key: 'USB-C' },
      { label: 'Thunderbolt 4', key: 'Thunderbolt 4' },
      { label: 'Thunderbolt', key: 'Thunderbolt' },
      { label: 'HDMI', key: 'HDMI' },
      { label: 'MicroSD Slot', key: 'MicroSD Slot' },
      { label: 'SD Card Slot', key: 'SD Card Slot' },
      { label: 'Headphone Jack', key: 'Headphone Jack' },
      { label: 'Network Card', key: 'Network Card' },
      { label: 'Wi-Fi standard', key: 'Wi-Fi standard' },
      { label: 'Bluetooth Version', key: 'Bluetooth Version' }
    ]
  },
  {
    title: 'Other',
    icon: Layers,
    fields: [
      { label: 'Build', key: 'Build' },
      { label: 'Security', key: 'Security' },
      { label: 'Keyboard Size', key: 'Keyboard size' },
      { label: 'Backlit Keyboard', key: 'Backlit Keyboard?' },
      { label: 'Weight', key: 'Weight (lbs)' },
      { label: 'Weight', key: 'Weight' },
      { 
        label: 'Battery Life', 
        key: 'Battery Life (h)',
        format: (val) => {
          if (!val) return '';
          const str = String(val).trim();
          return /h|hr|hour/i.test(str) ? str : `${str} hrs`;
        }
      },
      { label: 'Battery Life', key: 'Battery Life' },
      { label: 'Extra Features', key: 'Extra Features' }
    ]
  }
];

/**
 * Columns reserved for header, image, barcode, or custom layout sections.
 * Any other column in devices.csv will automatically appear under "Additional Details".
 */
export const INTERNAL_RESERVED_COLUMNS = new Set([
  'Device',
  'Device Name',
  'Current',
  'Device Image',
  'Drive Thumbnail',
  'OEM (brand)',
  'Device Online Listing',
  'UPC',
  'SKU',
  'Barcode',
  'Persona',
  'Persona Extended',
  'Basket Recommendations',
  'About',
  'about'
]);

const isMeaningfulSpecValue = (val) => {
  if (val === undefined || val === null) return false;
  const norm = String(val).trim().toLowerCase();
  return norm !== '' && norm !== 'none' && norm !== 'n/a' && norm !== 'check data';
};

/**
 * Builds the list of spec groups for a given device.
 * Any unrecognized column in the CSV is dynamically collected into an "Additional Details" card.
 */
export const getDeviceSpecGroups = (device) => {
  if (!device) return [];

  const mappedKeys = new Set();
  const groups = [];

  // 1. Process known groups
  for (const group of KNOWN_SPEC_GROUPS) {
    const items = [];
    const seenLabels = new Set();
    for (const field of group.fields) {
      mappedKeys.add(field.key);
      const rawVal = device[field.key];
      if (isMeaningfulSpecValue(rawVal)) {
        const label = field.label || field.key;
        if (seenLabels.has(label)) continue;
        const displayVal = field.format ? field.format(rawVal) : String(rawVal).trim();
        if (isMeaningfulSpecValue(displayVal)) {
          seenLabels.add(label);
          items.push({
            label,
            value: displayVal
          });
        }
      }
    }
    if (items.length > 0) {
      groups.push({
        title: group.title,
        icon: group.icon,
        disclaimer: group.disclaimer,
        items
      });
    }
  }

  // 2. Dynamically gather all remaining unmapped columns
  const unmappedItems = [];
  for (const [key, value] of Object.entries(device)) {
    if (
      !INTERNAL_RESERVED_COLUMNS.has(key) &&
      !mappedKeys.has(key) &&
      isMeaningfulSpecValue(value)
    ) {
      // Strip trailing question marks from headers like "Cellular?" -> "Cellular"
      const cleanLabel = key.replace(/\?$/, '');
      unmappedItems.push({
        label: cleanLabel,
        value: String(value).trim()
      });
    }
  }

  if (unmappedItems.length > 0) {
    groups.push({
      title: 'Additional Details',
      icon: Info,
      items: unmappedItems
    });
  }

  return groups;
};
