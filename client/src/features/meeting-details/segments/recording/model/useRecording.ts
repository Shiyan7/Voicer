import { mapTranscriptSegments } from '../lib/mapTranscriptSegments';
import { RecordingDeps } from '../types/RecordingDeps';

export const useRecording = (props: RecordingDeps) => {
  const segments = () =>
    mapTranscriptSegments(props.transcript, props.currentTimeMs);

  const isEmpty = () => !props.isLoading && segments().length === 0;

  return { segments, isEmpty };
};
