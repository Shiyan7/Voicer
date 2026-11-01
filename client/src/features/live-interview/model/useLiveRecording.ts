import { createSignal } from 'solid-js';

import { meetingTranscriptQuery } from '@/entities/meeting';
import { usePlayback } from '@/entities/meeting-player';

export function useLiveRecording() {
  const [meetingId, setMeetingId] = createSignal('');
  const [audioUrl, setAudioUrl] = createSignal('');
  const playback = usePlayback();
  const [transcriptResult] = meetingTranscriptQuery(
    () => ({ meetingId: meetingId() }),
    { pause: () => !meetingId() },
  );

  const transcript = () => transcriptResult.data?.meetingTranscript ?? [];

  const show = (id: string, url: string) => {
    setMeetingId(id);
    setAudioUrl(url);
  };

  const clear = () => show('', '');

  return { meetingId, audioUrl, transcript, playback, show, clear };
}
