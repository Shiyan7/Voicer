import { createEffect, createSignal, onCleanup, untrack } from 'solid-js';

import { createFrameLoop } from '../lib/createFrameLoop';
import { createWaveMotion } from '../lib/createWaveMotion';
import { createWaveScene } from '../lib/createWaveScene';
import { VoiceWaveDeps } from '../types/VoiceWaveDeps';

const FADED_PRESENCE = 0.001;

export const useVoiceWave = (deps: VoiceWaveDeps) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  createEffect(() => {
    const node = canvas();
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;

    const scene = createWaveScene(node, ctx);
    const motion = createWaveMotion(untrack(() => deps.paused));

    const loop = createFrameLoop((dt) => {
      const frame = motion.update(dt, deps.level, deps.paused);
      scene.draw(frame);
      return !deps.paused || frame.presence >= FADED_PRESENCE;
    });

    const observer = new ResizeObserver(() => {
      scene.resize();
      loop.start();
    });
    observer.observe(node);

    createEffect(() => {
      if (!deps.paused) loop.start();
    });

    onCleanup(() => {
      observer.disconnect();
      loop.stop();
    });
  });

  return { setCanvas };
};
