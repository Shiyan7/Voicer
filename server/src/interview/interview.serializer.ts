import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';
import { InterviewTurnEntity } from './interview-turn.entity';
import { InterviewTurnOutput } from './interview-turn.output';

export function toInterviewSessionOutput(
  session: InterviewSessionEntity,
  meetingId: string | null,
): InterviewSessionOutput {
  return {
    id: session.id,
    resumeText: session.resumeText,
    vacancyText: session.vacancyText,
    cheatSheet: session.cheatSheet,
    recommendations: session.recommendations,
    finishedAt: session.finishedAt,
    meetingId,
    createdAt: session.createdAt,
  };
}

export function toInterviewTurnOutput(
  turn: InterviewTurnEntity,
): InterviewTurnOutput {
  return {
    id: turn.id,
    question: turn.question,
    answer: turn.answer,
    createdAt: turn.createdAt,
  };
}
