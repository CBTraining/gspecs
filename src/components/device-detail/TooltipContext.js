import { createContext } from 'react';

export const TooltipContext = createContext({
  activeTooltipId: null,
  setActiveTooltipId: () => {}
});

export default TooltipContext;
