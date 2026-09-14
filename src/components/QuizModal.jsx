import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowLeft, RefreshCw, Laptop, Smartphone, Battery, Monitor } from 'lucide-react';
import { calculateRecommendations } from '../utils/quizScoring';
import QuizResultCard from './quiz/QuizResultCard';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0
  })
};

const QuizModal = ({ isOpen, onClose, devices = [], onSelectDevice }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [answers, setAnswers] = useState({
    persona: '',
    budget: Infinity,
    portabilityVsScreen: '', // 'portability' or 'large-screen'
    touchVsBattery: '' // 'touch' or 'battery'
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setDirection(1);
      setAnswers({
        persona: '',
        budget: Infinity,
        portabilityVsScreen: '',
        touchVsBattery: ''
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleReset = () => {
    setDirection(-1);
    setStep(1);
    setAnswers({
      persona: '',
      budget: Infinity,
      portabilityVsScreen: '',
      touchVsBattery: ''
    });
  };

  const goForward = (nextAnswers) => {
    setAnswers(nextAnswers);
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBackward = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  // Calculate top recommendations based on answers
  const recommendations = useMemo(() => {
    if (step !== 5) return [];
    return calculateRecommendations(devices, answers);
  }, [step, devices, answers]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-backdrop" 
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 1100 }}
        >
          <motion.div 
            className="filter-modal"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '650px', 
              borderRadius: '2rem 2rem 0 0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="filter-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {step > 1 && step < 5 && (
                  <button 
                    className="btn-icon" 
                    onClick={goBackward}
                    style={{ padding: '0.25rem', marginRight: '0.25rem' }}
                    aria-label="Previous step"
                  >
                    <ArrowLeft size={20} />
                  </button>
                )}
                <Sparkles size={22} style={{ color: 'var(--accent-color)' }} />
                <span>Find Your Googlebook</span>
              </div>
              <button className="btn-icon" onClick={onClose} aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

            {/* Quiz Body */}
            <div style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto', position: 'relative' }}>
              
              {/* Step Indicators */}
              {step < 5 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                  {[1, 2, 3, 4].map(s => (
                    <div 
                      key={s} 
                      style={{
                        width: '40px',
                        height: '6px',
                        borderRadius: '3px',
                        backgroundColor: s <= step ? 'var(--accent-color)' : 'var(--border-color)',
                        transition: 'background-color 0.3s ease'
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Animating Step Wrapper */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  {/* STEP 1: Persona Selection */}
                  {step === 1 && (
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                        What is your primary use case?
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { key: 'Everyday User', label: 'Everyday Browsing & Tasks', desc: 'Social media, email, video streaming, and casual web use.' },
                          { key: 'Student', label: 'School & Study', desc: 'Writing papers, taking notes, reading textbooks, and research.' },
                          { key: 'Content Creator', label: 'Content Creation & Design', desc: 'Photo editing, video production, graphic design, and rendering.' },
                          { key: 'Professional', label: 'Office & Professional Work', desc: 'Heavy multitasking, sheets, video meetings, and business apps.' },
                          { key: 'Gamer / Power User', label: 'Gaming & Performance', desc: 'High performance gaming, virtualization, compilation, and power tasks.' }
                        ].map(option => (
                          <button
                            key={option.key}
                            onClick={() => goForward({ ...answers, persona: option.key })}
                            style={{
                              textAlign: 'left',
                              padding: '1.25rem',
                              borderRadius: '1rem',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              outline: 'none',
                              transition: 'transform 0.2s ease, border-color 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                          >
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{option.label}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{option.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Budget */}
                  {step === 2 && (
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                        What is your budget limit?
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {[
                          { value: 400, label: 'Entry Level (Under $400)', desc: 'Affordable, essential features for basic needs.' },
                          { value: 700, label: 'Mid-Range (Under $700)', desc: 'Great value, balanced performance and portability.' },
                          { value: 1000, label: 'Premium (Under $1000)', desc: 'Higher build quality, faster chips, and beautiful screens.' },
                          { value: Infinity, label: 'Unlimited / Premium Flagship', desc: 'No budget bounds; show me the absolute best tech.' }
                        ].map(option => (
                          <button
                            key={option.value}
                            onClick={() => goForward({ ...answers, budget: option.value })}
                            style={{
                              textAlign: 'left',
                              padding: '1.25rem',
                              borderRadius: '1rem',
                              border: '1px solid var(--border-color)',
                              backgroundColor: 'var(--surface-color)',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem',
                              outline: 'none',
                              transition: 'transform 0.2s ease, border-color 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                          >
                            <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{option.label}</span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{option.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Portability vs Screen size (Qualifying) */}
                  {step === 3 && (
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                        Portability vs Screen Size
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Which of these aspects is more important for your daily work?
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <button
                          onClick={() => goForward({ ...answers, portabilityVsScreen: 'portability' })}
                          style={{
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            borderRadius: '1.25rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                          <Laptop size={32} style={{ color: 'var(--accent-color)' }} />
                          <div>
                            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                              Ultra-Light & Portable
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              I am always on the go. I need a lightweight device (under 3.2 lbs) that is easy to carry all day.
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => goForward({ ...answers, portabilityVsScreen: 'large-screen' })}
                          style={{
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            borderRadius: '1.25rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                          <Monitor size={32} style={{ color: 'var(--accent-color)' }} />
                          <div>
                            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                              Larger Display Space
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              I want maximum screen real estate (14" or larger) to multitask comfortably with multiple windows open.
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Touchscreen vs Battery Life (Qualifying) */}
                  {step === 4 && (
                    <div>
                      <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                        Touchscreen vs Battery Life
                      </h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '1.5rem' }}>
                        Choose your priority feature:
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                        <button
                          onClick={() => goForward({ ...answers, touchVsBattery: 'touch' })}
                          style={{
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            borderRadius: '1.25rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                          <Smartphone size={32} style={{ color: 'var(--accent-color)' }} />
                          <div>
                            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                              Touchscreen & Pen Support
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              I want a touch-sensitive screen or tablet convertible mode for taking notes, sketching, and drawing.
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => goForward({ ...answers, touchVsBattery: 'battery' })}
                          style={{
                            textAlign: 'center',
                            padding: '2rem 1.5rem',
                            borderRadius: '1.25rem',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--surface-color)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.75rem',
                            outline: 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                        >
                          <Battery size={32} style={{ color: 'var(--accent-color)' }} />
                          <div>
                            <span style={{ fontWeight: '800', color: 'var(--text-primary)', display: 'block', fontSize: '1.05rem', marginBottom: '0.25rem' }}>
                              Long-Lasting Battery
                            </span>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                              I need all-day battery life (11+ hours) so I don't have to carry a charger or hunt for outlets.
                            </span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Results screen */}
                  {step === 5 && (
                    <div>
                      <h4 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center', color: 'var(--text-primary)' }}>
                        Recommended Googlebooks
                      </h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
                        Based on your requirements, here are the best matches:
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {recommendations.map(({ device, matchPercentage }) => (
                          <QuizResultCard
                            key={device.SKU}
                            device={device}
                            matchPercentage={matchPercentage}
                            onSelectDevice={onSelectDevice}
                            onClose={onClose}
                          />
                        ))}

                        {recommendations.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                            <p>No perfect matches found. Try widening your budget or changing priorities.</p>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5rem' }}>
                        <button 
                          className="btn-secondary" 
                          onClick={handleReset}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '1.5rem', padding: '0.6rem 1.2rem' }}
                        >
                          <RefreshCw size={16} />
                          <span>Retake Quiz</span>
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default QuizModal;
