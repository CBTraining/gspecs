/**
 * Contextual sales and customer rationale for accessories in the Basket Recommendations.
 * Explains "Why it is good for the basket" and "What kind of customer looks for this".
 */
export const BASKET_ITEM_DETAILS = {
  'wireless mouse': {
    why: 'Much faster and more comfortable than using a trackpad all day, preventing wrist fatigue during extended study or work sessions.',
    customer: 'Students, remote workers, and anyone using their laptop at a desk for more than an hour at a time.'
  },
  'bluetooth mouse': {
    why: 'Connects wirelessly without plugging in a USB receiver, freeing up limited laptop ports and eliminating lost dongles.',
    customer: 'Travelers, commuters, tablet/convertible users, and anyone with a slim laptop that has only USB-C ports.'
  },
  'usb mouse': {
    why: 'Simple, reliable plug-and-play pointer that works instantly out of the box with no batteries to charge or replace.',
    customer: 'Budget-conscious shoppers, kids, classrooms, and customers wanting fuss-free reliability.'
  },
  'gaming mouse': {
    why: 'High-precision optical sensor with responsive click switches and programmable side buttons for fast gaming reactions and workflow shortcuts.',
    customer: 'Gamers playing cloud or local games, as well as power users who want quick tactile shortcuts.'
  },
  'laptop sleeve': {
    why: 'Essential everyday protection against bumps, zipper scratches, and minor spills inside a backpack, briefcase, or tote.',
    customer: 'Students, commuters, and travelers carrying their laptop to school, work, or coffee shops.'
  },
  '10-inch tablet sleeve': {
    why: 'Compact, form-fitting padded case tailored for 10-to-11-inch tablets and detachables so they stay snug and protected inside larger bags.',
    customer: 'Students and mobile users carrying lightweight compact tablets, detachables, or e-readers.'
  },
  'usb-c flash drive': {
    why: 'Plugs directly into modern USB-C ports to quickly move photos, school assignments, and large files between laptops, phones, and tablets without internet.',
    customer: 'Students, creators, and Android phone users needing fast offline file transfers between their mobile device and laptop.'
  },
  'usb flash drive': {
    why: 'Affordable, universal storage for taking documents, presentations, and assignments to school, the library, or print shops.',
    customer: 'Students, teachers, and everyday users who need an easy way to hand in or print physical files.'
  },
  'usb-a flash drive': {
    why: 'Compatible with traditional rectangular USB ports, perfect for library computers, print kiosks, and older desktop PCs.',
    customer: 'Anyone sharing files with older family computers, school lab PCs, or office workstations.'
  },
  'microsd card': {
    why: 'Inexpensive, flush-fit storage expansion that permanently expands internal space for offline Netflix/streaming downloads, photos, and music.',
    customer: 'Buyers getting a 64GB or 128GB laptop who want peace of mind that they will not run out of storage down the road.'
  },
  'external hard drive': {
    why: 'High-capacity, budget-friendly storage (1TB–5TB) for bulk backups of family photo libraries, home videos, and system files.',
    customer: 'Families, photographers, and users with years of photos and personal archives to safeguard in one safe place.'
  },
  'external ssd': {
    why: 'Fast, durable solid-state storage with no moving parts—withstands drops and transfers large files up to 5x faster than mechanical drives.',
    customer: 'Content creators, students editing video/audio, and power users who value speed and drop durability.'
  },
  'portable external ssd': {
    why: 'Rugged, pocket-sized solid-state storage built for travel—immune to bumps and drops while moving large files on the road.',
    customer: 'Hybrid workers, traveling photographers, and on-the-go professionals working out of cafes and airports.'
  },
  'usb-c hub': {
    why: 'Converts one USB-C port into multiple USB-A ports, an SD card reader, and display outputs so older accessories plug right in.',
    customer: 'Users with standard flash drives, wired mice, or memory cards who bought a modern laptop with mostly USB-C ports.'
  },
  'usb-c multiport adapter': {
    why: 'Compact all-in-one travel adapter that combines HDMI video, standard USB, and pass-through USB-C charging through a single cord.',
    customer: 'Professionals presenting in meeting rooms, teachers, and hybrid workers moving between home and office desks.'
  },
  'usb-c to hdmi adapter': {
    why: 'Instant connection from a USB-C laptop to any TV, monitor, or conference room projector with no software setup required.',
    customer: 'Students connecting to dorm TVs, teachers presenting slides, and remote workers adding an external monitor.'
  },
  'hdmi cable': {
    why: 'Reliable, direct video and audio link to hook up an external monitor for dual-screen multitasking or stream movies to a TV.',
    customer: 'Work-from-home users wanting dual screens, dorm students using a TV, and desktop workstation users.'
  },
  'stylus pen': {
    why: 'Natural pen-on-paper precision for digital handwriting, signing documents, sketching, highlighting textbooks, and solving math problems.',
    customer: 'Students taking handwritten lecture notes, digital artists, teachers, and anyone buying a touchscreen or 2-in-1 convertible.'
  },
  'wired headphones': {
    why: 'Zero-lag audio that never runs out of battery, has no Bluetooth pairing issues, and is compliant with school testing rules.',
    customer: 'K-12 students taking standardized school tests, online test takers, and Zoom call attendees.'
  },
  'bluetooth headphones': {
    why: 'Tangle-free wireless listening with long battery life, letting you walk around while listening to lectures, music, or video calls.',
    customer: 'Commuters, students studying in libraries or cafes, and anyone tired of headphone cords.'
  },
  'gaming headset': {
    why: 'Comfortable over-ear earcups for long sessions, directional audio for game awareness, and a clear boom microphone for team chat.',
    customer: 'Gamers playing online with friends, Discord users, and anyone in noisy rooms needing voice clarity.'
  },
  'laptop stand': {
    why: 'Raises the laptop screen to eye level to prevent neck and back strain, while increasing underneath airflow for cooler operation.',
    customer: 'Remote workers, desk setups, and college students spending long study sessions at a desk.'
  },
  'laptop cooling pad': {
    why: 'Dual or multi-fan base that pushes cool air into laptop vents, keeping temperatures down during heavy gaming or multitasking sessions.',
    customer: 'Gamers and power users running demanding applications who want sustained peak performance.'
  },
  'portable power bank': {
    why: 'High-wattage USB-C Power Delivery (PD) battery pack that can recharge both your laptop and phone away from wall outlets.',
    customer: 'Frequent travelers, outdoor workers, college students on campus all day, and emergency prep.'
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
