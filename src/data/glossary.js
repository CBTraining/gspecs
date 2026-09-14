export const GLOSSARY_MAP = {
  'color accuracy': 'Color Accuracy: Measures how precisely the screen displays colors (e.g., sRGB, DCI-P3). Crucial for Content Creators, designers, and photographers who need exact color representation.',
  'screen type': 'Screen Type: The display technology used (e.g., IPS LCD, OLED). Determines color vibrancy, contrast ratios, battery consumption, and viewing angles.',
  'screen size': 'Screen Size: The diagonal measurement of the screen in inches. Smaller screens (10"-13") prioritize portability for students and travelers, while larger screens (15"-17") offer more workspace for multitasking.',
  'screen brightness': 'Screen Brightness: Measured in nits. Higher values (300-400+ nits) mean the screen is easier to read in bright outdoor conditions or under direct light.',
  'pen compatibility': 'Pen Compatibility: Support for a digital stylus pen. Essential for students taking handwritten notes, designers sketching, or professionals marking up documents.',
  'refresh rate': 'Refresh Rate: How many times per second the screen updates. Higher rates (e.g., 120Hz, 144Hz) mean smoother animation, scrolling, and gaming.',
  'aspect ratio': 'Aspect Ratio: The proportional relationship between screen width and height (e.g., 16:9 widescreen, 16:10 or 3:2 taller screens). Taller screens display more vertical content, ideal for productivity.',
  'ips': 'In-Plane Switching: A screen technology known for great colors and wide viewing angles.',
  'oled': 'Organic Light Emitting Diode: Provides perfect blacks, infinite contrast, and vibrant colors.',
  'emmc': 'Embedded MultiMediaCard: Basic, affordable flash storage common in entry-level devices.',
  'ssd': 'Solid State Drive: Faster, more reliable storage than older hard drives or eMMC.',
  'ram': 'Random Access Memory: Short-term memory for active tasks. More RAM means better multitasking.',
  'npu': 'Neural Processing Unit: A specialized chip designed to accelerate AI tasks efficiently.',
  'processor': 'The primary chip (CPU) responsible for executing instructions and running apps.',
  'storage': 'Permanent memory where all your files, OS, and applications are kept.',
  'thunderbolt': 'A super-fast port standard (USB-C shape) for data, video, and charging.',
  'hdmi': 'High-Definition Multimedia Interface: Standard port for connecting to TVs and monitors.',
  'msrp': 'Manufacturer’s Suggested Retail Price.',
  'resolution': 'The number of pixels on the screen (width x height). Higher means sharper text and images.',
  'formfactor': 'The physical design of the device (e.g., Clamshell laptop, Tablet, 2-in-1 Convertible).',
  'wi-fi': 'Wireless standard used for connecting to local networks and the internet.',
  'bluetooth': 'Wireless standard for connecting peripherals like headphones and mice.',
  'touchscreen': 'Allows you to interact directly with the display using your fingers.',
};

export const GLOSSARY_CATEGORIES = [
  {
    title: 'Display & Screen',
    iconType: 'Monitor',
    terms: [
      { name: 'Color Accuracy', text: 'Measures how precisely the screen displays colors (e.g., sRGB, DCI-P3). Crucial for Content Creators, designers, and photographers who need exact color representation.' },
      { name: 'Screen Type', text: 'The display technology used (e.g., IPS LCD, OLED). Determines color vibrancy, contrast ratios, battery consumption, and viewing angles.' },
      { name: 'Screen Size', text: 'The diagonal measurement of the screen in inches. Smaller screens (10"-13") prioritize portability for students and travelers, while larger screens (15"-17") offer more workspace for multitasking.' },
      { name: 'Screen Brightness', text: 'Measured in nits. Higher values (300-400+ nits) mean the screen is easier to read in bright outdoor conditions or under direct light.' },
      { name: 'Pen Compatibility', text: 'Support for a digital stylus pen. Essential for students taking handwritten notes, designers sketching, or professionals marking up documents.' },
      { name: 'Refresh Rate', text: 'How many times per second the screen updates. Higher rates (e.g., 120Hz, 144Hz) mean smoother animation, scrolling, and gaming.' },
      { name: 'Aspect Ratio', text: 'The proportional relationship between screen width and height (e.g., 16:9 widescreen, 16:10 or 3:2 taller screens). Taller screens display more vertical content, ideal for productivity.' },
      { name: 'IPS', text: 'In-Plane Switching: A screen technology known for great colors and wide viewing angles.' },
      { name: 'OLED', text: 'Organic Light Emitting Diode: Provides perfect blacks, infinite contrast, and vibrant colors.' },
      { name: 'Touchscreen', text: 'Allows you to interact directly with the display using your fingers.' }
    ]
  },
  {
    title: 'Hardware & Performance',
    iconType: 'Cpu',
    terms: [
      { name: 'Processor', text: 'The primary chip (CPU) responsible for executing instructions and running apps.' },
      { name: 'NPU', text: 'Neural Processing Unit: A specialized co-processor dedicated to accelerating AI tasks (like background blur or generative content) efficiently without draining CPU or battery power.' },
      { name: 'RAM', text: 'Random Access Memory: Short-term memory for active tasks. More RAM means better multitasking.' },
      { name: 'Storage', text: 'Permanent memory where all your files, OS, and applications are kept.' },
      { name: 'SSD', text: 'Solid State Drive: Faster, more reliable storage than older hard drives or eMMC.' },
      { name: 'eMMC', text: 'Embedded MultiMediaCard: Basic, affordable flash storage common in entry-level devices.' }
    ]
  },
  {
    title: 'Ports & Connectivity',
    iconType: 'Cable',
    terms: [
      { name: 'Thunderbolt', text: 'A super-fast port standard (USB-C shape) for high-speed data transfer, video output, and charging.' },
      { name: 'HDMI', text: 'High-Definition Multimedia Interface: Standard port for connecting to external monitors, TVs, and projectors.' },
      { name: 'Wi-Fi', text: 'Wireless standard used for connecting to local networks and high-speed internet.' },
      { name: 'Bluetooth', text: 'Wireless standard for connecting peripherals like headphones, keyboards, mice, and stylus pens.' }
    ]
  },
  {
    title: 'General & Design',
    iconType: 'HelpCircle',
    terms: [
      { name: 'MSRP', text: "Manufacturer's Suggested Retail Price. The baseline pricing guide for consumer comparison." },
      { name: 'Formfactor', text: 'The physical design of the device (e.g., Clamshell laptop, Tablet, 2-in-1 Convertible).' }
    ]
  }
];
