export const createFlowGradient = (
  ctx: CanvasRenderingContext2D,
  colors: string[],
  width: number,
  offset: number,
) => {
  const period = Math.max(1, width * 1.6);
  const shift = offset % period;
  const gradient = ctx.createLinearGradient(-shift, 0, 2 * period - shift, 0);
  const stops = colors.length * 2;
  for (let i = 0; i <= stops; i++) {
    gradient.addColorStop(i / stops, colors[i % colors.length]);
  }
  return gradient;
};
