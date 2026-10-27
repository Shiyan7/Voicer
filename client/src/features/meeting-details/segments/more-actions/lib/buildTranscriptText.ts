import type { TranscriptSegmentOutput } from '@schema';

import { formatClock } from '@/shared/lib/time';

export function buildTranscriptText(
  title: string,
  segments: TranscriptSegmentOutput[],
): string {
  const lines = segments.map(
    (segment) =>
      `[${formatClock(segment.startMs / 1000)}] Speaker ${segment.speakerIndex + 1}: ${segment.text}`,
  );

  return [title, '', ...lines, ''].join('\n');
}
