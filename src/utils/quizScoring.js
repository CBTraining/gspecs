export const calculateRecommendations = (devices = [], answers = {}) => {
  if (!devices || devices.length === 0) return [];

  // Filter to active Googlebooks or active devices
  const activeDevices = devices.filter(d => {
    return d['Device Name'] && (d.Device === 'Googlebook' || d.Current === 'TRUE' || String(d.Current).toUpperCase() === 'TRUE');
  });

  const candidates = activeDevices.length > 0 ? activeDevices : devices;

  const scored = candidates.map(device => {
    let score = 0;
    const maxPossible = 100;
    const highlights = [];

    // 1. Form Factor & Pen (Weight: 20 pts)
    const formfactor = (device.Formfactor || '').toLowerCase();
    const hasPen = device['Pen Compatibility?'] && device['Pen Compatibility?'].toLowerCase() !== 'no';

    if (answers.formfactor === '2in1') {
      if (formfactor.includes('2in1') || formfactor.includes('convertible')) {
        score += 20;
        highlights.push('360° 2-in-1 Convertible');
      }
      if (hasPen) {
        score += 5;
        highlights.push(`Pen: ${device['Pen Compatibility?']}`);
      }
    } else if (answers.formfactor === 'clamshell') {
      if (formfactor.includes('clamshell')) {
        score += 20;
        highlights.push('Rigid Clamshell Design');
      }
    }

    // 2. Display & Screen (Weight: 25 pts)
    const colorAccuracy = (device['Color Accuracy'] || '').toLowerCase();
    const screenType = (device['Screen Type'] || '').toLowerCase();
    const screenSize = parseFloat(device['Screen Size'] || '0');
    const weight = parseFloat(device['Weight'] || '99');

    if (answers.display === 'color-oled') {
      if (colorAccuracy.includes('100% dci-p3')) {
        score += 25;
        highlights.push('100% DCI-P3 OLED Display');
      } else if (screenType.includes('oled')) {
        score += 18;
        highlights.push('Vibrant OLED Display');
      }
    } else if (answers.display === 'large-screen') {
      if (screenSize >= 15) {
        score += 25;
        highlights.push(`${device['Screen Size']} Big Screen`);
      } else if (screenSize >= 14) {
        score += 12;
      }
    } else if (answers.display === 'ultra-portable') {
      if (weight <= 2.3) {
        score += 25;
        highlights.push(`Ultra-light ${device['Weight']}`);
      } else if (weight <= 2.6) {
        score += 18;
        highlights.push(`Lightweight ${device['Weight']}`);
      }
    }

    // 3. Ports & Connectivity (Weight: 20 pts)
    const ports = (device['Ports'] || '').toLowerCase();
    const hdmi = (device['HDMI'] || '').toLowerCase() === 'yes' || ports.includes('hdmi');
    const usbA = ports.includes('usb a') || ports.includes('usb-a');
    const thunderbolt = (device['Thunderbolt'] || '').toLowerCase() === 'yes' || ports.includes('thunderbolt');

    if (answers.ports === 'full-ports') {
      if (hdmi && usbA) {
        score += 20;
        highlights.push('Built-in HDMI & USB-A');
      } else if (hdmi || usbA) {
        score += 12;
      }
    } else if (answers.ports === 'thunderbolt') {
      if (thunderbolt) {
        score += 20;
        highlights.push('Dual Thunderbolt 4');
      }
    } else if (answers.ports === 'minimal-usbc') {
      if (!hdmi && !usbA) {
        score += 20;
        highlights.push('Slim Dual USB-C');
      } else {
        score += 10;
      }
    }

    // 4. Battery & Platform (Weight: 20 pts)
    const batteryHours = parseInt(device['Battery Life'] || '0', 10);
    const processor = (device['Processor'] || '').toLowerCase();

    if (answers.platform === 'extreme-battery') {
      if (batteryHours >= 18) {
        score += 20;
        highlights.push(`${device['Battery Life']} Hours Battery`);
      } else if (batteryHours >= 15) {
        score += 14;
        highlights.push(`${device['Battery Life']} Hours Battery`);
      }
    } else if (answers.platform === 'intel-core') {
      if (processor.includes('intel')) {
        score += 20;
        highlights.push('Intel Core Ultra Processor');
      }
    }

    // 5. Security & Biometrics (Weight: 15 pts)
    const security = (device['Security'] || '').toLowerCase();
    const hasFace = security.includes('face');
    const hasFingerprint = security.includes('fingerprint');

    if (answers.security === 'face-and-fingerprint') {
      if (hasFace && hasFingerprint) {
        score += 15;
        highlights.push('Face Auth + Fingerprint');
      } else if (hasFace || hasFingerprint) {
        score += 8;
      }
    } else if (answers.security === 'fingerprint-only') {
      if (hasFingerprint) {
        score += 15;
        highlights.push('Touch Fingerprint Reader');
      }
    }

    // Calculate match percentage
    const matchPercentage = Math.min(99, Math.max(68, Math.round((score / maxPossible) * 100)));

    return {
      device,
      score,
      matchPercentage,
      highlights: highlights.slice(0, 3)
    };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};
