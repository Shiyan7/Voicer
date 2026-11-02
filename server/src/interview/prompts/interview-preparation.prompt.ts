import { InterviewLanguage } from '../interview-language.enum';

const OUTPUT_LANGUAGES: Record<InterviewLanguage, string> = {
  [InterviewLanguage.RU]: 'Russian',
  [InterviewLanguage.EN]: 'English',
};

export const INTERVIEW_PREPARATION_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    cheatSheet: { type: 'string' },
    recommendations: {
      type: 'object',
      properties: {
        topics: { type: 'array', items: { type: 'string' } },
        likelyQuestions: { type: 'array', items: { type: 'string' } },
        emphasize: { type: 'array', items: { type: 'string' } },
      },
      required: ['topics', 'likelyQuestions', 'emphasize'],
      additionalProperties: false,
    },
  },
  required: ['title', 'cheatSheet', 'recommendations'],
  additionalProperties: false,
};

export function buildInterviewPreparationPrompt(
  resumeText: string,
  vacancyText: string,
  language: InterviewLanguage,
): string {
  return `You prepare a candidate for a job interview. Below are the candidate's resume and the job description.

Return JSON:
- title: a short interview title of up to 6 words taken from the job description: role and company, e.g. «Senior Frontend, Яндекс». No quotes or date.
- cheatSheet: a compact cheat sheet of about 300 words. The candidate's projects, stack, concrete numbers and achievements, then the key job requirements and how the candidate's experience covers them. Facts only, no filler.
- recommendations.topics: 5–8 topics worth reviewing before the interview.
- recommendations.likelyQuestions: 8–12 likely interviewer questions for this job.
- recommendations.emphasize: 4–6 candidate strengths worth emphasizing.

Write everything in ${OUTPUT_LANGUAGES[language]}.

Resume:
${resumeText}

Job description:
${vacancyText}`;
}
