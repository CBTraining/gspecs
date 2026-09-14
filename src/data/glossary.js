export const GLOSSARY_MAP = {
  'color accuracy': 'How true-to-life colors look. Standard screens (45% NTSC / 62.5% sRGB) are fine for general work, while high accuracy (100% sRGB or DCI-P3) gives vibrant, professional-grade colors for photo editing, video streaming, and graphic design.',
  'screen type': 'The display technology. IPS LCD gives great, consistent colors from any angle. OLED delivers deep true blacks and cinematic punch with vibrant contrast. Standard LCDs handle everyday school and office tasks well.',
  'screen size': 'Measured diagonally. 10"–13" is compact and backpack-friendly. 14" hits the sweet spot for everyday balance. 15"–17" gives a spacious canvas for side-by-side apps and working comfortably at a desk.',
  'screen brightness': 'How easily you can see the screen in light. 250 nits is best for typical indoor rooms; 300–400+ nits lets you work comfortably near bright windows, outdoor patios, or sunny coffee shops without squinting.',
  'pen compatibility': 'Lets you write directly on the glass with a digital stylus. Perfect for taking handwritten notes in class, annotating PDFs, signing documents, or sketching ideas like real paper.',
  'refresh rate': 'How many times per second the picture refreshes. Standard 60Hz is smooth for everyday tasks; 120Hz or higher makes scrolling web pages, navigating menus, and fast gaming feel noticeably more fluid.',
  'aspect ratio': 'The shape of your screen. 16:9 is classic widescreen (ideal for movies with less black bars). 16:10 and 3:2 are taller, giving you extra vertical room so you read documents and webpages without scrolling as much.',
  'ips': 'In-Plane Switching: A display tech that keeps colors looking rich and clear even when looking from the side or sharing your screen with someone next to you.',
  'oled': 'Organic Light Emitting Diode: Individual pixels light up and turn completely off. You get pitch-black dark scenes, lifelike contrast, and rich colors that make movies and photos pop.',
  'emmc': 'Basic, budget-friendly flash storage. Reliable and low-power for everyday web browsing, streaming, and saving Google Docs or homework.',
  'ssd': 'Solid State Drive: High-speed storage that boots up your computer in seconds, opens apps instantly, and transfers files much faster than older drives.',
  'ram': 'Your computer’s short-term memory. 4GB handles basic web browsing and homework; 8GB is great for everyday multitasking with dozens of browser tabs; 16GB+ keeps demanding apps, creative tools, and heavy workflows running effortlessly.',
  'npu': 'Neural Processing Unit: A dedicated smart chip for AI tasks (like automatic webcam background blur, noise removal, and live captions) without slowing down your computer or draining battery life.',
  'processor': 'The CPU or "engine" of the device. Faster processors (like Intel Core or AMD Ryzen) make everything launch snappier, smoothly run multiple apps, and handle demanding workloads.',
  'storage': 'The permanent digital closet on your device where your operating system, downloaded files, apps, photos, and offline documents live.',
  'thunderbolt': 'A supercharged USB-C port that handles high-speed file transfers, dual external monitors, and rapid charging all through one single cable.',
  'hdmi': 'The standard cable port for plugging your laptop directly into external monitors, living room TVs, or classroom projectors without adapters.',
  'msrp': 'The manufacturer’s regular suggested price when not on promotional sale or clearance.',
  'resolution': 'How many pixels make up the image. Full HD (1080p) gives crisp, clean text for reading and videos; higher resolutions (QHD / 4K) look razor-sharp.',
  'formfactor': 'The device’s body style: Clamshell is a traditional laptop; 2-in-1 Convertible flips 360° into a touchscreen tablet; Detachable lets you remove the keyboard completely.',
  'wi-fi': 'Your wireless connection to the internet. Wi-Fi 6 and 6E handle crowded home networks and stream smoothly even with lots of family devices online.',
  'bluetooth': 'Connects wireless accessories cord-free—like earbuds, wireless mice, keyboards, or drawing styluses.',
  'touchscreen': 'Lets you tap, pinch-to-zoom, and swipe directly on the glass display with your finger just like a smartphone or tablet.',
  'battery life': 'How long your laptop runs on a single charge. 10–14+ hours easily gets you through a full workday or school day without carrying a charger.',
  'weight': 'How heavy the laptop feels in your hands or bag. Under 3 lbs is ultraportable; 3–4 lbs is typical for 14"-15" laptops; over 4.5 lbs is common for larger workstation or gaming laptops.',
  'webcam': 'The front-facing camera used for video calls. 1080p FHD delivers significantly sharper, clearer video for remote meetings and family calls than older 720p cameras.',
  'camera': 'The camera used for video calling and photos. Higher resolution with privacy shutters keeps calls clear and secure.',
  'microsd': 'A miniature memory card slot that lets you quickly expand your storage or transfer photos directly from drones, cameras, or phones.',
  'backlit keyboard': 'Keys with gentle illumination underneath, letting you type accurately in dim bedrooms, late-night flights, or darkened rooms.',
  'keyboard': 'The physical typing keys. Full-size layouts include dedicated number pads, while compact layouts save desk and backpack space.',
  'usb-c': 'The modern reversible oval port used for charging, connecting displays, and transferring data quickly with modern accessories.',
  'usb-a': 'The traditional rectangular USB port used for connecting standard flash drives, mice, and older cables without needing an adapter.',
  'headphone': 'Standard 3.5mm audio jack for connecting wired headphones, headsets, or external speakers without wireless latency.',
  'cellular': 'Built-in 4G or 5G SIM card support, letting your laptop connect to the internet anywhere like a smartphone without needing Wi-Fi.'
};


export const GLOSSARY_CATEGORIES = [
  {
    title: 'Display & Screen',
    iconType: 'Monitor',
    terms: [
      { 
        name: 'Screen Brightness', 
        text: 'How bright the display gets. 250 nits is ideal for normal indoor lighting; 300–400+ nits lets you work comfortably near sunny windows, brightly lit classrooms, or outdoors without straining your eyes.' 
      },
      { 
        name: 'Screen Type', 
        text: 'The display technology. IPS LCD gives consistent colors from any viewing angle. OLED provides true pitch-blacks and rich contrast that make movies, photos, and games look stunning.' 
      },
      { 
        name: 'Color Accuracy', 
        text: 'How true-to-life colors look on screen. Basic ratings (45% NTSC / 62.5% sRGB) are fine for office and school tasks, while 100% sRGB or DCI-P3 is essential for digital art, photo editing, and creative work.' 
      },
      { 
        name: 'Pen Compatibility', 
        text: 'Supports an active digital pen or stylus. Great for handwriting notes in class, sketching diagrams, marking up PDFs, and signing digital forms naturally like pen on paper.' 
      },
      { 
        name: 'Touchscreen', 
        text: 'Allows direct touch interaction. Tap buttons, pinch-to-zoom photos, and swipe through websites directly on the screen with your fingers just like on a tablet.' 
      },
      { 
        name: 'Screen Size', 
        text: 'Measured diagonally. 10"–13" is lightweight and fits easily in small backpacks; 14" is the balanced sweet spot; 15"–17" gives expansive room for split-screen multitasking at a desk.' 
      },
      { 
        name: 'Resolution', 
        text: 'The clarity and detail of the picture. Full HD (1920x1080) keeps text sharp and readable for school and video streaming; higher resolutions deliver ultra-fine detail.' 
      },
      { 
        name: 'Aspect Ratio', 
        text: 'The screen shape. 16:9 is classic widescreen for movies; 16:10 and 3:2 are taller formats that fit more lines of text, reducing the need to scroll through documents and websites.' 
      },
      { 
        name: 'Refresh Rate', 
        text: 'How many times per second the image updates. Standard 60Hz is good for everyday use; 120Hz+ makes scrolling webpages, animations, and games feel silky smooth.' 
      },
      { 
        name: 'IPS', 
        text: 'In-Plane Switching: A display technology known for wide viewing angles and consistent colors, so the screen does not look washed out when viewed from the side.' 
      },
      { 
        name: 'OLED', 
        text: 'Organic Light Emitting Diode: Premium screen tech where individual pixels light up and shut off completely, producing true black levels, vibrant colors, and cinematic depth.' 
      }
    ]
  },
  {
    title: 'Hardware & Performance',
    iconType: 'Cpu',
    terms: [
      { 
        name: 'Processor', 
        text: 'The "engine" (CPU) of the laptop. More powerful processors handle heavy applications, photo editing, and multitasking smoothly without stuttering.' 
      },
      { 
        name: 'RAM', 
        text: 'Short-term working memory. 4GB handles basic single-task browsing; 8GB is the sweet spot for smooth multitasking with dozens of browser tabs; 16GB+ powers heavy creators and power users.' 
      },
      { 
        name: 'NPU', 
        text: 'Neural Processing Unit: A dedicated smart co-processor designed specifically for AI features—such as live webcam background blur, noise cancellation, and photo enhancement—without draining the battery.' 
      },
      { 
        name: 'Storage', 
        text: 'The digital storage closet on your device where your operating system, downloaded files, apps, photos, and offline documents live.' 
      },
      { 
        name: 'SSD', 
        text: 'Solid State Drive: High-speed flash storage that turns on your computer in seconds, launches apps instantly, and transfers large files rapidly.' 
      },
      { 
        name: 'eMMC', 
        text: 'Affordable, low-power flash storage commonly found in entry-level laptops for everyday homework, streaming, and cloud-based file saving.' 
      }
    ]
  },
  {
    title: 'Ports & Connectivity',
    iconType: 'Cable',
    terms: [
      { 
        name: 'Thunderbolt', 
        text: 'A high-speed USB-C port that can transfer large files in seconds, connect to dual external displays, and rapidly charge your device with one single cable.' 
      },
      { 
        name: 'HDMI', 
        text: 'The universal display port for plugging directly into televisions, external monitors, and conference projectors without needing a dongle or adapter.' 
      },
      { 
        name: 'Wi-Fi', 
        text: 'Wireless internet connectivity. Modern Wi-Fi 6 and 6E standards keep connections fast and reliable even in crowded homes with multiple family devices online.' 
      },
      { 
        name: 'Bluetooth', 
        text: 'Connects cordless accessories like wireless earbuds, keyboards, mice, and stylus pens.' 
      }
    ]
  },
  {
    title: 'General & Design',
    iconType: 'HelpCircle',
    terms: [
      { 
        name: 'Formfactor', 
        text: 'The physical shape: Clamshell is a traditional laptop; 2-in-1 Convertible rotates 360° into a tablet for drawing and touch; Detachable lets you remove the keyboard.' 
      },
      { 
        name: 'MSRP', 
        text: "Manufacturer's Suggested Retail Price. The baseline retail benchmark before sales, promotions, or trade-in discounts." 
      }
    ]
  }
];

