import { InterviewSessionEntity } from './interview-session.entity';
import { InterviewSessionOutput } from './interview-session.output';

export function toInterviewSessionOutput(
  session: InterviewSessionEntity,
): InterviewSessionOutput {
  return {
    id: session.id,
    resumeText: session.resumeText,
    vacancyText: session.vacancyText,
    cheatSheet: session.cheatSheet,
    recommendations: session.recommendations,
    styleSamples: session.styleSamples,
    createdAt: session.createdAt,
  };
}
