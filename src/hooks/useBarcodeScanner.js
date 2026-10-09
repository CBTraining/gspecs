import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom hook for headless/invisible camera barcode scanning.
 * Opens the rear camera ('environment' mode) in the background
 * without displaying a video viewfinder on screen.
 */
export function useBarcodeScanner(onScanned) {
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const activeRef = useRef(false);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const zxingControlsRef = useRef(null);
  const frameTimerRef = useRef(null);

  // Stop camera tracks and release scanner resources
  const stopScan = useCallback(() => {
    activeRef.current = false;

    if (frameTimerRef.current) {
      clearTimeout(frameTimerRef.current);
      frameTimerRef.current = null;
    }

    if (zxingControlsRef.current) {
      try {
        zxingControlsRef.current.stop();
      } catch {
        // Ignore stop error
      }
      zxingControlsRef.current = null;
    }

    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((track) => track.stop());
      } catch {
        // Ignore stream stop error
      }
      streamRef.current = null;
    }

    if (videoRef.current) {
      try {
        videoRef.current.srcObject = null;
        if (videoRef.current.parentNode) {
          videoRef.current.parentNode.removeChild(videoRef.current);
        }
      } catch {
        // Ignore removal error
      }
      videoRef.current = null;
    }

    setIsScanning(false);
  }, []);

  // Handle successful barcode recognition
  const handleBarcodeFound = useCallback(
    (code) => {
      if (!activeRef.current) return;
      activeRef.current = false;

      // Provide subtle haptic feedback on supported mobile devices
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        try {
          navigator.vibrate([40, 60, 40]);
        } catch {
          // Ignore vibration permission error
        }
      }

      stopScan();

      if (onScanned) {
        onScanned(code);
      }
    },
    [stopScan, onScanned]
  );

  // Start background camera and scanning
  const startScan = useCallback(async () => {
    // Stop any existing session
    stopScan();
    setCameraError(null);

    if (typeof navigator === 'undefined' || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera access is not supported by your browser or device.');
      return;
    }

    setIsScanning(true);
    activeRef.current = true;

    // 1. Request rear camera (environment) with fallback to default video
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1920, min: 640 },
          height: { ideal: 1080, min: 480 }
        },
        audio: false
      });
    } catch {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });
      } catch (err) {
        activeRef.current = false;
        setIsScanning(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setCameraError('Camera permission was denied. Please allow camera access in your browser settings to scan barcodes.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setCameraError('No camera found on this device.');
        } else {
          setCameraError(err.message || 'Unable to start camera.');
        }
        return;
      }
    }

    if (!activeRef.current) {
      // User cancelled while waiting for permission
      stream.getTracks().forEach((track) => track.stop());
      return;
    }

    streamRef.current = stream;

    // 2. Create invisible video element in DOM (required by iOS Safari and modern browsers to decode frames)
    let video = document.createElement('video');
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');
    video.setAttribute('muted', 'true');
    video.muted = true;
    video.autoplay = true;

    // Hidden from viewport, but active in DOM
    video.style.position = 'fixed';
    video.style.top = '-9999px';
    video.style.left = '-9999px';
    video.style.width = '1px';
    video.style.height = '1px';
    video.style.opacity = '0.01';
    video.style.pointerEvents = 'none';
    video.style.zIndex = '-9999';

    document.body.appendChild(video);
    videoRef.current = video;

    video.srcObject = stream;
    try {
      await video.play();
    } catch (e) {
      console.warn('Video auto-play warning:', e);
    }

    // 3. Prefer hardware-accelerated native BarcodeDetector API if available
    let nativeDetector = null;
    if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
      try {
        const supported = await window.BarcodeDetector.getSupportedFormats().catch(() => []);
        const formatsToUse = ['upc_a', 'upc_e', 'ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code'].filter((f) =>
          supported.includes(f)
        );
        if (formatsToUse.length > 0) {
          nativeDetector = new window.BarcodeDetector({ formats: formatsToUse });
        }
      } catch {
        // Fallback to ZXing
        nativeDetector = null;
      }
    }

    if (nativeDetector) {
      // Native detector loop
      const runNativeScan = async () => {
        if (!activeRef.current) return;
        try {
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            const detected = await nativeDetector.detect(video);
            if (detected && detected.length > 0 && activeRef.current) {
              const raw = detected[0].rawValue;
              if (raw) {
                handleBarcodeFound(raw);
                return;
              }
            }
          }
        } catch {
          // Ignore transient detection errors between frames
        }

        if (activeRef.current) {
          frameTimerRef.current = setTimeout(runNativeScan, 80);
        }
      };

      runNativeScan();
    } else {
      // 4. ZXing Fallback Multi-Format Reader (Lazy-loaded dynamically)
      try {
        const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([
          import('@zxing/browser'),
          import('@zxing/library')
        ]);

        if (!activeRef.current) return;

        const hints = new Map();
        hints.set(DecodeHintType.TRY_HARDER, true);
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.QR_CODE
        ]);

        const reader = new BrowserMultiFormatReader(hints);
        const controls = await reader.decodeFromStream(stream, video, (result) => {
          if (result && activeRef.current) {
            const text = result.getText();
            if (text) {
              handleBarcodeFound(text);
            }
          }
        });
        zxingControlsRef.current = controls;
      } catch (zxErr) {
        console.warn('ZXing scanner initialization failed:', zxErr);
      }
    }
  }, [stopScan, handleBarcodeFound]);

  // Clean up any running stream if unmounted
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, [stopScan]);

  return {
    isScanning,
    cameraError,
    setCameraError,
    startScan,
    stopScan
  };
}
