import type { TranscriptSegmentOutput } from '@schema';

import { SPEAKER_TONES } from '../config/speakerTones';
import { SpeakerTrack } from '../types/SpeakerTrack';

const toPercent = (value: number, total: number) =>
  `${Math.min(Math.max((value / total) * 100, 0), 100)}%`;

export function buildSpeakerTracks(
  segments: TranscriptSegmentOutput[],
  durationMs: number,
): SpeakerTrack[] {
  const totalMs =
    durationMs || Math.max(0, ...segments.map((segment) => segment.endMs));
  if (!segments.length || totalMs <= 0) return [];

  const bySpeaker = new Map<number, TranscriptSegmentOutput[]>();
  for (const segment of segments) {
    const list = bySpeaker.get(segment.speakerIndex) ?? [];
    list.push(segment);
    bySpeaker.set(segment.speakerIndex, list);
  }

  const spokenMs = (list: TranscriptSegmentOutput[]) =>
    list.reduce((sum, segment) => sum + (segment.endMs - segment.startMs), 0);

  const totalSpokenMs = spokenMs(segments) || 1;

  return [...bySpeaker.entries()]
    .map(([speakerIndex, list]) => ({
      speakerIndex,
      list,
      share: spokenMs(list) / totalSpokenMs,
    }))
    .sort((a, b) => b.share - a.share)
    .map(({ speakerIndex, list, share }) => ({
      speakerIndex,
      label: `Speaker ${speakerIndex + 1}`,
      initial: String(speakerIndex + 1),
      tone: SPEAKER_TONES[speakerIndex % SPEAKER_TONES.length],
      shareLabel: `${Math.round(share * 100)}%`,
      ranges: list.map((segment) => ({
        startMs: segment.startMs,
        left: toPercent(segment.startMs, totalMs),
        width: toPercent(segment.endMs - segment.startMs, totalMs),
      })),
    }));
}
