import { createEffect, createSignal, onCleanup, untrack } from 'solid-js';

import {
  EDGE_WIDTH_PX,
  FLOW_COLORS,
  FLOW_PX,
  IDLE_AMPLITUDE,
  MAX_DPR,
  MAX_FRAME_SEC,
  MIN_SHAPE,
  PRESENCE_SEC,
  SAMPLE_STEP_PX,
  SETTLED_LEVEL,
  TEMPO_GAIN,
  VOICE_GAIN,
  WAVE_LAYERS,
} from '../config/voiceWaveConfig';
import { createFlowGradient } from '../lib/createFlowGradient';
import { createLineBlob } from '../lib/createLineBlob';
import { createSpring } from '../lib/createSpring';
import { createVoiceDynamics } from '../lib/createVoiceDynamics';
import { follow } from '../lib/follow';
import { traceWave } from '../lib/traceWave';
import { VoiceWaveDeps } from '../types/VoiceWaveDeps';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

export const useVoiceWave = (deps: VoiceWaveDeps) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  createEffect(() => {
    const node = canvas();
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;

    const dynamics = createVoiceDynamics();
    const blobs = WAVE_LAYERS.map(createLineBlob);
    const springs = WAVE_LAYERS.map((layer) =>
      createSpring(layer.stiffness, layer.damping),
    );
    let depths = new Float32Array(0);
    let width = 0;
    let height = 0;
    let band = 0;
    let presence = untrack(() => (deps.paused ? 0 : 1));
    let flow = 0;
    let last = performance.now();
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      width = node.clientWidth;
      height = node.clientHeight;
      band = Math.min(height, node.parentElement?.clientHeight ?? 0);
      node.width = Math.round(width * dpr);
      node.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      depths = new Float32Array(Math.ceil(width / SAMPLE_STEP_PX) + 1);
      blobs.forEach((blob) => blob.resize(width));
    };

    const fillDepths = (index: number, amplitude: number) => {
      const reach = height - band;
      for (let i = 0; i < depths.length; i++) {
        const shape =
          MIN_SHAPE + (1 - MIN_SHAPE) * blobs[index].sample(i * SAMPLE_STEP_PX);
        depths[i] = band + Math.min(reach, amplitude * reach * shape);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(MAX_FRAME_SEC, Math.max(0, now - last) / 1000);
      last = now;
      const voice = dynamics.update(deps.paused ? 0 : deps.level, dt);
      presence = follow(presence, deps.paused ? 0 : 1, dt, PRESENCE_SEC);
      const still = deps.paused || reducedMotion;
      const tempo = still ? 0 : 1 + TEMPO_GAIN * voice.energy;
      const target = IDLE_AMPLITUDE + VOICE_GAIN * voice.voice;
      flow += dt * tempo * FLOW_PX;

      ctx.clearRect(0, 0, width, height);
      const gradient = createFlowGradient(ctx, FLOW_COLORS, width, flow);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = EDGE_WIDTH_PX;
      WAVE_LAYERS.forEach((layer, index) => {
        blobs[index].advance(dt * tempo);
        const spring = Math.max(0, springs[index].step(dt, target));
        fillDepths(index, spring * layer.depth * presence);
        traceWave(ctx, depths, SAMPLE_STEP_PX, band - 1);
        ctx.globalAlpha = layer.alpha;
        ctx.fill();
        ctx.globalAlpha = layer.edgeAlpha * presence;
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, band);

      const settled = deps.paused && presence < SETTLED_LEVEL;
      frame = settled ? 0 : requestAnimationFrame(draw);
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
