import { SHORT_ANSWER_MIN_LENGTH } from '../config/liveInterviewConfig';

const CODE_FENCE = /```([\w+#-]*)[^\n]*\n?([\s\S]*?)(?:```|$)/g;
const SENTENCE = /[^.!?…]+(?:[.!?…]+|$)/g;

const extractCode = (text: string) => {
  const blocks = [...text.matchAll(CODE_FENCE)];
  return {
    prose: text.replace(CODE_FENCE, '\n').trim(),
    code: blocks
      .map((block) => block[2].trimEnd())
      .filter(Boolean)
      .join('\n\n'),
    codeLanguage: blocks.find((block) => block[1])?.[1] ?? '',
  };
};

const splitShort = (prose: string) => {
  const sentences = prose.match(SENTENCE) ?? [];
  const [first = '', second = ''] = sentences;
  const shortCount =
    first.trim().length < SHORT_ANSWER_MIN_LENGTH && second ? 2 : 1;
  return {
    short: sentences.slice(0, shortCount).join('').trim(),
    details: sentences.slice(shortCount).join('').trim(),
  };
};

export const splitAnswer = (text: string) => {
  const { prose, code, codeLanguage } = extractCode(text);
  return { ...splitShort(prose), code, codeLanguage };
};
