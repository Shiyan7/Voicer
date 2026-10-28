import { ChatMessageView } from '../../../types/ChatMessageView';

export interface ChatMessageProps {
  message: ChatMessageView;
  onSeek: (ms: number) => void;
}
