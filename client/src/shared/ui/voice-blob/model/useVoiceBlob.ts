import { createEffect, onCleanup } from 'solid-js';

import {
  ATTACK_SEC,
  BASE_RADIUS_RATIO,
  BLOB_LAYERS,
  BLOB_POINTS,
  HIDDEN_SCALE,
  RELEASE_SEC,
  SETTLED_LEVEL,
} from '../config/voiceBlobConfig';
import { VoiceBlobProps } from '../types/VoiceBlobProps';

const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const follow = (current: number, target: number, dt: number) => {
  const tau = target > current ? ATTACK_SEC : RELEASE_SEC;
  return current + (target - current) * (1 - Math.exp(-dt / tau));
};

type Point = [number, number];

const toPoint = ([x, y]: Point) => `${x.toFixed(1)} ${y.toFixed(1)}`;

const blobPath = (
  center: number,
  radius: number,
  wobble: number,
  time: number,
) => {
  const points = Array.from({ length: BLOB_POINTS }, (_, index): Point => {
    const angle = (index / BLOB_POINTS) * Math.PI * 2;
    const offset =
      Math.sin(angle * 2 + time * 1.7) * 0.5 +
      Math.sin(angle * 3 - time * 1.1) * 0.35 +
      Math.sin(angle * 5 + time * 2.3) * 0.15;
    const r = radius * (1 + wobble * offset);
    return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
  });
  const midpoint = (index: number): Point => {
    const [x1, y1] = points[index % BLOB_POINTS];
    const [x2, y2] = points[(index + 1) % BLOB_POINTS];
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  };
  const curves = points.map(
    (_, index) =>
      `Q ${toPoint(points[(index + 1) % BLOB_POINTS])} ${toPoint(midpoint(index + 1))}`,
  );
  return `path("M ${toPoint(midpoint(0))} ${curves.join(' ')} Z")`;
};

export const useVoiceBlob = (props: VoiceBlobProps) => {
  const layers: HTMLDivElement[] = [];

  const setLayer = (index: number) => (node: HTMLDivElement) => {
    layers[index] = node;
  };

  const rootStyle = () => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
  });

  createEffect(() => {
    const size = props.size;
    const center = size / 2;
    const baseRadius = size * BASE_RADIUS_RATIO;
    let level = 0;
    let presence = 1;
    let time = 0;
    let last = performance.now();
    let frame = 0;

    const paintLayer = (index: number) => {
      const layer = BLOB_LAYERS[index];
      const shrink = HIDDEN_SCALE + (1 - HIDDEN_SCALE) * presence;
      const radius = baseRadius * (layer.scale + layer.growth * level) * shrink;
      const wobble = reducedMotion ? 0 : layer.wobble * (0.6 + level);
      const node = layers[index];
      node.style.clipPath = blobPath(
        center,
        radius,
        wobble,
        time * layer.speed,
      );
      node.style.opacity = String(presence);
    };

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      level = follow(level, props.paused ? 0 : props.level, dt);
      presence = follow(presence, props.paused ? 0 : 1, dt);
      if (!props.paused && !reducedMotion) time += dt * (0.6 + level * 1.4);
      BLOB_LAYERS.forEach((_, index) => paintLayer(index));
      const settled = props.paused && presence < SETTLED_LEVEL;
      frame = settled ? 0 : requestAnimationFrame(draw);
    };

    createEffect(() => {
      if (props.paused || frame) return;
      last = performance.now();
      frame = requestAnimationFrame(draw);
    });

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return { setLayer, rootStyle, layerCount: BLOB_LAYERS.length };
};
