export const getPersonaColor = (persona) => {
  const normalized = (persona?.split(',')[0] || persona || '').toLowerCase().trim();
  switch (normalized) {
    case 'everyday user':
      // Blue fading to purple
      return 'linear-gradient(135deg, #4285F4 0%, #9333EA 100%)';
    case 'student':
      // Green fading to blue
      return 'linear-gradient(135deg, #34A853 0%, #4285F4 100%)';
    case 'content creator':
      // Red fading to orange
      return 'linear-gradient(135deg, #EA4335 0%, #FA7B17 100%)';
    case 'professional':
      // Orange fading to yellow
      return 'linear-gradient(135deg, #E65100 0%, #F59E0B 100%)';
    case 'gamer / power user':
    case 'gamer':
    case 'power user':
      // Purple fading to pink
      return 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)';
    default:
      return 'linear-gradient(135deg, #4B5563 0%, #6B7280 100%)';
  }
};

export const getPersonaGradient = getPersonaColor;
