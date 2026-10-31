import { ChatThinkingProps } from '../types/ChatThinkingProps';
import { chatThinkingStyles } from './ChatThinking.styles';

const styles = chatThinkingStyles();

export function ChatThinking(props: ChatThinkingProps) {
  return (
    <div class={styles.root()} role="status">
      <svg class={styles.spinner()} viewBox="0 0 50 50" aria-hidden>
        <circle class={styles.track()} cx="25" cy="25" r="20" />
      </svg>
      {props.label}
    </div>
  );
}
