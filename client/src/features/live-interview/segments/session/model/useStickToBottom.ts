import { createEffect, createSignal, onCleanup } from 'solid-js';

import { STICK_TO_BOTTOM_THRESHOLD_PX } from '../config/STICK_TO_BOTTOM_THRESHOLD_PX';
import { getScrollParent } from '../lib/getScrollParent';

const distanceToBottom = (element: HTMLElement) =>
  element.scrollHeight - element.scrollTop - element.clientHeight;

export function useStickToBottom() {
  const [content, setContent] = createSignal<HTMLElement>();

  createEffect(() => {
    const element = content();
    if (!element) return;
    const scroller = getScrollParent(element);
    const scrollTarget =
      scroller === document.documentElement ? window : scroller;
    let isStuck = true;

    const onScroll = () => {
      isStuck = distanceToBottom(scroller) <= STICK_TO_BOTTOM_THRESHOLD_PX;
    };
    const observer = new ResizeObserver(() => {
      if (isStuck) scroller.scrollTop = scroller.scrollHeight;
    });

    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    observer.observe(element);
    onCleanup(() => {
      scrollTarget.removeEventListener('scroll', onScroll);
      observer.disconnect();
    });
  });

  return { setContent };
}
