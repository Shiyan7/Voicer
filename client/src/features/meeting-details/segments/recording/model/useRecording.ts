import { createSignal } from 'solid-js';

import { meetingTranscriptQuery } from '@/features/meeting-details/api/meetingTranscriptQuery';
import { AudioPlayerApi } from '@/shared/ui/audio-player';

import { mapTranscriptSegments } from '../lib/mapTranscriptSegments';
import { RecordingParams } from '../types/RecordingParams';

export function useRecording(props: RecordingParams) {
  const [result] = meetingTranscriptQuery({ meetingId: props.meetingId });
  const [currentTimeMs, setCurrentTimeMs] = createSignal(0);

  let playerApi: AudioPlayerApi | null = null;

  const setPlayerApi = (api: AudioPlayerApi) => {
    playerApi = api;
  };

  const onTimeUpdate = (seconds: number) => setCurrentTimeMs(seconds * 1000);

  const seekTo = (startMs: number) =>
    playerApi?.seek(startMs / 1000, { play: true });

  const segments = () =>
    mapTranscriptSegments(result.data?.meetingTranscript, currentTimeMs());

  const isEmpty = () => !result.fetching && segments().length === 0;

  return { segments, isEmpty, setPlayerApi, onTimeUpdate, seekTo };
}
