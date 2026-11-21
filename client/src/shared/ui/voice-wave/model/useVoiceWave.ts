import { createEffect, createSignal, onCleanup, untrack } from 'solid-js';

import {
  DRIFT_ENERGY_GAIN,
  DRIFT_IDLE,
  EDGE_WIDTH_PX,
  FLOW_COLOR_TOKENS,
  FLOW_ENERGY_PX,
  FLOW_IDLE_PX,
  IDLE_AMPLITUDE,
  MAX_DPR,
  MAX_FRAME_SEC,
  MIN_SHAPE,
  MORPH_BURST,
  MORPH_BURST_SEC,
  MORPH_ENERGY_GAIN,
  MORPH_IDLE,
  ONSET_KICK,
  ONSET_KICK_FLOOR,
  PRESENCE_SEC,
  SAMPLE_STEP_PX,
  SETTLED_LEVEL,
  SUSTAIN_GAIN,
  WAVE_LAYERS,
} from '../config/voiceWaveConfig';
import { createFlowGradient } from '../lib/createFlowGradient';
import { createLineBlob } from '../lib/createLineBlob';
import { createSpring } from '../lib/createSpring';
import { createVoiceDynamics } from '../lib/createVoiceDynamics';
import { follow } from '../lib/follow';
import { paintSheen } from '../lib/paintSheen';
import { softClip } from '../lib/softClip';
import { traceWave, traceWaveEdge } from '../lib/traceWave';
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
    let count = 0;
    let width = 0;
    let height = 0;
    let band = 0;
    let colors: string[] = [];
    let presence = untrack(() => (deps.paused ? 0 : 1));
    let burst = 0;
    let flow = 0;
    let time = 0;
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
      count = Math.ceil(width / SAMPLE_STEP_PX) + 2;
      depths = new Float32Array(count);
      blobs.forEach((blob) => blob.resize(width));
      const styles = getComputedStyle(node);
      colors = FLOW_COLOR_TOKENS.map((token) =>
        styles.getPropertyValue(token).trim(),
      );
    };

    const fillDepths = (index: number) => {
      const reach = height - band;
      const amplitude =
        Math.max(0, springs[index].value()) *
        WAVE_LAYERS[index].depth *
        reach *
        presence;
      for (let i = 0; i < count; i++) {
        const shape =
          MIN_SHAPE + (1 - MIN_SHAPE) * blobs[index].sample(i * SAMPLE_STEP_PX);
        depths[i] = band + softClip(amplitude * shape, reach);
      }
    };

    const draw = (now: number) => {
      const dt = Math.min(MAX_FRAME_SEC, (now - last) / 1000);
      last = now;
      const voice = dynamics.update(deps.paused ? 0 : deps.level, dt);
      presence = follow(presence, deps.paused ? 0 : 1, dt, PRESENCE_SEC);
      const motion = deps.paused || reducedMotion ? 0 : 1;
      time += dt * motion;
      burst = follow(burst, 0, dt, MORPH_BURST_SEC);
      if (voice.isNewOnset && motion) burst += MORPH_BURST;
      flow += dt * motion * (FLOW_IDLE_PX + FLOW_ENERGY_PX * voice.energy);

      const target = IDLE_AMPLITUDE + voice.voice * SUSTAIN_GAIN;
      WAVE_LAYERS.forEach((layer, index) => {
        const spring = springs[index];
        if (voice.isNewOnset && motion) {
          spring.kick(
            time + layer.lagSec,
            ONSET_KICK * Math.max(ONSET_KICK_FLOOR, voice.voice),
          );
        }
        if (reducedMotion) spring.settle(target);
        else spring.step(dt, time, target);
        blobs[index].advance(
          dt * motion,
          MORPH_IDLE + MORPH_ENERGY_GAIN * voice.energy + burst,
          DRIFT_IDLE + DRIFT_ENERGY_GAIN * voice.energy,
        );
      });

      ctx.clearRect(0, 0, width, height);
      const gradient = createFlowGradient(ctx, colors, width, flow);
      ctx.fillStyle = gradient;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = EDGE_WIDTH_PX;
      WAVE_LAYERS.forEach((layer, index) => {
        fillDepths(index);
        ctx.globalAlpha = layer.alpha;
        traceWave(ctx, depths, count, SAMPLE_STEP_PX, band - 1);
        ctx.fill();
        ctx.globalAlpha = layer.edgeAlpha * presence;
        ctx.beginPath();
        traceWaveEdge(ctx, depths, count, SAMPLE_STEP_PX);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.fillRect(0, 0, width, band);
      paintSheen(ctx, width, height, time, voice.energy * presence);

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
