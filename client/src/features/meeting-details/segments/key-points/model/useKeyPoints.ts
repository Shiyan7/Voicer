import { meetingKeyPointsQuery } from '@/features/meeting-details/api/meetingKeyPointsQuery';

import { mapKeyPoints } from '../lib/mapKeyPoints';
import { KeyPointsParams } from '../types/KeyPointsParams';

export function useKeyPoints(props: KeyPointsParams) {
  const [result] = meetingKeyPointsQuery({ meetingId: props.meetingId });

  const points = () => mapKeyPoints(result.data?.meetingKeyPoints);

  const isEmpty = () => !result.fetching && points().length === 0;

  return { points, isEmpty };
}
