import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowLeft } from 'lucide-react';
import { calculateRecommendations } from '../utils/quizScoring';
import QuizStepPersona from './quiz/QuizStepPersona';
import QuizStepBudget from './quiz/QuizStepBudget';
import QuizStepPortability from './quiz/QuizStepPortability';
import QuizStepFeatures from './quiz/QuizStepFeatures';
import QuizStepResults from './quiz/QuizStepResults';

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
    portabilityVsScreen: '',
    touchVsBattery: ''
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
                  {step === 1 && (
                    <QuizStepPersona onSelect={(persona) => goForward({ ...answers, persona })} />
                  )}

                  {step === 2 && (
                    <QuizStepBudget onSelect={(budget) => goForward({ ...answers, budget })} />
                  )}

                  {step === 3 && (
                    <QuizStepPortability onSelect={(portabilityVsScreen) => goForward({ ...answers, portabilityVsScreen })} />
                  )}

                  {step === 4 && (
                    <QuizStepFeatures onSelect={(touchVsBattery) => goForward({ ...answers, touchVsBattery })} />
                  )}

                  {step === 5 && (
                    <QuizStepResults 
                      recommendations={recommendations}
                      onSelectDevice={onSelectDevice}
                      onClose={onClose}
                      onReset={handleReset}
                    />
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
