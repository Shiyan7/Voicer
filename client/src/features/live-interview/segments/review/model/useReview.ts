import { getInterviewSessionTitle } from '@/entities/interview-session';
import { meetingTranscriptQuery } from '@/entities/meeting';
import { usePlayback } from '@/entities/meeting-player';

import { ReviewDeps } from '../types/ReviewDeps';

export function useReview(deps: ReviewDeps) {
  const playback = usePlayback();

  const meetingId = () => deps.details.meetingId ?? '';

  const audioUrl = () => deps.details.recordingUrl ?? null;

  const title = () => getInterviewSessionTitle(deps.details);

  const [transcriptResult] = meetingTranscriptQuery(
    () => ({ meetingId: meetingId() }),
    { pause: () => !meetingId() },
  );

  const transcript = () => transcriptResult.data?.meetingTranscript ?? [];

  return { playback, meetingId, audioUrl, title, transcript };
}
