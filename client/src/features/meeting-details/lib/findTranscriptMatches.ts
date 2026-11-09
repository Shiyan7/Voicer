import type { TranscriptSegmentOutput } from '@schema';

import { TranscriptMatch } from '../types/TranscriptMatch';

export function findTranscriptMatches(
  segments: TranscriptSegmentOutput[],
  pattern: RegExp | null,
): TranscriptMatch[] {
  if (!pattern) return [];

  const matches: TranscriptMatch[] = [];
  for (const segment of segments) {
    for (const found of segment.text.matchAll(pattern)) {
      matches.push({
        index: matches.length,
        segmentId: segment.id,
        start: found.index,
        end: found.index + found[0].length,
      });
    }
  }
  return matches;
}
