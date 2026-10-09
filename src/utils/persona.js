export const getPersonaStyle = (persona) => {
  const normalized = (persona?.split(',')[0] || persona || '').toLowerCase().trim();
  switch (normalized) {
    case 'everyday user':
      return {
        background: 'linear-gradient(90deg, #3186ff 0%, #A9A8FF 100%)',
        color: '#ffffff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
      };
    case 'student':
      return {
        background: 'linear-gradient(90deg, #0ebc5f 0%, #78C9FF 100%)',
        color: '#ffffff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
      };
    case 'content creator':
      return {
        background: 'linear-gradient(90deg, #ff4641 0%, #FF63A0 100%)',
        color: '#ffffff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
      };
    case 'professional':
      return {
        background: 'linear-gradient(90deg, #ffcc00 0%, #FFB5E8 100%)',
        color: '#1a1a1a',
        textShadow: 'none'
      };
    case 'gamer / power user':
    case 'gamer':
    case 'power user':
      return {
        background: 'linear-gradient(90deg, #6a64fd 0%, #64AFFF 100%)',
        color: '#ffffff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
      };
    default:
      return {
        background: 'linear-gradient(90deg, #4B5563 0%, #6B7280 100%)',
        color: '#ffffff',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)'
      };
  }
};

export const getPersonaColor = (persona) => {
  return getPersonaStyle(persona).background;
};

export const getPersonaTextColor = (persona) => {
  return getPersonaStyle(persona).color;
};

export const getPersonaGradient = getPersonaColor;
