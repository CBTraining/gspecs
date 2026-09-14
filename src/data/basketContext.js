/**
 * Contextual sales and customer rationale for accessories in the Basket Recommendations.
 * Explains "Why it is good for the basket" and "What kind of customer looks for this".
 */
export const BASKET_ITEM_DETAILS = {
  'wireless mouse': {
    why: 'Greatly increases navigation speed, ergonomic comfort, and precision compared to using a built-in laptop trackpad for extended hours.',
    customer: 'Everyday users, office workers, students, and anyone spending more than an hour at a desk.'
  },
  'bluetooth mouse': {
    why: 'Connects directly to the laptop without using up a valuable USB port or requiring an easily-lost USB dongle.',
    customer: 'Commuters, travelers, and minimalists with modern laptops that only have USB-C ports.'
  },
  'usb mouse': {
    why: 'Reliable, zero-lag, battery-free pointer that works instantly out of the box with no pairing needed.',
    customer: 'Budget-conscious shoppers, kids, classrooms, and customers wanting simple plug-and-play simplicity.'
  },
  'gaming mouse': {
    why: 'Offers ultra-responsive high-DPI tracking sensors, customizable side hotkeys, and ergonomic grip for fast reactions.',
    customer: 'Gamers, video editors, and power users who need rapid precision and tactile shortcut buttons.'
  },
  'laptop sleeve': {
    why: 'Protects the investment against scratches, spills, bumps, and accidental drops inside backpacks or totes.',
    customer: 'Students, daily commuters, travelers, and parents buying a laptop for school.'
  },
  '10-inch tablet sleeve': {
    why: 'Tailored snug protection designed for compact tablets and convertibles to keep the glass screen and edges safe on the move.',
    customer: 'On-the-go note-takers, commuters, and mobile users.'
  },
  'usb-c flash drive': {
    why: 'High-speed physical storage for quickly transferring homework, large media files, or backups without relying on Wi-Fi.',
    customer: 'College students, photographers, and professionals moving files between modern USB-C laptops and phones.'
  },
  'usb flash drive': {
    why: 'Universal, affordable storage stick for moving files, documents, and presentations between home, school, and library computers.',
    customer: 'Students, teachers, and budget everyday users needing simple file sharing.'
  },
  'usb-a flash drive': {
    why: 'Plugs directly into traditional rectangular USB ports, ideal for printing at kiosks, library PCs, or older desktop workstations.',
    customer: 'Everyday users and office staff needing cross-compatibility with legacy computers.'
  },
  'microsd card': {
    why: 'Inexpensive, permanent storage expansion that slides flush into the laptop’s slot to double or triple available space without sticking out.',
    customer: 'Users with 64GB–128GB laptops who need extra space for offline video downloads, music, and photo libraries.'
  },
  'external hard drive': {
    why: 'Massive multi-terabyte storage at an affordable price for backing up the entire computer, photo archives, and video libraries.',
    customer: 'Families, photographers, and content creators with huge media collections.'
  },
  'external ssd': {
    why: 'Lightning-fast, shock-resistant portable storage that edits 4K footage and transfers full system backups in seconds.',
    customer: 'Creative professionals, videographers, programmers, and gamers.'
  },
  'portable external ssd': {
    why: 'Pocket-sized, rugged solid-state drive built to survive drops while delivering blazingly fast file transfers on the road.',
    customer: 'Traveling creators, mobile professionals, and photographers working in the field.'
  },
  'usb-c hub': {
    why: 'Expands a single USB-C port into multiple USB-A ports, SD card slots, and HDMI—letting you connect all your existing accessories.',
    customer: 'Students and remote workers using modern slim laptops with limited built-in ports.'
  },
  'usb-c multiport adapter': {
    why: 'All-in-one travel dongle that allows simultaneous pass-through power charging, monitor hookup, and flash drive access.',
    customer: 'Business professionals and hybrid workers presenting in conference rooms and desk setups.'
  },
  'usb-c to hdmi adapter': {
    why: 'Bridges USB-C only laptops to existing HDTVs, computer monitors, and classroom projectors with zero lag.',
    customer: 'Remote employees, presenters, and students connecting to dorm TVs or monitors.'
  },
  'hdmi cable': {
    why: 'Direct plug-and-play video connection to dual-monitor workstation desks or living room televisions.',
    customer: 'Gamers, movie watchers, and desk workers setting up a second screen.'
  },
  'stylus pen': {
    why: 'Unlocks natural pen-on-paper handwriting, digital signatures, PDF highlighting, math notation, and digital art.',
    customer: 'Students taking lecture notes, architects, digital artists, and touchscreen convertible owners.'
  },
  'wired headphones': {
    why: 'Zero latency, no battery recharging needed, and guaranteed compatibility for video calls, testing, and private studying.',
    customer: 'Students taking online tests, remote workers on Zoom, and classrooms.'
  },
  'bluetooth headphones': {
    why: 'Cordless, hands-free listening with freedom of movement around the room while studying or watching videos.',
    customer: 'Commuters, fitness enthusiasts, and students who hate tangled cables.'
  },
  'gaming headset': {
    why: 'Spatial surround sound for locating game cues, paired with a crisp noise-canceling microphone for clear team voice chat.',
    customer: 'Competitive gamers, streamers, and Discord voice chat users.'
  },
  'laptop stand': {
    why: 'Elevates the screen to eye level to eliminate neck strain, while improving airflow beneath the laptop for cooler performance.',
    customer: 'Work-from-home professionals, desk setups, and students studying long hours.'
  },
  'laptop cooling pad': {
    why: 'Active powered fans direct airflow across the laptop bottom to prevent thermal throttling and boost sustained performance.',
    customer: 'Gamers and heavy content creators pushing CPU and GPU to the limit.'
  },
  'portable power bank': {
    why: 'High-wattage emergency battery backup to recharge laptops and phones anywhere without needing a wall outlet.',
    customer: 'Frequent flyers, campers, outdoor workers, and commuters with long transit times.'
  }
};

/**
 * Normalizes item names to match details cleanly.
 */
export const getBasketItemInfo = (itemName) => {
  if (!itemName) return null;
  const clean = itemName.trim().toLowerCase();

  if (BASKET_ITEM_DETAILS[clean]) {
    return BASKET_ITEM_DETAILS[clean];
  }

  // Fuzzy match fallback
  const matchKey = Object.keys(BASKET_ITEM_DETAILS).find(k => clean.includes(k) || k.includes(clean));
  if (matchKey) {
    return BASKET_ITEM_DETAILS[matchKey];
  }

  return {
    why: 'Complements the device to improve daily productivity, protection, or connectivity.',
    customer: 'Customers looking to maximize the functionality and lifespan of their new purchase.'
  };
};
