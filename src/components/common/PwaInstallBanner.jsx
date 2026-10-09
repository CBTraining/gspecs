import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share2, PlusSquare, Monitor, CheckCircle } from 'lucide-react';
import { usePwaInstall } from '../../hooks/usePwaInstall';

export default function PwaInstallBanner() {
  const {
    canShowInstall,
    isIOS,
    showGuideModal,
    installPwa,
    closeGuideModal
  } = usePwaInstall();

  if (!canShowInstall) return null;

  return (
    <>
      <div className="pwa-install-banner">
        <motion.button
          type="button"
          className="btn-install-pwa"
          onClick={installPwa}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          title="Install G-Specs as a Progressive Web App"
          aria-label="Install G-Specs as a PWA"
        >
          <img
            src={`${import.meta.env.BASE_URL}appicon.svg`}
            alt=""
            className="pwa-btn-icon"
          />
          <span>Install G-Specs as a PWA</span>
          <span className="pwa-btn-badge">
            <Download size={16} />
          </span>
        </motion.button>
      </div>

      {/* Guidance Modal for iOS or browsers without native prompt */}
      <AnimatePresence>
        {showGuideModal && (
          <div
            className="modal-backdrop"
            onClick={closeGuideModal}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: '1rem'
            }}
          >
            <motion.div
              className="glass-panel"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.2 }}
              style={{
                width: '100%',
                maxWidth: '420px',
                padding: '1.5rem',
                borderRadius: '1.25rem',
                backgroundColor: 'var(--surface-color)',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-lg)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img
                    src={`${import.meta.env.BASE_URL}appicon.svg`}
                    alt="G-Specs"
                    style={{ width: '36px', height: '36px', borderRadius: '8px' }}
                  />
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Install G-Specs
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Quick access & offline capability
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-icon"
                  onClick={closeGuideModal}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {isIOS ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    Install G-Specs to your iPhone or iPad home screen:
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(49, 132, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', flexShrink: 0 }}>
                      <Share2 size={18} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      1. Tap the <strong>Share</strong> button in Safari's toolbar
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(49, 132, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', flexShrink: 0 }}>
                      <PlusSquare size={18} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      2. Scroll down and tap <strong>Add to Home Screen</strong>
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    To install G-Specs on your device:
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(49, 132, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', flexShrink: 0 }}>
                      <Monitor size={18} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Look for the <strong>Install</strong> icon in the address bar (top right)
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', backgroundColor: 'var(--surface-hover)', borderRadius: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(49, 132, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', flexShrink: 0 }}>
                      <CheckCircle size={18} />
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                      Or click your browser's menu (⋮) and select <strong>Install G-Specs...</strong>
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                className="btn-primary"
                onClick={closeGuideModal}
                style={{ width: '100%', marginTop: '1.25rem', padding: '0.7rem' }}
              >
                Got It
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
