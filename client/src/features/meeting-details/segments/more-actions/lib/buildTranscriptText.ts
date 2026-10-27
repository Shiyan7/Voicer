import type { TranscriptSegmentOutput } from '@schema';

import { formatClockMs } from '@/shared/lib/time';

export function buildTranscriptText(
  title: string,
  segments: TranscriptSegmentOutput[],
): string {
  const lines = segments.map(
    (segment) =>
      `[${formatClockMs(segment.startMs)}] Speaker ${segment.speakerIndex + 1}: ${segment.text}`,
  );

  return [title, '', ...lines, ''].join('\n');
}
