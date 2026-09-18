export const PERSONA_OPTIONS = [
  { key: 'Everyday User', label: 'Everyday Browsing & Tasks', desc: 'Social media, email, video streaming, and casual web use.' },
  { key: 'Student', label: 'School & Study', desc: 'Writing papers, taking notes, reading textbooks, and research.' },
  { key: 'Content Creator', label: 'Content Creation & Design', desc: 'Photo editing, video production, graphic design, and rendering.' },
  { key: 'Professional', label: 'Office & Professional Work', desc: 'Heavy multitasking, sheets, video meetings, and business apps.' },
  { key: 'Gamer / Power User', label: 'Gaming & Performance', desc: 'High performance gaming, virtualization, compilation, and power tasks.' }
];

export const BUDGET_OPTIONS = [
  { value: 400, label: 'Entry Level (Under $400)', desc: 'Affordable, essential features for basic needs.' },
  { value: 700, label: 'Mid-Range (Under $700)', desc: 'Great value, balanced performance and portability.' },
  { value: 1000, label: 'Premium (Under $1000)', desc: 'Higher build quality, faster chips, and beautiful screens.' },
  { value: Infinity, label: 'Unlimited / Premium Flagship', desc: 'No budget bounds; show me the absolute best tech.' }
];

export const PORTABILITY_OPTIONS = [
  {
    key: 'portability',
    title: 'Ultra-Light & Portable',
    desc: 'I am always on the go. I need a lightweight device (under 3.2 lbs) that is easy to carry all day.'
  },
  {
    key: 'large-screen',
    title: 'Larger Display Space',
    desc: 'I want maximum screen real estate (14" or larger) to multitask comfortably with multiple windows open.'
  }
];

export const FEATURE_OPTIONS = [
  {
    key: 'touch',
    title: 'Touchscreen & Pen Support',
    desc: 'I want a touch-sensitive screen or tablet convertible mode for taking notes, sketching, and drawing.'
  },
  {
    key: 'battery',
    title: 'Long-Lasting Battery',
    desc: 'I need all-day battery life (11+ hours) so I don\'t have to carry a charger or hunt for outlets.'
  }
];
