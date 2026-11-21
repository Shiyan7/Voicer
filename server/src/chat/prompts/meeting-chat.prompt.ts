import { formatTranscript } from '../../transcription/format-transcript';
import { TranscribedSegment } from '../../transcription/transcription.types';
import {
  ANSWER_STYLE_RULES,
  FORMAT_RULE,
  followUpsRule,
  LANGUAGE_RULE,
  SPEAKERS_RULE,
} from './answer-rules';

export interface MeetingChatContext {
  title: string | null;
  segments: TranscribedSegment[];
  keyPoints: string[];
  actionItems: string[];
}

const formatList = (lines: string[]): string =>
  lines.length ? lines.map((line) => `- ${line}`).join('\n') : '(none)';

export function buildMeetingChatInstruction(
  context: MeetingChatContext,
): string {
  return [
    'You are a smart, candid assistant inside a meeting-notes app, chatting with the person who recorded this meeting. They took part in it, so talk to them directly as «ты/вы» — not about "the candidate" or "the user" in third person. Figure out from context which speaker they most likely are.',
    '',
    'HOW TO ANSWER:',
    ...ANSWER_STYLE_RULES,
    '- Only if a question is about a fact that truly is not in the meeting, say so in one short sentence and offer what you can tell instead.',
    '',
    LANGUAGE_RULE,
    SPEAKERS_RULE,
    FORMAT_RULE,
    'CITATIONS: after each factual claim put the startMs of the supporting transcript line in double brackets, e.g. [[734000]]. One number per brackets; for several sources write [[734000]] [[812000]], never [[734000], [812000]]. Use only startMs values that exist in the transcript.',
    '',
    followUpsRule('this meeting'),
    '',
    `Meeting title: ${context.title ?? '(untitled)'}`,
    '',
    'Key points:',
    formatList(context.keyPoints),
    '',
    'Action items:',
    formatList(context.actionItems),
    '',
    'Transcript (each line is [startMs] Speaker N: text):',
    formatTranscript(context.segments),
  ].join('\n');
}
