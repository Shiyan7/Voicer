import { createRoot } from 'solid-js';

type IntersectionCallback = (isIntersecting: boolean) => void;

interface IntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

export const intersectionRoot = createRoot(() => {
  const callbacks = new WeakMap<Element, IntersectionCallback>();

  let observer: IntersectionObserver | null = null;
  let observedCount = 0;

  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      callbacks.get(entry.target)?.(entry.isIntersecting);
    });
  };

  const getObserver = (options?: IntersectionOptions): IntersectionObserver => {
    if (!observer) {
      observer = new IntersectionObserver(handleIntersection, {
        root: null,
        rootMargin: '250px 0px',
        threshold: 0.01,
        ...options,
      });
    }

    return observer;
  };

  const teardownIfEmpty = () => {
    if (observedCount === 0 && observer) {
      observer.disconnect();
      observer = null;
    }
  };

  const observe = (
    element: Element,
    callback: IntersectionCallback,
    options?: IntersectionOptions,
  ): (() => void) => {
    if (!callbacks.has(element)) observedCount++;
    callbacks.set(element, callback);
    getObserver(options).observe(element);

    return () => {
      if (!callbacks.has(element)) return;

      callbacks.delete(element);
      observedCount--;
      observer?.unobserve(element);
      teardownIfEmpty();
    };
  };

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      observer?.disconnect();
      observer = null;
      observedCount = 0;
    });
  }

  return { observe };
});
