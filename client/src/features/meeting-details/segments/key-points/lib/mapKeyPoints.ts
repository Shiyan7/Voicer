import type { KeyPointOutput } from '@schema';

import { formatClock } from '@/shared/lib/time';

import { KeyPointView } from '../types/KeyPointView';

export function mapKeyPoints(
  points: KeyPointOutput[] | undefined,
  focusId: string | null,
): KeyPointView[] {
  if (!points?.length) return [];

  return points.map((point) => ({
    id: point.id,
    text: point.text,
    timeLabel: point.atMs != null ? formatClock(point.atMs / 1000) : null,
    isFocused: point.id === focusId,
  }));
}
