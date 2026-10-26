import { mapKeyPoints } from '../lib/mapKeyPoints';
import { KeyPointsParams } from '../types/KeyPointsParams';

export const useKeyPoints = (props: KeyPointsParams) => {
  const points = () => mapKeyPoints(props.points, props.focusId);

  const isEmpty = () => points().length === 0;

  return { points, isEmpty };
};
