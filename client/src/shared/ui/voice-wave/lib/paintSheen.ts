import {
  SHEEN_ALPHA,
  SHEEN_RADIUS_RATIO,
  SHEEN_SPEED,
  SHEEN_SWAY,
} from '../config/voiceWaveConfig';

export const paintSheen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  energy: number,
) => {
  if (energy <= 0.01) return;
  const x = width * (0.5 + SHEEN_SWAY * Math.sin(time * SHEEN_SPEED));
  const radius = width * SHEEN_RADIUS_RATIO;
  const sheen = ctx.createRadialGradient(x, 0, 0, x, 0, radius);
  sheen.addColorStop(0, `rgba(255, 255, 255, ${SHEEN_ALPHA * energy})`);
  sheen.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = 1;
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = 'source-over';
};
