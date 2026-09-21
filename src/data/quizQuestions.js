import {
  PenTool,
  Laptop,
  Palette,
  Maximize2,
  Feather,
  Cable,
  Zap,
  Wifi,
  BatteryCharging,
  Cpu,
  ScanFace,
  Fingerprint
} from 'lucide-react';

export const QUIZ_QUESTIONS = [
  {
    id: 'formfactor',
    stepNumber: 1,
    title: 'Form Factor & Input Style',
    subtitle: 'How does the customer prefer to use and interact with their device?',
    options: [
      {
        key: '2in1',
        title: '2-in-1 Convertible with Stylus Pen Support',
        desc: 'Folds 360° into a tablet. Ideal for drawing, sketching, digital signatures, and handwritten notes with USI pen support.',
        icon: PenTool,
        badge: 'Touch & Pen'
      },
      {
        key: 'clamshell',
        title: 'Classic Clamshell Laptop',
        desc: 'Traditional rigid clamshell design with a sturdy hinge, full keyboard, and large glass trackpad for focused desk productivity.',
        icon: Laptop,
        badge: 'Classic Notebook'
      }
    ]
  },
  {
    id: 'display',
    stepNumber: 2,
    title: 'Display & Screen Priority',
    subtitle: 'What visual qualities matter most for their daily workflow?',
    options: [
      {
        key: 'color-oled',
        title: 'Cinema-Grade OLED (100% DCI-P3 Color)',
        desc: 'Deep blacks, vibrant contrast, and Hollywood-standard color accuracy for creative photo/video editing, media, and design.',
        icon: Palette,
        badge: 'OLED / Creative'
      },
      {
        key: 'large-screen',
        title: 'Maximum Screen Space (15.3" Large Display)',
        desc: 'Maximum visual real estate for comfortable side-by-side split screens, large spreadsheets, and multi-window work without an external monitor.',
        icon: Maximize2,
        badge: '15.3" Display'
      },
      {
        key: 'ultra-portable',
        title: 'Featherlight & Ultra-Compact (13.4" - 14", ~2.2 lbs)',
        desc: 'Extremely thin and lightweight for frequent travelers, commuters, and students who need the smallest, lightest bag footprint.',
        icon: Feather,
        badge: '2.2 lbs Ultraportable'
      }
    ]
  },
  {
    id: 'ports',
    stepNumber: 3,
    title: 'Ports & External Connectivity',
    subtitle: 'What accessories and displays will they plug in on a regular basis?',
    options: [
      {
        key: 'full-ports',
        title: 'Built-in HDMI & Legacy USB-A (Dongle-Free)',
        desc: 'Plugs directly into conference room projectors, external monitors, and standard USB-A flash drives without carrying adapters.',
        icon: Cable,
        badge: 'HDMI & USB-A'
      },
      {
        key: 'thunderbolt',
        title: 'Dual Thunderbolt 4 / High-Speed USB-C',
        desc: 'Single-cable desk docking stations, multi-stream 4K/8K displays, and 40Gbps external high-speed storage.',
        icon: Zap,
        badge: 'Thunderbolt 4'
      },
      {
        key: 'minimal-usbc',
        title: 'Clean Minimalist USB-C Only',
        desc: 'Fully cloud and wireless workflow. Prefers a razor-thin chassis with streamlined dual USB-C ports.',
        icon: Wifi,
        badge: 'Pure USB-C'
      }
    ]
  },
  {
    id: 'platform',
    stepNumber: 4,
    title: 'Battery Life & Processor Architecture',
    subtitle: 'What balance of endurance and processing platform do they need?',
    options: [
      {
        key: 'extreme-battery',
        title: 'Extreme All-Day Battery (18–19+ Hours)',
        desc: 'Powered by ultra-efficient Snapdragon X Elite processor. Work multiple days or cross-country flights without bringing a charger.',
        icon: BatteryCharging,
        badge: '18-19h Battery'
      },
      {
        key: 'intel-core',
        title: 'Intel Core Ultra Platform with AI Boost',
        desc: 'Powered by Intel Core Ultra with dedicated Intel AI Boost NPU, broad x86 enterprise compatibility, and Thunderbolt 4 support.',
        icon: Cpu,
        badge: 'Intel Core Ultra'
      }
    ]
  },
  {
    id: 'security',
    stepNumber: 5,
    title: 'Security & Biometric Sign-in',
    subtitle: 'How do they prefer to unlock their laptop quickly and securely?',
    options: [
      {
        key: 'face-and-fingerprint',
        title: 'Dual Biometrics: Facial Recognition + Fingerprint',
        desc: 'Hands-free instant login the moment the lid is opened with face authentication, plus a fingerprint sensor backup.',
        icon: ScanFace,
        badge: 'Face + Fingerprint'
      },
      {
        key: 'fingerprint-only',
        title: 'Fast Touch Fingerprint Sensor',
        desc: 'Simple, secure touch fingerprint reader integrated into the power button or keyboard deck.',
        icon: Fingerprint,
        badge: 'Fingerprint'
      }
    ]
  }
];
