import { JSX } from 'solid-js';

export interface ReviewHeaderProps {
  title: string;
  onBack: () => void;
  actions: JSX.Element;
}
