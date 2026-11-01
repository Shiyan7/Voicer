import { MeetingEntity } from '../meetings/meeting.entity';
import { InterviewSessionEntity } from './interview-session.entity';

type RecordingCandidate = Pick<MeetingEntity, 'id' | 'startedAt'>;

export function findRecording(
  session: InterviewSessionEntity,
  meetingsByDuration: RecordingCandidate[],
): string | null {
  const end = session.finishedAt ?? new Date();
  const recording = meetingsByDuration.find(
    (meeting) =>
      meeting.startedAt >= session.createdAt && meeting.startedAt <= end,
  );
  return recording?.id ?? null;
}
