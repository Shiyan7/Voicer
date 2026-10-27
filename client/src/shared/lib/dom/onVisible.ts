import { onCleanup } from 'solid-js';

export const onVisible =
  (callback: () => void, rootMargin = '200px') =>
  (element: HTMLElement) => {
    const observer = new IntersectionObserver(
      ([entry]) => entry?.isIntersecting && callback(),
      { root: element.parentElement, rootMargin },
    );
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  };
