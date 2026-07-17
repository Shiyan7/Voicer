import type { TranscriptSegmentOutput } from '@schema';

import { formatMs } from '@/shared/lib/time';

import { TranscriptSegmentView } from '../types/TranscriptSegmentView';

export function mapTranscriptSegments(
  segments: TranscriptSegmentOutput[] | undefined,
  currentTimeMs: number,
): TranscriptSegmentView[] {
  if (!segments?.length) return [];

  return segments.map((segment) => ({
    id: segment.id,
    speaker: segment.speakerIndex === 0 ? 'me' : 'other',
    speakerLabel: `Speaker ${segment.speakerIndex + 1}`,
    timeLabel: formatMs(segment.startMs),
    text: segment.text,
    isActive: currentTimeMs >= segment.startMs && currentTimeMs < segment.endMs,
    startMs: segment.startMs,
  }));
}
