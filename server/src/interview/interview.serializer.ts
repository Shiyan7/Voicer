import { MeetingRecording } from '../meetings/meeting-recording';
import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewTurnEntity } from './interview-turn.entity';
import { InterviewTurnOutput } from './interview-turn.output';

export function toInterviewSessionOutput(
  session: InterviewSessionEntity,
  recording?: MeetingRecording,
): InterviewSessionOutput {
  return {
    id: session.id,
    title: session.title,
    vacancyText: session.vacancyText,
    language: session.language,
    prepStatus: session.prepStatus,
    recommendations: session.recommendations,
    finishedAt: session.finishedAt,
    meetingId: recording?.id ?? null,
    recordingUrl: recording?.audioUrl ?? null,
    createdAt: session.createdAt,
  };
}

export function toInterviewTurnOutput(
  turn: InterviewTurnEntity,
  imageUrl: string | null,
): InterviewTurnOutput {
  return {
    id: turn.id,
    question: turn.question,
    answer: turn.answer,
    imageUrl,
    createdAt: turn.createdAt,
  };
}
