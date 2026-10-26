import type { TranscriptSegmentOutput } from '@schema';

import { formatMs } from '@/shared/lib/time';

export function buildTranscriptText(
  title: string,
  segments: TranscriptSegmentOutput[],
): string {
  const lines = segments.map(
    (segment) =>
      `[${formatMs(segment.startMs)}] Speaker ${segment.speakerIndex + 1}: ${segment.text}`,
  );

  return [title, '', ...lines, ''].join('\n');
}
