import { TranscriptDeps } from '../types/TranscriptDeps';
import { TranscriptSegmentView } from '../types/TranscriptSegmentView';

export function useTranscript(props: TranscriptDeps) {
  const segments = (): TranscriptSegmentView[] => [];

  const isEmpty = (): boolean => true;

  return { segments, isEmpty };
}
