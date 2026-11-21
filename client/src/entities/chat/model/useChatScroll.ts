import { createEffect, createSignal, on } from 'solid-js';

import { ChatScrollDeps } from '../types/ChatScrollDeps';

export const useChatScroll = (deps: ChatScrollDeps) => {
  const [body, setBody] = createSignal<HTMLElement>();
  const [input, setInput] = createSignal<HTMLTextAreaElement>();
  let settledThreadId: string | undefined;

  const scrollToBottom = () => {
    const element = body();
    if (!element) return;
    const threadId = deps.threadId();
    const behavior = settledThreadId === threadId ? 'smooth' : 'instant';
    element.scrollTo({ top: element.scrollHeight, behavior });
    if (deps.hasMessages()) settledThreadId = threadId;
  };

  createEffect(on([deps.scrollTrigger, body], scrollToBottom));

  createEffect(() => {
    if (deps.shouldFocus?.() ?? true) input()?.focus();
  });

  createEffect(
    on(deps.draft, () => {
      const element = input();
      if (!element) return;
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }),
  );

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    deps.onSubmit();
  };

  return { setBody, setInput, onInputKeyDown };
};
