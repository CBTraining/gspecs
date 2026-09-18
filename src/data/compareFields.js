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
  { label: 'Battery Life', key: 'Battery Life', icon: Clock },
  { label: 'Weight', key: 'Weight', icon: Weight },
  { label: 'Form Factor', key: 'Formfactor', icon: Laptop },
  { label: 'Ports', key: 'Ports', icon: Cable },
  { label: 'Security', key: 'Security', icon: ShieldCheck },
  { label: 'Build', key: 'Build', icon: Layers },
  { label: 'USB-C Ports', key: 'USB-C', icon: Cable },
  { label: 'USB-A Ports', key: 'USB-A', icon: Cable },
  { label: 'HDMI', key: 'HDMI', icon: Cable },
  { label: 'Thunderbolt', key: 'Thunderbolt 4', icon: Cable }
];
