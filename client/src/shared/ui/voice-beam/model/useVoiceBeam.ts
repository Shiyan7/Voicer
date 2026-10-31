import { createMemo, createUniqueId, onCleanup, onMount } from 'solid-js';

import {
  buildVoiceBeamCss,
  canvasSupportsFilter,
  registerVoiceBeam,
  resolveVoiceBeamConfig,
} from '@/shared/lib/voice-beam';
import { themeRoot } from '@/shared/roots/themeRoot';

import { VoiceBeamProps } from '../types/VoiceBeamProps';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

export const useVoiceBeam = (props: VoiceBeamProps) => {
  const id = `vb${createUniqueId().replace(/[^a-zA-Z0-9-]/g, '-')}`;
  let root: HTMLDivElement | undefined;

  const config = createMemo(() =>
    resolveVoiceBeamConfig({
      id,
      theme: themeRoot.resolvedTheme,
      radius: props.radius,
      paused: props.paused,
      reducedMotion,
    }),
  );

  const driverConfig = createMemo(() => config().driver);

  const css = () => buildVoiceBeamCss(config().css);

  const rootStyle = () => ({ '--voice-strength': String(config().strength) });

  const hasCore = () => config().css.coreLight > 0;

  const hasHaloCanvas = !canvasSupportsFilter;

  const filterId = `vb-distort-${id}`;

  const baseFrequency = () => {
    const detail = config().driver.distortionDetail;
    return `${(0.012 * detail).toFixed(4)} ${(0.05 * detail).toFixed(4)}`;
  };

  const readLevel = () => props.level;

  const setRoot = (node: HTMLDivElement) => {
    root = node;
  };

  onMount(() => {
    if (!root) return;
    onCleanup(registerVoiceBeam(root, driverConfig, readLevel));
  });

  return {
    id,
    css,
    rootStyle,
    hasCore,
    hasHaloCanvas,
    filterId,
    baseFrequency,
    setRoot,
  };
};
