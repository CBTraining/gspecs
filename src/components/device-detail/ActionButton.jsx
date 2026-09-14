import React, { useState, useRef, useEffect } from 'react';
import { Check } from 'lucide-react';

export const ActionButton = ({ icon: Icon, label, successLabel, successIcon: SuccessIcon = Check, onClick }) => {
  const [copied, setCopied] = useState(false);
  const [pulse, setPulse] = useState(false);
  const pulseTimerRef = useRef(null);
  const copyTimerRef = useRef(null);

  const handleClick = () => {
    if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);

    setPulse(true);
    setCopied(true);
    onClick();
    
    pulseTimerRef.current = setTimeout(() => {
      setPulse(false);
    }, 400);

    copyTimerRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (pulseTimerRef.current) clearTimeout(pulseTimerRef.current);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  return (
    <button 
      className={`action-btn ${pulse ? 'active-pulse' : ''} ${copied ? 'copied-state' : ''}`}
      onClick={handleClick}
    >
      {copied ? <SuccessIcon size={20} /> : <Icon size={20} />}
      <span>{copied ? successLabel : label}</span>
    </button>
  );
};

export default ActionButton;
