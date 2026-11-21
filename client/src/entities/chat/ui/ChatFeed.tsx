import { Index, Show } from 'solid-js';

import { ChatFeedProps } from '../types/ChatFeedProps';
import { ChatMessage } from './ChatMessage';
import { ChatThinking } from './ChatThinking';
import { QuestionChips } from './QuestionChips';

export function ChatFeed(props: ChatFeedProps) {
  return (
    <>
      <Index each={props.messages}>
        {(message) => (
          <ChatMessage
            message={message()}
            isCopied={props.isCopied(message().id)}
            renderTime={props.renderTime}
            onCopy={props.onCopy}
          />
        )}
      </Index>
      <Show when={props.isThinking}>
        <ChatThinking label={props.thinkingLabel} />
      </Show>
      <QuestionChips
        questions={props.followUps}
        disabled={props.isAnswering}
        onAsk={props.onAsk}
      />
    </>
  );
}
