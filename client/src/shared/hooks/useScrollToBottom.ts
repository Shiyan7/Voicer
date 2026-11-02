import { createSignal, onCleanup, onMount } from 'solid-js';

const BOTTOM_THRESHOLD_PX = 80;

const distanceToBottom = () =>
  document.documentElement.scrollHeight - window.innerHeight - window.scrollY;

const scrollPageToBottom = (behavior: ScrollBehavior) =>
  window.scrollTo({ top: document.documentElement.scrollHeight, behavior });

export function useScrollToBottom() {
  const [isAwayFromBottom, setIsAwayFromBottom] = createSignal(false);

  const onScroll = () =>
    setIsAwayFromBottom(distanceToBottom() > BOTTOM_THRESHOLD_PX);

  const onContentResize = () => {
    if (!isAwayFromBottom()) scrollPageToBottom('auto');
  };

  const scrollToBottom = () => scrollPageToBottom('smooth');

  onMount(() => {
    const observer = new ResizeObserver(onContentResize);
    observer.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    onCleanup(() => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    });
  });

  return { isAwayFromBottom, scrollToBottom };
}
