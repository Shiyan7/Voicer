import { TranscribedSegment } from '../../transcription/transcription.types';

const CITATION = /\[\[([\d\s,[\]]+)]]/g;

const nearestStartMs = (ms: number, segments: TranscribedSegment[]): number =>
  segments.reduce(
    (nearest, segment) =>
      Math.abs(segment.startMs - ms) < Math.abs(nearest - ms)
        ? segment.startMs
        : nearest,
    segments[0]?.startMs ?? ms,
  );

export const snapMeetingCitations =
  (segments: TranscribedSegment[]) =>
  (content: string): string =>
    content.replace(CITATION, (_, inner: string) =>
      (inner.match(/\d+/g) ?? [])
        .map((ms) => `[[${nearestStartMs(Number(ms), segments)}]]`)
        .join(' '),
    );
