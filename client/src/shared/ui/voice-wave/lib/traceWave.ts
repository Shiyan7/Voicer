export const traceWaveEdge = (
  ctx: CanvasRenderingContext2D,
  depths: Float32Array,
  count: number,
  step: number,
) => {
  ctx.lineTo(0, depths[0]);
  for (let i = 1; i < count - 1; i++) {
    const midY = (depths[i] + depths[i + 1]) / 2;
    ctx.quadraticCurveTo(i * step, depths[i], (i + 0.5) * step, midY);
  }
  ctx.lineTo((count - 1) * step, depths[count - 1]);
};

export const traceWave = (
  ctx: CanvasRenderingContext2D,
  depths: Float32Array,
  count: number,
  step: number,
  top: number,
) => {
  ctx.beginPath();
  ctx.moveTo(0, top);
  traceWaveEdge(ctx, depths, count, step);
  ctx.lineTo((count - 1) * step, top);
  ctx.closePath();
};
