import type { KeyPointOutput } from '@schema';

import { formatMs } from '@/shared/lib/time';

import { KeyPointView } from '../types/KeyPointView';

export function mapKeyPoints(
  points: KeyPointOutput[] | undefined,
): KeyPointView[] {
  if (!points?.length) return [];

  return points.map((point) => ({
    id: point.id,
    text: point.text,
    timeLabel: point.atMs != null ? formatMs(point.atMs) : null,
  }));
}
