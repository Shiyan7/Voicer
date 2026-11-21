export const follow = (
  current: number,
  target: number,
  dt: number,
  riseSec: number,
  fallSec = riseSec,
) => {
  const tau = target > current ? riseSec : fallSec;
  return current + (target - current) * (1 - Math.exp(-dt / tau));
};
