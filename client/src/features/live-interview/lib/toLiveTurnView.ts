import { i18n } from '@/shared/i18n';
import { parseMarkdown } from '@/shared/lib/markdown';

import { LiveTurn } from '../types/LiveTurn';
import { LiveTurnView } from '../types/LiveTurnView';
import { splitAnswer } from './splitAnswer';

const toBlocks = (text: string) => (text ? parseMarkdown(text) : undefined);

export const toLiveTurnView = (
  turn: LiveTurn,
  isExpanded: boolean,
): LiveTurnView => {
  const { short, details, code, codeLanguage } = splitAnswer(turn.answer);
  return {
    id: turn.id,
    question: turn.question,
    imageUrl: turn.imageUrl ?? null,
    isQuestionLive: !turn.isQuestionFinal,
    short: toBlocks(short),
    details: toBlocks(details),
    code,
    codeLanguage,
    toggleLabel: isExpanded
      ? i18n.t('live.session.hide_details')
      : i18n.t('live.session.show_details'),
    isExpanded,
  };
};
