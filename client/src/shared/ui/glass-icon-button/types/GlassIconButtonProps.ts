import { JSX } from 'solid-js';

export interface GlassIconButtonProps {
  children: JSX.Element;
  label: string;
  size: 'sm' | 'md';
  type?: 'button' | 'submit';
  disabled?: boolean;
  class?: string;
  onClick?: () => void;
}
