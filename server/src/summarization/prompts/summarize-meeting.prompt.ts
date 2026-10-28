import { TranscribedSegment } from '../../transcription/transcription.types';
import { SummaryStyle } from '../summary-style.enum';
import { SUMMARY_STYLE_INSTRUCTIONS } from './summary-style-instructions';

export const SUMMARY_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    keyPoints: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          atMs: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        },
        required: ['text', 'atMs'],
        additionalProperties: false,
      },
    },
    actionItems: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          text: { type: 'string' },
          atMs: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
          speakerIndex: { anyOf: [{ type: 'integer' }, { type: 'null' }] },
        },
        required: ['text', 'atMs', 'speakerIndex'],
        additionalProperties: false,
      },
    },
  },
  required: ['title', 'keyPoints', 'actionItems'],
  additionalProperties: false,
};

const TITLE_RULE =
  'title — a short meeting title of 2–6 words in the transcript language that names the main topic (e.g. «Обсуждение релиза приложения», «Сборка персонажа в игре»). No date, no app name, no quotes, no trailing period.';

const QUESTIONS_RULE =
  'questions — 4 or 5 short questions (max 7 words each) a participant would want to ask an assistant about THIS meeting, in the transcript language. Make them specific to the topics, decisions and people in the transcript (e.g. «Почему решили отложить релиз?», «Сколько стоит подписка в итоге?»), never generic ones like «Кратко перескажи встречу». The person asking took part in the meeting, so phrase them in first person where natural (e.g. «Как я ответил про Tree Shaking?», «Какие у меня шансы на оффер?»). Mix factual questions with ones asking for assessment or advice.';

export const QUESTIONS_RESPONSE_SCHEMA = {
  type: 'object',
  properties: { questions: { type: 'array', items: { type: 'string' } } },
  required: ['questions'],
  additionalProperties: false,
};

const QUESTIONS_TRANSCRIPT_CHARS = 60000;

export const TITLE_RESPONSE_SCHEMA = {
  type: 'object',
  properties: { title: { type: 'string' } },
  required: ['title'],
  additionalProperties: false,
};

const TITLE_TRANSCRIPT_CHARS = 12000;

export const formatTranscript = (segments: TranscribedSegment[]): string =>
  segments
    .map(
      (segment) =>
        `[${segment.startMs}] Speaker ${segment.speakerIndex}: ${segment.text}`,
    )
    .join('\n');

export function buildMeetingTitlePrompt(
  segments: TranscribedSegment[],
): string {
  return [
    'You name meetings. Read the transcript and return only a title.',
    '',
    'LANGUAGE: write the title in the language actually spoken in the transcript.',
    TITLE_RULE,
    '',
    'Transcript:',
    formatTranscript(segments).slice(0, TITLE_TRANSCRIPT_CHARS),
  ].join('\n');
}

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

export function buildSummarizeMeetingPrompt(
  segments: TranscribedSegment[],
  style: SummaryStyle,
): string {
  const transcript = formatTranscript(segments);

  return [
    'You are a meeting-notes writer. Below is a transcript where each line is prefixed with [startMs] (milliseconds from the start) and the speaker.',
    '',
    'LANGUAGE (most important rule): detect the language actually spoken in the transcript sentences and write EVERY text field — title, keyPoints and actionItems — ONLY in that language. If the participants speak Russian, write in Russian. Ignore any English words in the meeting title or borrowed jargon: match the language of the sentences, not of individual game/product terms. Do NOT translate to English.',
    '',
    'SPEAKER NAMES: the "Speaker 0" / "Speaker 1" prefixes are internal IDs. NEVER put any speaker number in the output — not "Speaker 1", not «Участник 1», not «участник 0», not «первый участник». If the transcript reveals a person\'s name (someone is addressed or introduced by name), use that name. Otherwise refer to people without numbering them: «один из участников», «другой участник», «собеседник», «команда». Example: NOT «Участник 1 купил шпагу», but «Один из участников купил шпагу».',
    '',
    TITLE_RULE,
    '',
    'FIRST key point: open with one sentence that sets the scene — what the meeting/session is about overall (infer it from the content).',
    '',
    'keyPoints — the substantive story of the meeting: decisions made, findings, problems raised, and outcomes, in chronological order.',
    'Rules for each key point:',
    '- Write a complete, self-contained sentence understandable WITHOUT the transcript. Carry the context: who did or said what, and why it mattered. Refer to specific things by name (items, features, numbers).',
    '- Merge several related lines into ONE point instead of emitting a fragment per line. Prefer fewer, denser, higher-signal points over many tiny ones.',
    '- Skip filler, small talk, greetings, and routine procedural micro-events that carry no decision or insight.',
    '- Never output clipped fragments — always a full sentence with context.',
    '- Set atMs to the startMs of the line where the topic begins.',
    '',
    'actionItems — concrete tasks or follow-ups someone agreed to do. Short and imperative, in the transcript language. Set atMs and speakerIndex from the line where the task was raised; use null when unclear. Empty list if there are none.',
    '',
    `STYLE (overrides the length and tone guidance above): ${SUMMARY_STYLE_INSTRUCTIONS[style]}`,
    '',
    'Do not invent facts that are not in the transcript.',
    '',
    'Transcript:',
    transcript,
  ].join('\n');
}
