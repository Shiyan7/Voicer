export const traceWave = (
  ctx: CanvasRenderingContext2D,
  depths: Float32Array,
  step: number,
  top: number,
) => {
  const right = (depths.length - 1) * step + 1;
  ctx.beginPath();
  ctx.moveTo(-1, top);
  ctx.lineTo(-1, depths[0]);
  depths.forEach((depth, index) => ctx.lineTo(index * step, depth));
  ctx.lineTo(right, depths[depths.length - 1]);
  ctx.lineTo(right, top);
};
