import { WaveLayer } from '../types/WaveLayer';

const smoothstep = (t: number) => t * t * (3 - 2 * t);

const catmullRom = (
  p0: number,
  p1: number,
  p2: number,
  p3: number,
  t: number,
) =>
  0.5 *
  (2 * p1 +
    (p2 - p0) * t +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
    (3 * p1 - p0 - 3 * p2 + p3) * t * t * t);

const randomPeak = (index: number) =>
  index % 2 ? 0.6 + 0.4 * Math.random() : 0.12 + 0.35 * Math.random();

export const createLineBlob = (layer: WaveLayer) => {
  let from = new Float32Array(0);
  let to = new Float32Array(0);
  let current = new Float32Array(0);
  let progress = 0;
  let drift = 0;

  const resize = (width: number) => {
    const half = Math.ceil((width / layer.spacingPx + 4) / 2);
    const count = half * 2;
    from = Float32Array.from({ length: count }, (_, i) => randomPeak(i));
    to = Float32Array.from({ length: count }, (_, i) => randomPeak(i));
    current = new Float32Array(count);
    progress = 0;
  };

  const retarget = () => {
    from = to;
    to = Float32Array.from({ length: from.length }, (_, i) => randomPeak(i));
  };

  const advance = (dt: number) => {
    progress += dt * layer.morphSpeed;
    while (progress >= 1) {
      progress -= 1;
      retarget();
    }
    drift += dt * layer.driftPx;
    const eased = smoothstep(progress);
    for (let i = 0; i < current.length; i++) {
      current[i] = from[i] + (to[i] - from[i]) * eased;
    }
  };

  const at = (index: number) => {
    const count = current.length;
    return current[((index % count) + count) % count];
  };

  const sample = (x: number) => {
    const position = (x + drift) / layer.spacingPx;
    const index = Math.floor(position);
    const t = position - index;
    const value = catmullRom(
      at(index - 1),
      at(index),
      at(index + 1),
      at(index + 2),
      t,
    );
    return Math.min(1, Math.max(0, value));
  };

  return { resize, advance, sample };
};
