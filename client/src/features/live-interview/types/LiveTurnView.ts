import { CodeToken } from './CodeToken';

export interface LiveTurnView {
  id: string;
  question: string;
  isQuestionLive: boolean;
  short: string;
  detailLines: string[];
  toggleLabel: string;
  hasDetails: boolean;
  codeTokens: CodeToken[];
  hasCode: boolean;
  codeLanguage: string;
  isStreaming: boolean;
  isExpanded: boolean;
}
