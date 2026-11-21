import { JSX } from 'solid-js';

import { TooltipPosition } from './TooltipPosition';

export interface TooltipProps {
  label: string;
  isOpen?: boolean;
  position?: TooltipPosition;
  overflowOnly?: boolean;
  class?: string;
  children: JSX.Element;
}
