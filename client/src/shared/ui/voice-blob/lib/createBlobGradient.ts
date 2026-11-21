import { BLOB_COLORS, GRADIENT_SPIN_SPEED } from '../config/voiceBlobConfig';

export const createBlobGradient = (
  ctx: CanvasRenderingContext2D,
  size: number,
  time: number,
) => {
  const center = size / 2;
  const angle = time * GRADIENT_SPIN_SPEED;
  const dx = (Math.cos(angle) * size) / 2;
  const dy = (Math.sin(angle) * size) / 2;
  const gradient = ctx.createLinearGradient(
    center - dx,
    center - dy,
    center + dx,
    center + dy,
  );
  BLOB_COLORS.forEach((color, index) =>
    gradient.addColorStop(index / (BLOB_COLORS.length - 1), color),
  );
  return gradient;
};
