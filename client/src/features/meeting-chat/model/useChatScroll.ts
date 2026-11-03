import { createEffect, createSignal, on } from 'solid-js';

import { ChatScrollDeps } from '../types/ChatScrollDeps';

export const useChatScroll = (deps: ChatScrollDeps) => {
  const [body, setBody] = createSignal<HTMLElement>();
  const [input, setInput] = createSignal<HTMLTextAreaElement>();

  createEffect(
    on(deps.scrollTrigger, () => {
      const element = body();
      element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }),
  );

  createEffect(() => {
    if (deps.isOpen()) input()?.focus();
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
