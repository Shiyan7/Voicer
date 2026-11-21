import { ChatMessageOutput } from '@schema';
import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

import { REVEAL_CATCH_UP_FRAMES, REVEAL_MIN_STEP } from '../config/chatConfig';

const toStep = (backlog: number) =>
  Math.max(REVEAL_MIN_STEP, Math.ceil(backlog / REVEAL_CATCH_UP_FRAMES));

export const useTypewriter = (messages: Accessor<ChatMessageOutput[]>) => {
  const [typingId, setTypingId] = createSignal<string | null>(null);
  const [revealed, setRevealed] = createSignal(0);

  const target = () =>
    messages().find(({ id }) => id === typingId())?.content.length ?? 0;

  createEffect(() => {
    const backlog = target() - revealed();
    if (backlog <= 0) return;
    if (document.hidden) {
      setRevealed(target());
      return;
    }
    const frame = requestAnimationFrame(() =>
      setRevealed((count) => count + toStep(backlog)),
    );
    onCleanup(() => cancelAnimationFrame(frame));
  });

  const type = (id: string) => {
    if (id === typingId()) return;
    setTypingId(id);
    setRevealed(0);
  };

  const reveal = (message: ChatMessageOutput): ChatMessageOutput => {
    if (message.id !== typingId()) return message;
    const length = Math.min(revealed(), message.content.length);
    return {
      ...message,
      content: message.content.slice(0, length),
      isStreaming: message.isStreaming || length < message.content.length,
    };
  };

  return { type, reveal };
};
