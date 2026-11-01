import { createSignal } from 'solid-js';

const BOTTOM_THRESHOLD_PX = 80;

export function useScrollToBottom() {
  const [scroller, setScroller] = createSignal<HTMLElement>();
  const [isAwayFromBottom, setIsAwayFromBottom] = createSignal(false);

  const onScroll = () => {
    const element = scroller();
    if (!element) return;
    setIsAwayFromBottom(Math.abs(element.scrollTop) > BOTTOM_THRESHOLD_PX);
  };

  const scrollToBottom = () =>
    scroller()?.scrollTo({ top: 0, behavior: 'smooth' });

  return { setScroller, isAwayFromBottom, onScroll, scrollToBottom };
}
