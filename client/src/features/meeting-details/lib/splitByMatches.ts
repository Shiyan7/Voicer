import { TranscriptMatch } from '../types/TranscriptMatch';
import { TranscriptTextPart } from '../types/TranscriptTextPart';

export function splitByMatches(
  text: string,
  matches: TranscriptMatch[],
): TranscriptTextPart[] {
  const parts: TranscriptTextPart[] = [];
  let from = 0;

  for (const match of matches) {
    if (match.start > from) {
      parts.push({ text: text.slice(from, match.start), matchIndex: null });
    }
    parts.push({
      text: text.slice(match.start, match.end),
      matchIndex: match.index,
    });
    from = match.end;
  }
  if (from < text.length)
    parts.push({ text: text.slice(from), matchIndex: null });

  return parts;
}
