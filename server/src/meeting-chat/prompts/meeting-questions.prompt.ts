import { formatTranscript } from '../../transcription/format-transcript';
import { TranscribedSegment } from '../../transcription/transcription.types';

const QUESTIONS_RULE =
  'questions — 4 or 5 short questions (max 7 words each) a participant would want to ask an assistant about THIS meeting, in the transcript language. Make them specific to the topics, decisions and people in the transcript (e.g. «Почему решили отложить релиз?», «Сколько стоит подписка в итоге?»), never generic ones like «Кратко перескажи встречу». The person asking took part in the meeting, so phrase them in first person where natural (e.g. «Как я ответил про Tree Shaking?», «Какие у меня шансы на оффер?»). Mix factual questions with ones asking for assessment or advice.';

export const QUESTIONS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: { questions: { type: 'array', items: { type: 'string' } } },
  required: ['questions'],
  additionalProperties: false,
};

const QUESTIONS_TRANSCRIPT_CHARS = 60000;

export function buildMeetingQuestionsPrompt(
  segments: TranscribedSegment[],
): string {
  return [
    'You suggest questions about a meeting. Read the transcript and return only questions.',
    '',
    'LANGUAGE: write the questions in the language actually spoken in the transcript.',
    'Never mention speaker numbers like "Speaker 1".',
    QUESTIONS_RULE,
    '',
    'Transcript:',
    formatTranscript(segments).slice(0, QUESTIONS_TRANSCRIPT_CHARS),
  ].join('\n');
}
