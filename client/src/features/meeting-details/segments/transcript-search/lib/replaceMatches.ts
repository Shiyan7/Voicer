import type { TranscriptSegmentTextInput } from '@schema';

import { TranscriptMatch } from '../../../types/TranscriptMatch';

export function replaceMatches(
  texts: Map<string, string>,
  matches: TranscriptMatch[],
  replacement: string,
): TranscriptSegmentTextInput[] {
  const updated = new Map<string, string>();

  for (const match of [...matches].reverse()) {
    const text =
      updated.get(match.segmentId) ?? texts.get(match.segmentId) ?? '';
    updated.set(
      match.segmentId,
      text.slice(0, match.start) + replacement + text.slice(match.end),
    );
  }

  return [...updated].map(([id, text]) => ({ id, text }));
}
