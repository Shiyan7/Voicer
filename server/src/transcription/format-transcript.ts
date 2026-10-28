import { TranscribedSegment } from './transcription.types';

export const formatTranscript = (segments: TranscribedSegment[]): string =>
  segments
    .map(
      (segment) =>
        `[${segment.startMs}] Speaker ${segment.speakerIndex}: ${segment.text}`,
    )
    .join('\n');
