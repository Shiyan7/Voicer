import { mapKeyPoints } from '../lib/mapKeyPoints';
import { KeyPointsDeps } from '../types/KeyPointsDeps';

export const useKeyPoints = (deps: KeyPointsDeps) => {
  const points = () => mapKeyPoints(deps.points, deps.focusId);

  const isEmpty = () => points().length === 0;

  return { points, isEmpty };
};
