import { TranscribedSegment } from '../../transcription/transcription.types';

export const SUMMARY_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
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
  required: ['keyPoints', 'actionItems'],
  additionalProperties: false,
};

export function buildSummarizeMeetingPrompt(
  segments: TranscribedSegment[],
): string {
  const transcript = segments
    .map(
      (segment) =>
        `[${segment.startMs}] Speaker ${segment.speakerIndex}: ${segment.text}`,
    )
    .join('\n');

  return [
    'You are a meeting-notes writer. Below is a transcript where each line is prefixed with [startMs] (milliseconds from the start) and the speaker.',
    '',
    'LANGUAGE (most important rule): detect the language actually spoken in the transcript sentences and write EVERY text field — keyPoints and actionItems — ONLY in that language. If the participants speak Russian, write in Russian. Ignore any English words in the meeting title or borrowed jargon: match the language of the sentences, not of individual game/product terms. Do NOT translate to English.',
    '',
    'SPEAKER NAMES: the "Speaker 0" / "Speaker 1" prefixes are internal IDs. NEVER put any speaker number in the output — not "Speaker 1", not «Участник 1», not «участник 0», not «первый участник». If the transcript reveals a person\'s name (someone is addressed or introduced by name), use that name. Otherwise refer to people without numbering them: «один из участников», «другой участник», «собеседник», «команда». Example: NOT «Участник 1 купил шпагу», but «Один из участников купил шпагу».',
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
    'Do not invent facts that are not in the transcript.',
    '',
    'Transcript:',
    transcript,
  ].join('\n');
}
