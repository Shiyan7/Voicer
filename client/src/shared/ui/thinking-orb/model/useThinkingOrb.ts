import { createEffect, createSignal, onCleanup } from 'solid-js';
import { MODE_FRAMES, paintFrame, resolvePreset } from 'thinking-orbs/engine';

import { themeRoot } from '@/shared/roots/themeRoot';

import { ThinkingOrbProps } from '../types/ThinkingOrbProps';

const MAX_DPR = 2;
const REDUCED_MOTION_TIME = 0.6;

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const useThinkingOrb = (props: ThinkingOrbProps) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  const canvasStyle = () => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
  });

  createEffect(() => {
    const node = canvas();
    if (!node) return;
    const size = props.size;
    const dark = themeRoot.resolvedTheme === 'dark';
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    node.width = Math.round(size * dpr);
    node.height = Math.round(size * dpr);
    const ctx = node.getContext('2d');
    if (!ctx) return;

    const { mode, speed, opts } = resolvePreset(props.state, size);
    const frameFn = MODE_FRAMES[mode];
    const draw = (seconds: number) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      paintFrame(ctx, frameFn(size, seconds, opts), dark);
    };

    if (reducedMotion) {
      draw(REDUCED_MOTION_TIME);
      return;
    }

    let frame = 0;
    let running = false;
    let visible = true;
    const loop = () => {
      draw((performance.now() / 1000) * speed);
      if (running) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (visible) start();
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && document.visibilityState !== 'hidden') start();
      else stop();
    });

    draw((performance.now() / 1000) * speed);
    observer.observe(node);
    document.addEventListener('visibilitychange', onVisibility);

    onCleanup(() => {
      stop();
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    });
  });

  return { setCanvas, canvasStyle };
};
