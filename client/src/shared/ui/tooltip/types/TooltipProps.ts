import { JSX } from 'solid-js';

export interface TooltipProps {
  label: string;
  isOpen?: boolean;
  children: JSX.Element;
}
