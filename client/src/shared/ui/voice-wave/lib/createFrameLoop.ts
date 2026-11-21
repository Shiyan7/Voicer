const MAX_FRAME_SEC = 0.05;

export const createFrameLoop = (tick: (dt: number) => boolean) => {
  let frame = 0;
  let last = 0;

  const run = (now: number) => {
    const dt = Math.min(MAX_FRAME_SEC, Math.max(0, now - last) / 1000);
    last = now;
    frame = tick(dt) ? requestAnimationFrame(run) : 0;
  };

  const start = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(run);
  };

  const stop = () => {
    cancelAnimationFrame(frame);
    frame = 0;
  };

  return { start, stop };
};
