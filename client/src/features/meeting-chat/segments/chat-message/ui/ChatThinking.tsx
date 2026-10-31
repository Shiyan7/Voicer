import { ThinkingOrb } from '@/shared/ui/thinking-orb';

import { ChatThinkingProps } from '../types/ChatThinkingProps';
import { chatThinkingStyles } from './ChatThinking.styles';

const styles = chatThinkingStyles();

export function ChatThinking(props: ChatThinkingProps) {
  return (
    <div class={styles.root()} role="status">
      <ThinkingOrb state="connecting" size={20} />
      {props.label}
    </div>
  );
}
