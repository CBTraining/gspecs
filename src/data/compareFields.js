import { Cpu, Monitor, Cable, Layers, DollarSign, Weight, Clock, Laptop, ShieldCheck } from 'lucide-react';

export const SPEC_ROWS = [
  { label: 'MSRP', key: 'MSRP', icon: DollarSign },
  { label: 'Processor', key: 'Processor', icon: Cpu },
  { label: 'NPU', key: 'NPU', icon: Cpu },
  { label: 'RAM / Memory', key: 'RAM/Memory', icon: Layers },
  { label: 'Storage', key: 'Storage', icon: Layers },
  { label: 'Screen Size', key: 'Screen Size', icon: Monitor },
  { label: 'Screen Type', key: 'Screen Type', icon: Monitor },
  { label: 'Resolution', key: 'Resolution', icon: Monitor },
  { label: 'Color Accuracy', key: 'Color Accuracy', icon: Monitor },
  { label: 'Aspect Ratio', key: 'Aspect Ratio', icon: Monitor },
  { label: 'Screen Brightness', key: 'Screen Brightness (nits)', icon: Monitor, suffix: ' nits' },
  { label: 'Touchscreen', key: 'Touchscreen?', icon: Monitor },
  { label: 'Pen Compatibility', key: 'Pen Compatibility?', icon: Monitor },
  { label: 'External Monitors', key: 'External Monitors', icon: Monitor },
  { label: 'Battery Life', key: 'Battery Life (h)', fallbackKey: 'Battery Life', icon: Clock, suffix: ' hrs' },
  { label: 'Weight', key: 'Weight (lbs)', fallbackKey: 'Weight', icon: Weight },
  { label: 'Form Factor', key: 'Formfactor', icon: Laptop },
  { label: 'Ports', key: 'Ports', icon: Cable },
  { label: 'HDMI', key: 'HDMI', icon: Cable },
  { label: 'Thunderbolt', key: 'Thunderbolt', fallbackKey: 'Thunderbolt 4', icon: Cable },
  { label: 'MicroSD Slot', key: 'MicroSD Slot', icon: Cable },
  { label: 'Network Card', key: 'Network Card', icon: Cable },
  { label: 'Bluetooth Version', key: 'Bluetooth Version', icon: Cable },
  { label: 'Backlit Keyboard', key: 'Backlit Keyboard?', icon: Laptop },
  { label: 'Keyboard Size', key: 'Keyboard size', icon: Laptop },
  { label: 'Security', key: 'Security', icon: ShieldCheck },
  { label: 'Build', key: 'Build', icon: Layers },
  { label: 'Extra Features', key: 'Extra Features', icon: Layers }
];

