import type { KeyPointOutput } from '@schema';

import { KeyPointView } from '../types/KeyPointView';

export function mapKeyPoints(
  points: KeyPointOutput[] | undefined,
  focusId: string | null,
): KeyPointView[] {
  if (!points?.length) return [];

  return points.map((point) => ({
    id: point.id,
    text: point.text,
    atMs: point.atMs ?? null,
    isFocused: point.id === focusId,
  }));
}
