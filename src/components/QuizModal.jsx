import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, ArrowLeft } from 'lucide-react';
import { calculateRecommendations } from '../utils/quizScoring';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import QuizQuestionStep from './quiz/QuizQuestionStep';
import QuizStepResults from './quiz/QuizStepResults';

const stepVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1
  },
  exit: (direction) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0
  })
};

const INITIAL_ANSWERS = {
  formfactor: '',
  display: '',
  ports: '',
  platform: '',
  security: ''
};

const QuizModal = ({ isOpen, onClose, devices = [], onSelectDevice }) => {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [answers, setAnswers] = useState(INITIAL_ANSWERS);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const isResultsStep = step > totalQuestions;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setStep(1);
      setDirection(1);
      setAnswers(INITIAL_ANSWERS);
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
    setAnswers(INITIAL_ANSWERS);
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
    if (!isResultsStep) return [];
    return calculateRecommendations(devices, answers);
  }, [isResultsStep, devices, answers]);

  const currentQuestion = QUIZ_QUESTIONS[step - 1];

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
              maxWidth: '680px', 
              borderRadius: '2rem 2rem 0 0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="filter-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {step > 1 && !isResultsStep && (
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
                <span style={{ fontWeight: 700 }}>Find Your Googlebook</span>
              </div>
              <button className="btn-icon" onClick={onClose} aria-label="Close modal">
                <X size={24} />
              </button>
            </div>

            {/* Quiz Body */}
            <div style={{ flex: 1, padding: '1.75rem 1.5rem', overflowY: 'auto', position: 'relative' }}>
              
              {/* Step Progress Indicators */}
              {!isResultsStep && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginBottom: '2rem' }}>
                  {QUIZ_QUESTIONS.map(q => (
                    <div 
                      key={q.id} 
                      style={{
                        flex: 1,
                        maxWidth: '55px',
                        height: '5px',
                        borderRadius: '3px',
                        backgroundColor: q.stepNumber <= step ? 'var(--accent-color)' : 'var(--border-color)',
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
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                >
                  {!isResultsStep && currentQuestion && (
                    <QuizQuestionStep
                      question={currentQuestion}
                      onSelect={(val) => goForward({ ...answers, [currentQuestion.id]: val })}
                    />
                  )}

                  {isResultsStep && (
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
