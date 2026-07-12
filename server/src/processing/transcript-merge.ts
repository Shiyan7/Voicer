/**
 * Pure channel-merge logic for transcription: applying chunk time offsets,
 * filtering out empty / hallucinated segments and merging the two speaker
 * channels into a single timeline. Kept free of I/O so it is unit-testable.
 */

/** A segment as returned by Whisper verbose_json (seconds-based). */
export interface RawWhisperSegment {
  start: number;
  end: number;
  text: string;
  no_speech_prob?: number;
}

/** Segments of a single transcribed chunk plus the chunk's absolute offset. */
export interface TranscribedChunk {
  offsetMs: number;
  segments: RawWhisperSegment[];
}

export interface ChannelSegment<S> {
  speaker: S;
  startMs: number;
  endMs: number;
  text: string;
}

const NO_SPEECH_PROB_THRESHOLD = 0.6;

function isUsableSegment(segment: RawWhisperSegment): boolean {
  if (!segment.text || segment.text.trim().length === 0) {
    return false;
  }

  // Whisper hallucination artifact: "speech" detected where there is none.
  if (
    typeof segment.no_speech_prob === 'number' &&
    segment.no_speech_prob > NO_SPEECH_PROB_THRESHOLD
  ) {
    return false;
  }

  return true;
}

/**
 * Flattens the chunks of one channel into absolute-time segments:
 * each chunk's second-based timestamps are shifted by the chunk's offset.
 */
export function collectChannelSegments<S>(
  chunks: TranscribedChunk[],
  speaker: S,
): ChannelSegment<S>[] {
  const result: ChannelSegment<S>[] = [];

  for (const chunk of chunks) {
    for (const segment of chunk.segments) {
      if (!isUsableSegment(segment)) {
        continue;
      }

      result.push({
        speaker,
        startMs: Math.round(segment.start * 1000) + chunk.offsetMs,
        endMs: Math.round(segment.end * 1000) + chunk.offsetMs,
        text: segment.text.trim(),
      });
    }
  }

  return result;
}

/** Merges any number of channels into one list sorted by startMs (stable). */
export function mergeChannels<S>(
  ...channels: ChannelSegment<S>[][]
): ChannelSegment<S>[] {
  return channels
    .flat()
    .sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
}
