import type { TranscriptSegmentOutput } from '@schema';

import { TranscriptSearch } from '../../../types/TranscriptSearch';

export interface TranscriptSearchPanelDeps {
  meetingId: string;
  transcript: TranscriptSegmentOutput[];
  search: TranscriptSearch;
}
