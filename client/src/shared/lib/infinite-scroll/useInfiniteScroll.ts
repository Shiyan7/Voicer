import { Accessor, createEffect, createSignal, onCleanup } from 'solid-js';

import { intersectionRoot } from '@/shared/roots/intersectionRoot';

interface UseInfiniteScrollOptions<T> {
  items: Accessor<T[] | undefined>;
  hasMore: Accessor<boolean>;
  isFetching: Accessor<boolean>;
  loadMore: () => void;
}

export const useInfiniteScroll = <T>(options: UseInfiniteScrollOptions<T>) => {
  const [accumulated, setAccumulated] = createSignal<T[]>([]);

  createEffect(() => {
    const current = options.items();
    if (current?.length) setAccumulated((prev) => [...prev, ...current]);
  });

  const isLoadingMore = () => options.isFetching() && accumulated().length > 0;

  const setTriggerRef = (el: HTMLElement) => {
    const unobserve = intersectionRoot.observe(el, (isIntersecting) => {
      if (isIntersecting && options.hasMore() && !options.isFetching()) {
        options.loadMore();
      }
    });

    onCleanup(() => unobserve());
  };

  const reset = () => setAccumulated([]);

  return { accumulated, setTriggerRef, reset, isLoadingMore };
};
