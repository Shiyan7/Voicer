import { createEffect, createSignal, onCleanup } from 'solid-js';

import {
  ATTACK_SEC,
  BASE_RADIUS_RATIO,
  BLOB_LAYERS,
  BLOB_POINTS,
  LEVEL_GAIN,
  MAX_DPR,
  RELEASE_SEC,
  STROKE_WIDTH,
} from '../config/voiceBlobConfig';
import { VoiceBlobProps } from '../types/VoiceBlobProps';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const follow = (current: number, target: number, dt: number) => {
  const tau = target > current ? ATTACK_SEC : RELEASE_SEC;
  return current + (target - current) * (1 - Math.exp(-dt / tau));
};

const traceBlob = (
  ctx: CanvasRenderingContext2D,
  center: number,
  radius: number,
  wobble: number,
  time: number,
) => {
  const points = Array.from({ length: BLOB_POINTS }, (_, index) => {
    const angle = (index / BLOB_POINTS) * Math.PI * 2;
    const offset =
      Math.sin(angle * 2 + time * 1.7) * 0.5 +
      Math.sin(angle * 3 - time * 1.1) * 0.35 +
      Math.sin(angle * 5 + time * 2.3) * 0.15;
    const r = radius * (1 + wobble * offset);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  });
  const midpoint = (index: number) => {
    const [x1, y1] = points[index % BLOB_POINTS];
    const [x2, y2] = points[(index + 1) % BLOB_POINTS];
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  };

  ctx.beginPath();
  ctx.moveTo(...(midpoint(0) as [number, number]));
  for (let index = 1; index <= BLOB_POINTS; index++) {
    const [cx, cy] = points[index % BLOB_POINTS];
    const [mx, my] = midpoint(index);
    ctx.quadraticCurveTo(cx, cy, mx, my);
  }
  ctx.closePath();
};

export const useVoiceBlob = (props: VoiceBlobProps) => {
  const [canvas, setCanvas] = createSignal<HTMLCanvasElement>();

  const canvasStyle = () => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
  });

  createEffect(() => {
    const node = canvas();
    const ctx = node?.getContext('2d');
    if (!node || !ctx) return;

    const size = props.size;
    const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
    node.width = Math.round(size * dpr);
    node.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const color = getComputedStyle(node).color;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = STROKE_WIDTH;

    const center = size / 2;
    const baseRadius = size * BASE_RADIUS_RATIO;
    let level = 0;
    let time = 0;
    let last = performance.now();
    let frame = 0;

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const target = props.paused
        ? 0
        : Math.min(1, Math.sqrt(props.level) * LEVEL_GAIN);
      level = follow(level, target, dt);
      if (!props.paused && !reducedMotion) time += dt * (0.6 + level * 1.4);

      ctx.clearRect(0, 0, size, size);
      for (const layer of BLOB_LAYERS) {
        ctx.globalAlpha = layer.alpha;
        const radius = baseRadius * (layer.scale + layer.growth * level);
        const wobble = reducedMotion ? 0 : layer.wobble * (0.6 + level);
        traceBlob(ctx, center, radius, wobble, time * layer.speed);
        ctx.fill();
        ctx.globalAlpha = layer.stroke;
        ctx.stroke();
      }
      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);
    onCleanup(() => cancelAnimationFrame(frame));
  });

  return { setCanvas, canvasStyle };
};
