import { SearchResultOutput, SearchSort } from '@schema';
import { createEffect, createSignal, mapArray, on } from 'solid-js';
import { unwrap } from 'solid-js/store';

import { useKeydown } from '@/shared/lib/dom';
import { authRoot } from '@/shared/roots/authRoot';

import { searchQuery } from '../../../api/searchQuery';
import { getSearchSortOptions } from '../../../lib/getSearchSortOptions';
import { mapSearchResult } from '../../../lib/mapSearchResult';
import { PAGE_SIZE } from '../config/searchResultsConfig';
import { SearchResultsProps } from '../types/SearchResultsProps';

const STEP_BY_KEY: Record<string, number> = { ArrowDown: 1, ArrowUp: -1 };

export const useSearchResults = (props: SearchResultsProps) => {
  const [sort, setSort] = createSignal(SearchSort.Relevance);
  const [offset, setOffset] = createSignal(0);
  const [items, setItems] = createSignal<SearchResultOutput[]>([]);
  const [total, setTotal] = createSignal(0);
  const [activeIndex, setActiveIndex] = createSignal(0);

  const isIdle = () => props.words.length === 0;

  const [result] = searchQuery(
    () => ({
      input: { query: props.query, sort: sort(), limit: PAGE_SIZE, offset: offset() },
    }),
    { pause: () => !authRoot.isAuth || isIdle() },
  );

  const results = mapArray(items, (item) => mapSearchResult(item, props.words));

  const isLoading = () => result.fetching && !items().length;

  const isEmpty = () => !result.fetching && !items().length;

  const sortOptions = () => getSearchSortOptions();

  const sortLabel = () =>
    sortOptions().find((option) => option.value === sort())?.label;

  const loadMore = () => {
    if (result.fetching || items().length >= total()) return;
    setOffset(items().length);
  };

  const appendPage = () => {
    const input = result.operation?.variables?.input;
    const page = result.data?.search;
    if (!page || input?.query !== props.query) return;
    const pageItems = structuredClone(unwrap(page.items));
    setItems((prev) => [...prev.slice(0, input.offset ?? 0), ...pageItems]);
    setTotal(page.total);
  };

  const reset = () => {
    setOffset(0);
    setItems([]);
    setTotal(0);
    setActiveIndex(0);
  };

  const moveActive = (step: number) => {
    const count = items().length;
    if (!count) return;
    setActiveIndex((index) => (index + step + count) % count);
  };

  const submitActive = () => {
    const active = results()[activeIndex()];
    if (active) props.onSelect(active.href);
  };

  createEffect(on([() => props.query, sort], reset));

  createEffect(on(() => result.operation, appendPage));

  useKeydown((event) => {
    if (event.key in STEP_BY_KEY) {
      event.preventDefault();
      moveActive(STEP_BY_KEY[event.key]!);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      submitActive();
    }
  });

  return {
    sort,
    sortOptions,
    sortLabel,
    results,
    total,
    activeIndex,
    isIdle,
    isLoading,
    isEmpty,
    setSort,
    setActiveIndex,
    loadMore,
  };
};
