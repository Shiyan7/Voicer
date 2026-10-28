import { ChatBlock } from './ChatBlock';

export interface ChatMessageView {
  id: string;
  isUser: boolean;
  text: string;
  blocks: ChatBlock[];
  isFailed: boolean;
}
