export const getPersonaColor = (persona) => {
  switch (persona?.toLowerCase()?.trim()) {
    case 'everyday user':
      return '#4285F4'; // Google Blue
    case 'student':
      return '#34A853'; // Google Green
    case 'content creator':
      return '#EA4335'; // Google Red
    case 'professional':
      return '#F9AB00'; // Google Yellow/Orange
    case 'gamer / power user':
      return '#9333EA'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};
