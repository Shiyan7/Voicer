import { TooltipPosition } from '../types/TooltipPosition';

const TOOLTIP_GAP = 8;

export const getTooltipAnchor = (rect: DOMRect, position: TooltipPosition) =>
  position === 'right'
    ? { left: rect.right + TOOLTIP_GAP, top: rect.top + rect.height / 2 }
    : { left: rect.left + rect.width / 2, top: rect.top - TOOLTIP_GAP };
