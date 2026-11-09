import type { TranscriptSegmentOutput } from '@schema';
import type { Accessor } from 'solid-js';

export interface TranscriptSearchDeps {
  transcript: Accessor<TranscriptSegmentOutput[]>;
}
