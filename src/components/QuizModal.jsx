import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowRight, RefreshCw, Check, Laptop, Smartphone } from 'lucide-react';
import { getPersonaColor } from '../utils/persona';

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  return Number(priceStr.replace(/[^0-9.]/g, ''));
};

const parseWeight = (weightStr) => {
  if (!weightStr) return 0;
  return Number(weightStr.replace(/[^0-9.]/g, ''));
};

const parseBattery = (batteryStr) => {
  if (!batteryStr) return 0;
  return Number(batteryStr.replace(/[^0-9.]/g, ''));
};

const QuizModal = ({ isOpen, onClose, devices, onSelectDevice }) => {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    persona: '',
    budget: Infinity,
    priority: ''
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setAnswers({
        persona: '',
        budget: Infinity,
        priority: ''
      });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleReset = () => {
    setStep(1);
    setAnswers({
      persona: '',
      budget: Infinity,
      priority: ''
    });
  };

  // Calculate top recommendations based on answers
  const recommendations = useMemo(() => {
    if (step !== 4) return [];

    const scored = devices.map(device => {
      let score = 0;
      
      // 1. Persona match (40% weight)
      if (answers.persona && device.Persona === answers.persona) {
        score += 40;
      }

      // 2. Budget match (30% weight)
      const price = parsePrice(device.MSRP);
      if (price <= answers.budget) {
        score += 30;
      } else if (price <= answers.budget * 1.15) {
        // Close enough budget match gets partial points
        score += 15;
      }

      // 3. Priority match (30% weight)
      if (answers.priority === 'portability') {
        const weight = parseWeight(device.Weight);
        if (weight > 0 && weight <= 3.2) score += 30;
      } else if (answers.priority === 'touch') {
        if (device['Touchscreen?'] === 'Yes') score += 30;
      } else if (answers.priority === 'battery') {
        const hours = parseBattery(device['Battery Life']);
        if (hours >= 11) score += 30;
      } else if (answers.priority === 'large-screen') {
        const size = parseFloat(device['Screen Size']);
        if (size >= 14) score += 30;
      }

      return {
        device,
        matchPercentage: score
      };
    });

    // Sort by score descending, take top 3
    return scored
      .filter(item => item.matchPercentage > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage)
      .slice(0, 3);
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
            <div className="filter-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={22} style={{ color: 'var(--accent-color)' }} />
                <span>Find Your Gragglebook</span>
              </h3>
              <button className="btn-icon" onClick={onClose}>
                <X size={24} />
              </button>
            </div>

            {/* Quiz Body */}
            <div style={{ flex: 1, padding: '2rem 1.5rem', overflowY: 'auto' }}>
              
              {/* Step Indicators */}
              {step < 4 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                  {[1, 2, 3].map(s => (
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

              {/* STEP 1: Persona Selection */}
              {step === 1 && (
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
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
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, persona: option.key }));
                          setStep(2);
                        }}
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
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
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
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, budget: option.value }));
                          setStep(3);
                        }}
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

              {/* STEP 3: Priority Features */}
              {step === 3 && (
                <div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Choose your top feature priority:
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {[
                      { key: 'portability', label: 'Ultra Portable & Lightweight', desc: 'Laptops under 3.2 lbs, ideal for carrying around.' },
                      { key: 'touch', label: 'Touchscreen / Tablet mode', desc: 'Full touch navigation and digital pen compatibility.' },
                      { key: 'battery', label: 'Maximum Battery Life', desc: 'Devices that last 11+ hours on a single charge.' },
                      { key: 'large-screen', label: 'Large Screen Size', desc: '14" or larger screens for comfortable multitasking.' }
                    ].map(option => (
                      <button
                        key={option.key}
                        onClick={() => {
                          setAnswers(prev => ({ ...prev, priority: option.key }));
                          setStep(4);
                        }}
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

              {/* STEP 4: Results screen */}
              {step === 4 && (
                <div>
                  <h4 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', textAlign: 'center' }}>
                    Recommended Gragglebooks
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', textAlign: 'center' }}>
                    Based on your requirements, here are the best matches:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {recommendations.map(({ device, matchPercentage }) => {
                      const isLaptop = device.Formfactor?.toLowerCase().includes('clamshell') || device.Formfactor?.toLowerCase().includes('convertible');
                      return (
                        <div 
                          key={device.SKU}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            backgroundColor: 'var(--surface-hover)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '1.25rem',
                            padding: '1rem'
                          }}
                        >
                          <div style={{ 
                            width: '70px', 
                            height: '70px', 
                            backgroundColor: '#ffffff',
                            borderRadius: '0.5rem',
                            padding: '0.25rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--border-color)',
                            overflow: 'hidden'
                          }}>
                            {device['Device Image'] ? (
                              <img 
                                src={device['Device Image']} 
                                alt="" 
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            ) : (
                              isLaptop ? <Laptop size={24} /> : <Smartphone size={24} />
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <h5 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              {device['Device Name']}
                            </h5>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: '700' }}>
                                {matchPercentage}% Match
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>|</span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                {device.MSRP}
                              </span>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                color: '#ffffff', 
                                backgroundColor: getPersonaColor(device.Persona), 
                                borderRadius: '0.25rem',
                                padding: '0.1rem 0.4rem',
                                fontWeight: '600'
                              }}>
                                {device.Persona}
                              </span>
                            </div>
                          </div>

                          <button 
                            className="btn-primary" 
                            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', borderRadius: '1rem' }}
                            onClick={() => {
                              onSelectDevice(device);
                              onClose();
                            }}
                          >
                            <span>View</span>
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      );
                    })}
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

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default QuizModal;
