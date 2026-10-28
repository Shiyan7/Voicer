import { formatTranscript } from '../../transcription/format-transcript';
import { TranscribedSegment } from '../../transcription/transcription.types';

const FOLLOW_UPS_MARKER = '---';

const MARKER_LINE = /(?:^|\n)\s*-{3,}\s*(?:\n|$)/;

const PARTIAL_MARKER_TAIL = /\n\s*-{1,2}\s*$/;

const MAX_FOLLOW_UPS = 3;

const CITATION = /\[\[([\d\s,[\]]+)\]\]/g;

export interface MeetingChatContext {
  title: string | null;
  segments: TranscribedSegment[];
  keyPoints: string[];
  actionItems: string[];
}

export interface ParsedAnswer {
  answer: string;
  followUps: string[];
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
    '- Actually answer the question. If they ask for an opinion, estimate, assessment or advice («какие у меня шансы», «как я прошёл», «что я сделал не так»), give your own reasoned judgement based on what happened in the meeting: tone, reactions, how answers went, what was said. A direct estimate (e.g. a rough percentage or «скорее да/нет») with reasons is better than refusing.',
    '- Be conversational and natural, like a sharp friend who listened to the whole recording. Get to the point in the first sentence, no filler like «К сожалению» or «В ходе встречи».',
    '- Facts must come from the meeting; never invent events. Your interpretation and advice may go beyond it — just make clear it is your judgement.',
    '- Only if a question is about a fact that truly is not in the meeting, say so in one short sentence and offer what you can tell instead.',
    '- Keep answers short: usually 2–5 sentences or a short list.',
    '',
    'LANGUAGE: reply in the language of the user question.',
    'SPEAKERS: "Speaker 0" / "Speaker 1" are internal IDs — never write speaker numbers. Use names if the transcript reveals them, otherwise «один из участников», «собеседник».',
    'FORMAT: plain text, short paragraphs. Bulleted lists start with "- ". Use **bold** sparingly. No headings, no tables, no code blocks.',
    'CITATIONS: after each factual claim put the startMs of the supporting transcript line in double brackets, e.g. [[734000]]. One number per brackets; for several sources write [[734000]] [[812000]], never [[734000], [812000]]. Use only startMs values that exist in the transcript.',
    '',
    `ALWAYS write the answer first — it must never be empty. Only after the answer, output a line containing exactly ${FOLLOW_UPS_MARKER} and then ${MAX_FOLLOW_UPS} short follow-up questions (max 7 words each, one per line, no numbering) the user might ask next, phrased in first person from their point of view (e.g. «Где я ошибся?», «Что подтянуть к следующему разу?»), in the same language, answerable from this meeting.`,
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

export function parseAnswer(text: string): ParsedAnswer {
  const [answer, followUpsBlock = ''] = text.split(MARKER_LINE);

  return {
    answer: answer.replace(PARTIAL_MARKER_TAIL, '').trim(),
    followUps: followUpsBlock
      .split('\n')
      .map((line) => line.replace(/^[-*\d.\s]+/, '').trim())
      .filter(Boolean)
      .slice(0, MAX_FOLLOW_UPS),
  };
}

const nearestStartMs = (ms: number, segments: TranscribedSegment[]): number =>
  segments.reduce(
    (nearest, segment) =>
      Math.abs(segment.startMs - ms) < Math.abs(nearest - ms)
        ? segment.startMs
        : nearest,
    segments[0]?.startMs ?? ms,
  );

export function snapCitations(
  answer: string,
  segments: TranscribedSegment[],
): string {
  return answer.replace(CITATION, (_, inner: string) =>
    (inner.match(/\d+/g) ?? [])
      .map((ms) => `[[${nearestStartMs(Number(ms), segments)}]]`)
      .join(' '),
  );
}
