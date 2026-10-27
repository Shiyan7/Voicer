import type { TranscriptSegmentOutput } from '@schema';

import { formatClockMs } from '@/shared/lib/time';
import { getSpeakerLabel, getSpeakerTone } from '@/shared/ui/speaker-avatar';

import { TranscriptSegmentView } from '../types/TranscriptSegmentView';

export function mapTranscriptSegments(
  segments: TranscriptSegmentOutput[] | undefined,
  focusId: string | null,
): TranscriptSegmentView[] {
  if (!segments?.length) return [];

  return segments.reduce<TranscriptSegmentView[]>((groups, segment) => {
    const paragraph = {
      id: segment.id,
      text: segment.text,
      startMs: segment.startMs,
      endMs: segment.endMs,
      isFocused: segment.id === focusId,
    };

    const last = groups[groups.length - 1];
    if (last && last.speakerIndex === segment.speakerIndex) {
      last.paragraphs.push(paragraph);
      return groups;
    }

    groups.push({
      id: segment.id,
      speakerIndex: segment.speakerIndex,
      speakerLabel: getSpeakerLabel(segment.speakerIndex),
      tone: getSpeakerTone(segment.speakerIndex),
      timeLabel: formatClockMs(segment.startMs),
      startMs: segment.startMs,
      paragraphs: [paragraph],
    });
    return groups;
  }, []);
}
