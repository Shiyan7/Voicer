import { createEffect, createSignal, onCleanup, untrack } from 'solid-js';

import {
  FLOW_SPEED_PX,
  IDLE_HEIGHT,
  VOICE_HEIGHT,
  WAVE_COLORS,
  WAVE_LAYERS,
} from '../config/voiceWaveConfig';
import { createFlowGradient } from '../lib/createFlowGradient';
import { createLineBlob } from '../lib/createLineBlob';
import { createSpring } from '../lib/createSpring';
import { follow } from '../lib/follow';
import { traceWave } from '../lib/traceWave';
import { VoiceWaveDeps } from '../types/VoiceWaveDeps';

const STEP_PX = 4;

const QUIET_LOUDEST = 0.3;

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

export const useVoiceWave = (deps: VoiceWaveDeps) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  createEffect(() => {
    const node = canvas();
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;

    const blobs = WAVE_LAYERS.map(createLineBlob);
    const swell = createSpring({ stiffness: 44, damping: 9 });
    let depths = new Float32Array(0);
    let width = 0;
    let height = 0;
    let band = 0;
    let loudest = QUIET_LOUDEST;
    let presence = untrack(() => (deps.paused ? 0 : 1));
    let flow = 0;
    let last = performance.now();
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = node.clientWidth;
      height = node.clientHeight;
      band = node.parentElement?.clientHeight ?? 0;
      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      depths = new Float32Array(Math.ceil(width / STEP_PX) + 1);
      blobs.forEach((blob) => blob.resize(width));
    };

    const fillDepths = (index: number, amplitude: number) => {
      const reach = height - band;
      for (let i = 0; i < depths.length; i++) {
        const shape = blobs[index].sample(i * STEP_PX);
        depths[i] = band + Math.min(reach, amplitude * reach * shape);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, Math.max(0, now - last) / 1000);
      last = now;
      const level = deps.paused ? 0 : deps.level;
      loudest = Math.max(level, follow(loudest, QUIET_LOUDEST, dt, 3));
      const target = IDLE_HEIGHT + VOICE_HEIGHT * (level / loudest);
      const size = Math.max(0, swell.step(dt, target));
      const tempo = deps.paused || reducedMotion ? 0 : size / IDLE_HEIGHT;
      presence = follow(presence, deps.paused ? 0 : 1, dt, 0.3);
      flow += dt * tempo * FLOW_SPEED_PX;

      ctx.clearRect(0, 0, width, height);
      const gradient = createFlowGradient(ctx, WAVE_COLORS, width, flow);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      WAVE_LAYERS.forEach((layer, index) => {
        blobs[index].advance(dt * tempo);
        fillDepths(index, size * layer.depth * presence);
        traceWave(ctx, depths, STEP_PX, band - 1);
        ctx.globalAlpha = layer.alpha;
        ctx.fill();
        ctx.globalAlpha = layer.edgeAlpha * presence;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, band);

      const faded = deps.paused && presence < 0.001;
      frame = faded ? 0 : requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(() => {
      resize();
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    });
    observer.observe(node);

    createEffect(() => {
      if (deps.paused || frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    });

    onCleanup(() => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    });
  });

  return { setCanvas };
};
