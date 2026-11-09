import { TranscriptMatch } from '../types/TranscriptMatch';

export function groupMatchesBySegment(
  matches: TranscriptMatch[],
): Map<string, TranscriptMatch[]> {
  const groups = new Map<string, TranscriptMatch[]>();

  for (const match of matches) {
    const group = groups.get(match.segmentId);
    if (group) group.push(match);
    else groups.set(match.segmentId, [match]);
  }

  return groups;
}
