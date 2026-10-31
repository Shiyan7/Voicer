import { VOICE_LOBES, VoiceBeamCssConfig } from './voiceBeamConfig';

interface LobeLayer {
  id: string;
  colors: string[];
  alpha: number;
  sw: number;
  sh: number;
  y: number;
  fade: number;
}

const withAlpha = (color: string, alpha: number) => {
  const match = color.match(/^rgb\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)$/);
  return match
    ? `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha.toFixed(2)})`
    : color;
};

const blurSize = (value: number, factor = 1) =>
  Math.max(0.5, Math.round(value * factor * 100) / 100);

const lobeX = (index: number, id: string) =>
  `calc(50% + (var(--vb-cx-${id}) + var(--vb-x${index}-${id})) * var(--vb-w-${id}) * var(--vb-z-${id}, 1))`;

const lobeGradients = (layer: LobeLayer) => {
  const { id, colors, alpha, sw, sh, y, fade } = layer;
  return VOICE_LOBES.map((lobe, index) => {
    const color =
      alpha >= 1
        ? colors[index % colors.length]
        : withAlpha(colors[index % colors.length], alpha);
    const width = `calc(${Math.round(lobe.w * sw)}px * var(--vb-w-${id}) * var(--vb-z-${id}, 1))`;
    const height = `calc(${Math.round(lobe.h * sh)}px * var(--vb-h-${id}) * var(--vb-l${index}-${id}) * var(--vb-z-${id}, 1))`;
    const top = `calc(100% + (${y}px + var(--vb-y${index}-${id})) * var(--vb-z-${id}, 1))`;
    return `radial-gradient(ellipse ${width} ${height} at ${lobeX(index, id)} ${top}, ${color} 0%, transparent ${fade}%)`;
  }).join(',\n    ');
};

export const buildVoiceBeamCss = (config: VoiceBeamCssConfig) => {
  const {
    id: e,
    borderRadius: a,
    borderWidth: r,
    strokeOpacity,
    innerOpacity,
    bloomOpacity,
    innerShadow,
    colors,
    brightness,
    saturation,
    theme,
    hueBase,
    glowSize,
    glowWidth,
    glowHeight,
    strokeScale,
    innerScale,
    innerHeight,
    bloomScale,
    bloomHeight,
    coreSize,
    coreLight,
    coreLightWidth,
    coreLightHeight,
    rangeWidth,
    rangeHeight,
    softness,
    distortion,
    scale,
  } = config;

  const edgeFade = Math.round(28 * scale * 10) / 10;
  const shadowBlur = Math.round(9 * scale * 10) / 10;
  const innerRadius = Math.max(0, a - r);
  const fade = Math.round(Math.max(40, Math.min(95, 70 * softness)));
  const sw = (value: number) => glowWidth * value;
  const sh = (value: number) => glowHeight * value;
  const round1 = (value: number) => Math.round(value * 10) / 10;
  const z = `var(--vb-z-${e}, 1)`;
  const px = (value: number) => `calc(${round1(value)}px * ${z})`;
  const isDark = theme === 'dark';
  const stroke = strokeOpacity.toFixed(2);
  const inner = innerOpacity.toFixed(2);
  const bloom = bloomOpacity.toFixed(2);
  const bright = brightness.toFixed(2);
  const sat = saturation.toFixed(2);
  const hue = `hue-rotate(calc(var(--voice-hue-base, ${hueBase}deg) + var(--vb-hue-${e})))`;
  const warpFilter = distortion ? ` url(#vb-distort-${e})` : '';
  const colorFilter = `filter: ${hue} brightness(${bright}) saturate(${sat});`;
  const warpColorFilter = `filter: ${hue} brightness(${bright}) saturate(${sat})${warpFilter};`;
  const bloomFilter = `filter: blur(${px(blurSize(10, glowSize))}) ${hue} brightness(${bright}) saturate(${sat});`;
  const warpBloomFilter = `filter: blur(${px(blurSize(10, glowSize))}) ${hue} brightness(${bright}) saturate(${sat})${warpFilter};`;
  const centerX = `calc(50% + var(--vb-cx-${e}) * var(--vb-w-${e}) * ${z})`;
  const coreY = `calc(100% + (2px + var(--vb-cy-${e})) * ${z})`;
  const core = isDark
    ? `radial-gradient(ellipse calc(${round1(30 * coreSize)}px * var(--vb-w-${e}) * ${z}) calc(${round1(30 * coreSize)}px * var(--vb-h-${e}) * ${z}) at ${centerX} ${coreY}, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.14) 30%, transparent 65%)`
    : `radial-gradient(ellipse calc(${round1(40 * coreSize)}px * var(--vb-w-${e}) * ${z}) calc(${round1(30 * coreSize)}px * var(--vb-h-${e}) * ${z}) at ${centerX} ${coreY}, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.22) 35%, transparent 70%)`;
  const strokeLobes = lobeGradients({ id: e, colors, alpha: 1, sw: sw(strokeScale), sh: sh(strokeScale), y: 2, fade });
  const innerLobes = lobeGradients({ id: e, colors, alpha: 0.46, sw: sw(0.9 * innerScale), sh: sh(0.9 * innerScale * innerHeight), y: 0, fade });
  const bloomLobes = lobeGradients({ id: e, colors, alpha: isDark ? 0.9 : 0.7, sw: sw(1.15 * bloomScale), sh: sh(1.5 * bloomScale * bloomHeight), y: 0, fade: Math.min(95, fade + 2) });
  const rangeMask = (w: number, h: number, mid: number, tail = 0) =>
    `radial-gradient(ellipse calc(${round1(w * rangeWidth)}px * var(--vb-w-${e}) * var(--vb-mw-${e}) * ${z}) calc((${round1(h * rangeHeight)}px * var(--vb-h-${e}) + var(--vb-bh-${e})) * ${z}) at ${centerX} calc(100% + var(--vb-cy-${e}) * ${z}), white 0%, rgba(255, 255, 255, 0.5) ${mid}%${tail > 0 ? `, rgba(255, 255, 255, ${tail}) 85%` : ''}, transparent 100%)`;
  const layerOpacity = (name: string, value: string) =>
    `opacity: calc(var(--vb-opacity-${e}, 1) * var(--vb-glow-${e}) * ${value} * var(--voice-${name}-opacity, 1) * var(--voice-strength, 1));`;
  const innerLayer = (selector: string, content: string, clip: string, filter: string) => `${selector} {
  ${content}
  position: absolute;
  inset: 0;
  border-radius: ${px(a)};
  background: ${innerLobes};
  box-shadow: inset 0 0 ${px(shadowBlur)} 1px ${innerShadow};
  -webkit-mask-image:
    ${rangeMask(170, 64, 45, 0.3)},
    linear-gradient(white, transparent ${px(edgeFade)}, transparent calc(100% - ${edgeFade}px * ${z}), white),
    linear-gradient(to right, white, transparent ${px(edgeFade)}, transparent calc(100% - ${edgeFade}px * ${z}), white);
  -webkit-mask-composite: source-in, source-over;
  mask-image:
    ${rangeMask(170, 64, 45, 0.3)},
    linear-gradient(white, transparent ${px(edgeFade)}, transparent calc(100% - ${edgeFade}px * ${z}), white),
    linear-gradient(to right, white, transparent ${px(edgeFade)}, transparent calc(100% - ${edgeFade}px * ${z}), white);
  mask-composite: intersect, add;
  pointer-events: none;
  will-change: transform;
  z-index: 1;
  ${clip}
  ${layerOpacity('inner', inner)}
  ${filter}
}`;

  const coreCss = () => {
    if (coreLight <= 0) return '';
    const over = Math.max(0, Math.min(2, coreLight - 1));
    const first = Math.min(1, over);
    const second = Math.max(0, over - 1);
    const grow = 1 + 0.3 * over;
    const solid = round1(45 * first + 27 * second);
    const wash = round1(40 + 25 * first + 15 * second);
    const washAlpha = Math.min(1, 0.55 + 0.35 * first + 0.1 * second).toFixed(2);
    const edge = round1(72 + 14 * first + 8 * second);
    return `[data-voice-beam="${e}"] [data-voice-beam-core] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${px(innerRadius)};
  overflow: hidden;
  pointer-events: none;
  will-change: transform;
  filter: blur(${px(blurSize(8, glowSize))});
  z-index: 4;
}

[data-voice-beam="${e}"] [data-voice-beam-core] > div {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse calc(${round1(120 * coreLightWidth * grow * scale)}px * var(--vb-w-${e}) * ${z}) calc((${round1(70 * coreLightHeight * grow * scale)}px * var(--vb-h-${e}) + var(--vb-bh-${e})) * ${z}) at ${centerX} calc(100% + var(--vb-cy-${e}) * ${z}), white 0%, white ${solid}%, rgba(255, 255, 255, ${washAlpha}) ${wash}%, transparent ${edge}%);
  clip-path: var(--vb-clip-below-${e}, none);
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-core],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-core] {
  display: block;
  opacity: calc(var(--vb-opacity-${e}, 1) * min(1, var(--vb-glow-${e}) * ${Math.min(1, coreLight).toFixed(2)} * ${(1.6 + 1.4 * over).toFixed(2)}) * var(--voice-core-light-opacity, 1));
}
`;
  };

  const lobeVars = VOICE_LOBES.map(
    (lobe, index) => `  --vb-x${index}-${e}: ${lobe.x}px;
  --vb-l${index}-${e}: 1;
  --vb-y${index}-${e}: 0px;`,
  ).join('\n');

  return `
@property --vb-opacity-${e} {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}

[data-voice-beam="${e}"] {
  position: relative;
  border-radius: ${a}px;
  overflow: hidden;
  --vb-h-${e}: 0.8;
  --vb-w-${e}: 1;
${lobeVars}
  --vb-glow-${e}: 0.4;
  --vb-z-${e}: 1;
  --vb-cx-${e}: 0px;
  --vb-cy-${e}: 0px;
  --vb-bh-${e}: 0px;
  --vb-bendA-${e}: 0;
  --vb-mw-${e}: 1;
  --vb-hue-${e}: 0deg;
  --vb-level-${e}: 0;
}

[data-voice-beam="${e}"][data-active] {
  animation: vb-fade-in-${e} 0.6s ease forwards;
}

[data-voice-beam="${e}"][data-fading] {
  animation: vb-fade-out-${e} 0.5s ease forwards;
}

[data-voice-beam="${e}"][data-active]::after,
[data-voice-beam="${e}"][data-fading]::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: ${px(innerRadius)};
  padding: ${px(r)};
  clip-path: inset(0 round ${px(a)});
  background:
    ${core},
    ${strokeLobes};
  -webkit-mask:
    ${rangeMask(170, 64, 45)},
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: source-in, xor;
  mask:
    ${rangeMask(170, 64, 45)},
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: intersect, exclude;
  pointer-events: none;
  will-change: transform;
  z-index: 2;
  ${layerOpacity('stroke', stroke)}
  ${colorFilter}
}

${innerLayer(
  `[data-voice-beam="${e}"][data-active]::before,
[data-voice-beam="${e}"][data-fading]::before`,
  'content: "";',
  distortion
    ? `clip-path: var(--vb-clip-above-${e}, inset(0 round ${a}px));`
    : `clip-path: inset(0 round ${a}px);`,
  colorFilter,
)}
${
  distortion
    ? innerLayer(
        `[data-voice-beam="${e}"][data-active] [data-voice-beam-warp="inner"],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-warp="inner"]`,
        'display: block;',
        `clip-path: var(--vb-clip-below-${e}, inset(0 round ${a}px));`,
        warpColorFilter,
      )
    : ''
}

[data-voice-beam="${e}"] [data-voice-beam-bloom],
[data-voice-beam="${e}"] [data-voice-beam-warp] {
  display: none;
  position: absolute;
  inset: 0;
  border-radius: ${px(innerRadius)};
  pointer-events: none;
  will-change: transform;
  opacity: 0;
}

[data-voice-beam="${e}"] [data-voice-beam-bloom],
[data-voice-beam="${e}"] [data-voice-beam-warp="bloom"] {
  -webkit-mask: ${rangeMask(200, 130, 35)};
  mask: ${rangeMask(200, 130, 35)};
  background: ${bloomLobes};
  z-index: 3;
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-bloom] {
  display: block;
  clip-path: ${distortion ? `var(--vb-clip-above-${e}, inset(0 round ${a}px))` : `inset(0 round ${a}px)`};
  ${layerOpacity('bloom', bloom)}
  ${bloomFilter}
}
${
  distortion
    ? `
[data-voice-beam="${e}"][data-active] [data-voice-beam-warp="bloom"],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-warp="bloom"] {
  display: block;
  clip-path: var(--vb-clip-below-${e}, inset(0 round ${a}px));
  ${layerOpacity('bloom', bloom)}
  ${warpBloomFilter}
}

[data-voice-beam="${e}"][data-voice-warp="off"]::before,
[data-voice-beam="${e}"][data-voice-warp="off"] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${a}px);
}

[data-voice-beam="${e}"][data-voice-warp="off"] [data-voice-beam-warp] {
  display: none;
}`
    : ''
}

${coreCss()}
[data-voice-beam="${e}"] [data-voice-beam-band],
[data-voice-beam="${e}"] [data-voice-beam-band-halo] {
  display: none;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  will-change: transform;
  z-index: 4;
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-band],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band],
[data-voice-beam="${e}"][data-active] [data-voice-beam-band-halo],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band-halo] {
  display: block;
  opacity: calc(var(--vb-opacity-${e}, 1) * var(--voice-band-opacity, 1) * var(--voice-strength, 1));
  filter: blur(var(--vb-band-blur-${e}, 0px)) ${hue} brightness(${bright}) saturate(${sat});
}

[data-voice-beam="${e}"][data-active] [data-voice-beam-band-halo],
[data-voice-beam="${e}"][data-fading] [data-voice-beam-band-halo] {
  filter: blur(var(--vb-band-halo-blur-${e}, 0px)) ${hue} brightness(${bright}) saturate(${sat});
}

[data-voice-beam="${e}"][data-voice-halfres]::before,
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-warp],
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-core] {
  --vb-z-${e}: 0.5;
  inset: auto;
  left: 0;
  top: 0;
  width: 50%;
  height: 50%;
  transform: translateZ(0) scale(2);
  transform-origin: 0 0;
}
${
  distortion
    ? `[data-voice-beam="${e}"][data-voice-halfres][data-active]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-fading]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-bloom] {
  clip-path: var(--vb-clip-above-z-${e}, inset(0 round ${px(a)}));
}
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-warp],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-warp] {
  clip-path: var(--vb-clip-below-z-${e}, inset(0 round ${px(a)}));
}
[data-voice-beam="${e}"][data-voice-halfres][data-voice-warp="off"]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-voice-warp="off"] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${px(a)});
}`
    : `[data-voice-beam="${e}"][data-voice-halfres][data-active]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-fading]::before,
[data-voice-beam="${e}"][data-voice-halfres][data-active] [data-voice-beam-bloom],
[data-voice-beam="${e}"][data-voice-halfres][data-fading] [data-voice-beam-bloom] {
  clip-path: inset(0 round ${px(a)});
}`
}
[data-voice-beam="${e}"][data-voice-halfres] [data-voice-beam-core] > div {
  clip-path: var(--vb-clip-below-z-${e}, none);
}
@keyframes vb-fade-in-${e} {
  to { --vb-opacity-${e}: 1; }
}

@keyframes vb-fade-out-${e} {
  from { --vb-opacity-${e}: 1; }
  to { --vb-opacity-${e}: 0; }
}

[data-voice-beam="${e}"][data-paused],
[data-voice-beam="${e}"][data-paused]::after,
[data-voice-beam="${e}"][data-paused]::before,
[data-voice-beam="${e}"][data-paused] [data-voice-beam-bloom] {
  animation-play-state: paused !important;
}
`;
};
