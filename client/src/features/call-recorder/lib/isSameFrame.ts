import { SAME_FRAME_MAX_DIFF } from '../config/callRecorderConfig';

export const isSameFrame = (
  previous: Uint8Array | null,
  next: Uint8Array | null,
) => {
  if (!previous || !next || previous.length !== next.length) return false;
  const totalDiff = next.reduce(
    (sum, value, index) => sum + Math.abs(value - previous[index]),
    0,
  );
  return totalDiff / next.length <= SAME_FRAME_MAX_DIFF;
};
