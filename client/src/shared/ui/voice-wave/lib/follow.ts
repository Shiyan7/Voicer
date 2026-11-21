export const follow = (
  current: number,
  target: number,
  dt: number,
  seconds: number,
) => current + (target - current) * (1 - Math.exp(-dt / seconds));
