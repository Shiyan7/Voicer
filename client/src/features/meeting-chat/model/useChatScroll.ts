import { createEffect, createSignal, on } from 'solid-js';

import { ChatScrollParams } from '../types/ChatScrollParams';

export const useChatScroll = (params: ChatScrollParams) => {
  const [body, setBody] = createSignal<HTMLElement>();
  const [input, setInput] = createSignal<HTMLTextAreaElement>();

  createEffect(
    on(params.scrollTrigger, () => {
      const element = body();
      element?.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    }),
  );

  createEffect(() => {
    if (params.isOpen()) input()?.focus();
  });

  createEffect(
    on(params.draft, () => {
      const element = input();
      if (!element) return;
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }),
  );

  const onInputKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
    event.preventDefault();
    params.onSubmit();
  };

  return { setBody, setInput, onInputKeyDown };
};
