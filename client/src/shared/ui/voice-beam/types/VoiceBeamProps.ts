import { JSX } from 'solid-js';

export interface VoiceBeamProps {
  children: JSX.Element;
  level: number;
  paused: boolean;
  radius: number;
  class?: string;
}
