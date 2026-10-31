import { LOBE_SPAN, VOICE_LOBES, VoiceBeamDriverConfig } from './voiceBeamConfig';

type Point = [number, number];

interface Shape {
  cx: number;
  w: number;
  h: number;
  mw: number;
  lift: number;
  strength: number;
  level: number;
  corner: number;
}

interface Registration {
  el: HTMLElement;
  getConfig: () => VoiceBeamDriverConfig;
  getLevel: () => number;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  haloCanvas: HTMLCanvasElement | null;
  haloCtx: CanvasRenderingContext2D | null;
  displace: SVGFEDisplacementMapElement | null;
  noiseShift: SVGFEOffsetElement | null;
  filter: SVGFilterElement | null;
  filterTop: number;
  state: BeamState;
  paintedConfig: VoiceBeamDriverConfig | null;
  cssBlur: string | null;
  warpOff: boolean;
}

interface BeamState {
  level: number;
  bands: [number, number, number];
  phase: number;
  t: number;
  lastTs: number;
  warp: number;
}

const TAU = Math.PI * 2;
const FRAME_MS = 1000 / 60 - 2;
const SLOW_FRAME_MS = 22;
const SLOW_GRACE_MS = 500;
const HALF_RATE_MS = 4000;
const MAX_DPR = 2;
const WARP_RELEASE = 0.06;
const WARP_ATTACK = 0.35;
const WARP_OFF = 0.03;
const FILTER_STEP = 0.05;
const FILTER_PAD_TOP = 6;
const FILTER_PAD_BOTTOM = 12;
const FILTER_MIN_BOTTOM = 0.1;
const FILTER_PAD_X = 0.1;
const RANGE_WIDTH = 170;
const RANGE_HEIGHT = 64;
const BAND_POINTS = 56;
const IS_WEBKIT =
  typeof navigator !== 'undefined' &&
  /AppleWebKit/.test(navigator.userAgent) &&
  !/Chrome\/|Chromium\/|Edg\/|OPR\//.test(navigator.userAgent);
const CAN_RESIZE_FILTER = !IS_WEBKIT;

const registrations = new Set<Registration>();
let frame: number | null = null;
let lastFrame = 0;
let lastTick = 0;
let halfRate = false;
let skipFrame = false;
let slowSince = 0;
let halfRateUntil = 0;
const sample = { level: 0, bands: [0, 0, 0] as [number, number, number] };

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const wrap = (value: number, span: number) => {
  const half = span / 2;
  return (((value + half) % span) + span) % span - half;
};

const edgeFalloff = (value: number, span: number) => {
  const ratio = value / (span / 2 + 4);
  return Math.max(0, 1 - ratio * ratio);
};

const gate = (value: number, threshold: number) => {
  if (value <= threshold) return 0;
  const ratio = (value - threshold) / Math.max(1e-3, 1 - threshold);
  return clamp01((1 - Math.exp(-3 * ratio)) / (1 - Math.exp(-3)));
};

const follow = (
  current: number,
  target: number,
  dt: number,
  attack: number,
  release: number,
) => {
  const tau = target > current ? attack : release;
  const k = 1 - Math.exp(-dt / Math.max(1e-3, tau));
  return current + (target - current) * k;
};

const bell = (x: number, curve: number, spread: number, skew: number) => {
  const side = x < 0 ? 1 - skew : 1 + skew;
  const width = Math.max(0.05, spread * side);
  const value = Math.exp(-Math.pow(Math.abs(x) / width, curve));
  const floor = Math.exp(-Math.pow(1 / width, curve));
  return Math.max(0, (value - floor) / (1 - floor));
};

const tail = (
  distance: number,
  reach: number,
  amount: number,
  position: number,
  curve: number,
) => {
  if (amount <= 0 || reach <= 0) return 0;
  const start = reach * Math.max(0, Math.min(0.98, position));
  if (distance <= start) return 0;
  const ratio = Math.min(1, (distance - start) / Math.max(1, reach - start));
  return amount * Math.pow(ratio, Math.max(0.5, curve));
};

const cornerRadius = (radius: number, width: number, height: number) =>
  Math.max(0, Math.min(radius, width / 2, height / 2));

const cornerDrop = (x: number, width: number, radius: number, inset = 0) => {
  if (radius <= 0) return 0;
  const edge = Math.min(x, width - x) - inset;
  if (edge >= radius) return 0;
  if (edge <= 0) return radius;
  const d = radius - edge;
  return radius - Math.sqrt(Math.max(0, radius * radius - d * d));
};

const bandLine = (
  config: VoiceBeamDriverConfig,
  shape: Shape,
  width: number,
  height: number,
): Point[] => {
  const center = width / 2 + shape.cx * shape.w;
  const half = RANGE_WIDTH * config.rangeWidth * shape.w * shape.mw;
  const maxRise = height * 0.82 * Math.min(1, config.scale);
  const rise = Math.min(
    maxRise,
    (RANGE_HEIGHT * config.rangeHeight * shape.h + shape.lift) *
      config.bandPosition,
  );
  const base = height - config.bandOffset;
  const cornerMix = Math.min(1, shape.corner * 4);
  const tailAmount =
    config.bandTail * (1 - cornerMix * cornerMix * (3 - 2 * cornerMix));
  const hasTail = tailAmount > 1e-3;
  const overflow = hasTail ? config.bandTailOverflow : 0;
  const from = hasTail ? -overflow : center - half;
  const to = hasTail ? width + overflow : center + half;
  const points: Point[] = [];

  for (let i = 0; i <= BAND_POINTS; i++) {
    const x = from + ((to - from) * i) / BAND_POINTS;
    const u = Math.max(-1, Math.min(1, (x - center) / Math.max(1, half)));
    const reach = (x < center ? center : width - center) + overflow;
    const lift =
      bell(u, config.bandCurve, config.bandSpread, config.bandSkew) +
      tail(
        Math.abs(x - center),
        reach,
        tailAmount,
        config.bandTailPosition,
        config.bandTailCurve,
      );
    const drop =
      shape.corner > 0
        ? cornerDrop(x, width, cornerRadius(config.radius, width, height)) *
          shape.corner
        : 0;
    points.push([x, base - rise * lift - drop]);
  }
  return points;
};

const writeClips = (
  el: HTMLElement,
  id: string,
  points: Point[],
  width: number,
  height: number,
) => {
  for (const [suffix, factor] of [
    ['', 1],
    ['-z', 0.5],
  ] as const) {
    const px = (value: number) => (value * factor).toFixed(1) + 'px';
    const line = points.map(([x, y]) => `${px(x)} ${px(y)}`);
    const below = `polygon(0 ${px(height)}, ${line.join(', ')}, ${px(width)} ${px(height)})`;
    const above = `polygon(0 0, ${px(width)} 0, ${px(width)} ${px(height)}, ${line.slice().reverse().join(', ')}, 0 ${px(height)})`;
    el.style.setProperty(`--vb-clip-below${suffix}-${id}`, below);
    el.style.setProperty(`--vb-clip-above${suffix}-${id}`, above);
  }
};

const fitFilter = (reg: Registration, points: Point[], height: number) => {
  let top = height;
  for (const point of points) if (point[1] < top) top = point[1];
  const start = Math.max(
    0,
    Math.min(
      0.9,
      Math.floor((top - FILTER_PAD_TOP) / height / FILTER_STEP) * FILTER_STEP,
    ),
  );
  if (start === reg.filterTop || !reg.filter) return;
  reg.filterTop = start;
  const bottom = 1 + Math.max(FILTER_MIN_BOTTOM, FILTER_PAD_BOTTOM / height);
  reg.filter.setAttribute('x', `${-FILTER_PAD_X * 100}%`);
  reg.filter.setAttribute('width', `${(1 + 2 * FILTER_PAD_X) * 100}%`);
  reg.filter.setAttribute('y', `${(start * 100).toFixed(0)}%`);
  reg.filter.setAttribute('height', `${((bottom - start) * 100).toFixed(1)}%`);
};

const drawBand = (
  reg: Registration,
  config: VoiceBeamDriverConfig,
  shape: Shape,
  points: Point[],
) => {
  const { canvas, ctx, el } = reg;
  if (!canvas || !ctx) return;
  const width = el.clientWidth;
  const height = el.clientHeight;
  if (!width || !height) return;
  const dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
  const pw = Math.round(width * dpr);
  const ph = Math.round(height * dpr);
  if (canvas.width !== pw || canvas.height !== ph) {
    canvas.width = pw;
    canvas.height = ph;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const halo = reg.haloCanvas;
  const haloCtx = reg.haloCtx;
  if (halo && haloCtx) {
    if (halo.width !== pw || halo.height !== ph) {
      halo.width = pw;
      halo.height = ph;
    }
    haloCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    haloCtx.clearRect(0, 0, width, height);
  }

  const strength = Math.min(1, 0.6 * config.bandStrength * shape.strength);
  if (strength < 5e-3 || config.bandWidth <= 0) return;

  const isDark = config.theme === 'dark';
  const bandWidth = config.bandWidth * (1 + 0.35 * shape.level);
  const aberration = config.bandAberration * (0.35 + 0.65 * shape.level);
  const offsetY = (4 + 12 * aberration) * config.scale;
  const offsetX = 4 * aberration * config.scale;
  const trace = (dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(points[0][0] + dx, points[0][1] + dy);
    for (let i = 1; i < points.length; i++)
      ctx.lineTo(points[i][0] + dx, points[i][1] + dy);
  };
  const colors = config.bandColors;
  const alpha = (isDark ? 0.42 : 0.4) * strength;
  const lineWidth = 14 * bandWidth;
  const blur = (3.5 * config.bandWidth) / 2;
  const blurPx = blur * dpr;
  const canFilter = typeof ctx.filter === 'string';
  const cssBlur = canFilter ? '0px' : `${blur.toFixed(2)}px`;
  if (reg.cssBlur !== cssBlur) {
    el.style.setProperty(`--vb-band-blur-${config.id}`, cssBlur);
    el.style.setProperty(
      `--vb-band-halo-blur-${config.id}`,
      canFilter ? '0px' : `${(blur * 3).toFixed(2)}px`,
    );
    reg.cssBlur = cssBlur;
  }
  const passes: [number, number][] = [
    [1, 0.16],
    [0.72, 0.2],
    [0.46, 0.26],
    [0.22, 0.34],
  ];
  const fringes = [
    { rgb: colors.above, a: 1, ox: offsetX, oy: -offsetY },
    { rgb: colors.mid, a: 0.55, ox: offsetX * 0.35, oy: -offsetY * 0.35 },
    { rgb: colors.below, a: 1, ox: -offsetX, oy: offsetY },
    { rgb: colors.core, a: 0.9, ox: 0, oy: 0 },
  ];
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalCompositeOperation = 'source-over';
  const left = points[0][0];
  const right = points[points.length - 1][0];
  const gradient = (rgb: string, a: number) => {
    const g = ctx.createLinearGradient(left, 0, right, 0);
    const stop = config.bandTail > 0 ? 0.015 : 0.18;
    g.addColorStop(0, `rgba(${rgb}, 0)`);
    g.addColorStop(stop, `rgba(${rgb}, ${a.toFixed(3)})`);
    g.addColorStop(1 - stop, `rgba(${rgb}, ${a.toFixed(3)})`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    return g;
  };
  const haloTarget = !canFilter && haloCtx ? haloCtx : ctx;
  if (canFilter) ctx.filter = `blur(${(blurPx * 3).toFixed(1)}px)`;
  haloTarget.lineCap = 'round';
  haloTarget.lineJoin = 'round';
  haloTarget.strokeStyle = gradient(colors.core, alpha * 0.3);
  haloTarget.lineWidth = lineWidth * 2.2;
  haloTarget.beginPath();
  haloTarget.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++)
    haloTarget.lineTo(points[i][0], points[i][1]);
  haloTarget.stroke();
  if (canFilter) ctx.filter = `blur(${blurPx.toFixed(1)}px)`;
  for (const fringe of fringes)
    for (const [widthFactor, passAlpha] of passes) {
      ctx.strokeStyle = gradient(fringe.rgb, alpha * fringe.a * passAlpha);
      ctx.lineWidth = Math.max(0.6, lineWidth * widthFactor);
      trace(fringe.ox, fringe.oy);
      ctx.stroke();
    }
  if (canFilter) ctx.filter = 'none';
  ctx.globalCompositeOperation = 'source-over';
};

const easeCycle = (value: number) => (1 - Math.cos(TAU * value)) / 2;

const paint = (reg: Registration, now: number) => {
  const { el, state } = reg;
  const config = reg.getConfig();
  const paused = config.paused;
  if (paused && reg.paintedConfig === config) return;
  const dt = paused
    ? 0
    : state.lastTs
      ? Math.min(0.05, (now - state.lastTs) / 1000)
      : 1 / 60;
  state.lastTs = now;
  state.t += dt;
  const t = state.t;

  if (!paused) {
    const level = clamp01(reg.getLevel());
    sample.level = level;
    sample.bands[0] = level;
    sample.bands[1] = level * (0.72 + 0.28 * Math.sin(t * 9.1));
    sample.bands[2] = level * (0.6 + 0.4 * Math.sin(t * 13.7 + 2));
  }

  const withRest = (value: number) =>
    config.restLevel + (1 - config.restLevel) * value;
  const gated = withRest(gate(sample.level, config.threshold));
  state.level = follow(state.level, gated, dt, config.attack, config.release);
  for (let i = 0; i < 3; i++) {
    const band = withRest(gate(sample.bands[i], config.threshold * 0.6));
    state.bands[i] = follow(
      state.bands[i],
      band,
      dt,
      config.attack,
      config.release * 1.15,
    );
  }

  const span = LOBE_SPAN * config.lobeSpacing;
  const width = el.clientWidth;
  const height = el.clientHeight;
  const breathe = config.reducedMotion
    ? 0.5
    : 0.5 + 0.5 * Math.sin((TAU * t) / config.breatheDuration);
  const voice = state.level + (1 - state.level) * config.idle * breathe;
  const glow = 0.15 + 0.85 * voice;
  const reach = 0.5 + config.reach * voice;
  const spread = 0.85 + config.spread * voice;

  if (config.flow !== 0 && !config.reducedMotion) {
    state.phase = (((state.phase + config.flow * voice * dt) % span) + span) % span;
  }
  el.style.setProperty(`--vb-level-${config.id}`, state.level.toFixed(3));
  el.style.setProperty(`--vb-cx-${config.id}`, '0.0px');
  el.style.setProperty(`--vb-mw-${config.id}`, '1.000');

  const lift = config.bend * voice;
  el.style.setProperty(`--vb-bh-${config.id}`, `${Math.max(0, lift).toFixed(1)}px`);
  const bendStrength = config.bend > 0 ? Math.min(1, lift / config.bend) : 0;
  el.style.setProperty(`--vb-bendA-${config.id}`, bendStrength.toFixed(3));

  const shape: Shape = {
    cx: 0,
    w: spread,
    h: reach,
    mw: 1,
    lift,
    strength: bendStrength,
    level: state.level,
    corner: 0,
  };
  el.style.setProperty(`--vb-cy-${config.id}`, '0.0px');
  state.warp = follow(state.warp, 1, dt, WARP_ATTACK, WARP_RELEASE);

  const warpOff = reg.displace != null && state.warp < WARP_OFF;
  if (warpOff !== reg.warpOff) {
    reg.warpOff = warpOff;
    if (warpOff) el.setAttribute('data-voice-warp', 'off');
    else el.removeAttribute('data-voice-warp');
  }

  if (width && height && (reg.ctx || reg.displace)) {
    const points = bandLine(config, shape, width, height);
    if ((reg.displace && !warpOff) || config.coreLight > 0)
      writeClips(el, config.id, points, width, height);
    if (reg.filter && !warpOff && CAN_RESIZE_FILTER)
      fitFilter(reg, points, height);
    if (reg.ctx) drawBand(reg, config, shape, points);
  }

  if (reg.displace && !warpOff) {
    const amount = config.reducedMotion
      ? 0
      : config.distortion * 120 * config.scale * (0.15 + 0.85 * voice) * state.warp;
    reg.displace.scale.baseVal = amount;
    if (reg.noiseShift) {
      reg.noiseShift.dx.baseVal = 8 * config.scale * Math.sin(t * 0.9);
      reg.noiseShift.dy.baseVal = 4 * config.scale * Math.sin(t * 0.6 + 1.3);
    }
  }

  el.style.setProperty(`--vb-glow-${config.id}`, glow.toFixed(3));
  el.style.setProperty(`--vb-h-${config.id}`, reach.toFixed(3));
  el.style.setProperty(`--vb-w-${config.id}`, spread.toFixed(3));

  for (let i = 0; i < VOICE_LOBES.length; i++) {
    const lobe = VOICE_LOBES[i];
    const x = wrap(lobe.x * config.lobeSpacing + state.phase, span);
    const bandLift = config.bands ? 0.6 + 0.7 * state.bands[lobe.band] : 1;
    el.style.setProperty(`--vb-x${i}-${config.id}`, `${x.toFixed(1)}px`);
    el.style.setProperty(
      `--vb-l${i}-${config.id}`,
      (bandLift * edgeFalloff(x, span)).toFixed(3),
    );
    el.style.setProperty(`--vb-y${i}-${config.id}`, '0.0px');
  }

  const hue =
    config.staticColors || config.reducedMotion || config.hueRange === 0
      ? 0
      : -config.hueRange +
        2 * config.hueRange * easeCycle(t / config.hueDuration);
  el.style.setProperty(`--vb-hue-${config.id}`, `${hue.toFixed(2)}deg`);
  reg.paintedConfig = config;
};

const tick = (now: number) => {
  frame = requestAnimationFrame(tick);
  const delta = lastTick ? now - lastTick : 0;
  lastTick = now;
  if (halfRate) {
    skipFrame = !skipFrame;
    if (skipFrame) return;
    if (now >= halfRateUntil) {
      halfRate = false;
      slowSince = 0;
    }
  } else if (delta > SLOW_FRAME_MS) {
    if (!slowSince) slowSince = now;
    else if (now - slowSince > SLOW_GRACE_MS) {
      halfRate = true;
      skipFrame = false;
      halfRateUntil = now + HALF_RATE_MS;
    }
  } else {
    slowSince = 0;
  }
  if (now - lastFrame < FRAME_MS) return;
  lastFrame = now;
  registrations.forEach((reg) => paint(reg, now));
};

const startLoop = () => {
  if (frame != null) return;
  lastFrame = 0;
  lastTick = 0;
  slowSince = 0;
  frame = requestAnimationFrame(tick);
};

const stopLoop = () => {
  if (registrations.size === 0 && frame != null) {
    cancelAnimationFrame(frame);
    frame = null;
  }
};

export const registerVoiceBeam = (
  el: HTMLElement,
  getConfig: () => VoiceBeamDriverConfig,
  getLevel: () => number,
) => {
  const canvas = el.querySelector<HTMLCanvasElement>(':scope > [data-voice-beam-band]');
  const haloCanvas = el.querySelector<HTMLCanvasElement>(
    ':scope > [data-voice-beam-band-halo]',
  );
  const reg: Registration = {
    el,
    getConfig,
    getLevel,
    canvas,
    ctx: canvas?.getContext('2d') ?? null,
    haloCanvas,
    haloCtx: haloCanvas?.getContext('2d') ?? null,
    displace: el.querySelector(':scope > svg feDisplacementMap'),
    noiseShift: el.querySelector(':scope > svg feOffset'),
    filter: el.querySelector(':scope > svg filter'),
    filterTop: -1,
    state: { level: 0, bands: [0, 0, 0], phase: 0, t: 0, lastTs: 0, warp: 1 },
    paintedConfig: null,
    cssBlur: null,
    warpOff: el.hasAttribute('data-voice-warp'),
  };
  registrations.add(reg);
  startLoop();
  return () => {
    registrations.delete(reg);
    stopLoop();
  };
};

export const canvasSupportsFilter = (() => {
  if (typeof document === 'undefined') return true;
  const ctx = document.createElement('canvas').getContext('2d');
  return !!ctx && typeof ctx.filter === 'string';
})();
