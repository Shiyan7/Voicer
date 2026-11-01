import { i18n } from '@/shared/i18n';

import { LiveTurn } from '../types/LiveTurn';
import { LiveTurnView } from '../types/LiveTurnView';
import { highlightCode } from './highlightCode';

export const toLiveTurnView = (
  turn: LiveTurn,
  isExpanded: boolean,
): LiveTurnView => ({
  id: turn.id,
  question: turn.question,
  isQuestionLive: !turn.isQuestionFinal,
  short: turn.short,
  detailLines: turn.details.split('\n').filter(Boolean),
  toggleLabel: isExpanded
    ? i18n.t('live.session.hide_details')
    : i18n.t('live.session.show_details'),
  hasDetails: turn.details.length > 0,
  codeTokens: highlightCode(turn.code),
  hasCode: turn.code.length > 0,
  codeLanguage: turn.codeLanguage,
  isStreaming: turn.isQuestionFinal && !turn.isDone,
  isExpanded,
});
