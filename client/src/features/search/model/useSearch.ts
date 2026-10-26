import { SearchSort } from '@schema';
import { useNavigate } from '@solidjs/router';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { i18n } from '@/shared/i18n';
import {
  activeModals,
  closeModal,
  MODALS,
  showModal,
} from '@/shared/lib/modal';
import { authRoot } from '@/shared/roots/authRoot';

import { searchQuery } from '../api/searchQuery';
import { getSearchSortOptions } from '../lib/getSearchSortOptions';
import { mapSearchResults } from '../lib/mapSearchResults';
import { splitQueryWords } from '../lib/splitQueryWords';
import { useSearchHotkeys } from './useSearchHotkeys';

const DEBOUNCE_MS = 250;
const FOCUS_DELAY_MS = 50;

export const useSearch = () => {
  const navigate = useNavigate();

  const [query, setQuery] = createSignal('');
  const [debouncedQuery, setDebouncedQuery] = createSignal('');
  const [sort, setSort] = createSignal(SearchSort.Relevance);
  const [activeIndex, setActiveIndex] = createSignal(0);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const isOpen = () => activeModals().includes(MODALS.SEARCH);

  const words = () => splitQueryWords(debouncedQuery());

  const hasQuery = () => words().length > 0;

  const [result] = searchQuery(
    () => ({ input: { query: debouncedQuery(), sort: sort() } }),
    { pause: () => !authRoot.isAuth || !isOpen() || !hasQuery() },
  );

  const rawResults = () => (hasQuery() ? (result.data?.search ?? []) : []);

  const results = () => mapSearchResults(rawResults(), words(), activeIndex());

  const isLoading = () => hasQuery() && result.fetching && !rawResults().length;

  const isEmpty = () => hasQuery() && !result.fetching && !rawResults().length;

  const isIdle = () => !hasQuery();

  const emptyLabel = () =>
    i18n.t('search.empty', { query: debouncedQuery().trim() });

  const sortOptions = () => getSearchSortOptions();

  const sortLabel = () =>
    sortOptions().find((option) => option.value === sort())?.label ?? '';

  createEffect(
    on(query, (value) => {
      const timer = setTimeout(() => setDebouncedQuery(value), DEBOUNCE_MS);
      onCleanup(() => clearTimeout(timer));
    }),
  );

  createEffect(on([debouncedQuery, sort], () => setActiveIndex(0)));

  createEffect(
    on(isOpen, (open) => {
      if (!open) return;
      const timer = setTimeout(() => inputRef()?.select(), FOCUS_DELAY_MS);
      onCleanup(() => clearTimeout(timer));
    }),
  );

  const close = () => closeModal(MODALS.SEARCH);

  const toggle = () => (isOpen() ? close() : showModal(MODALS.SEARCH));

  const openResult = (href: string) => {
    close();
    navigate(href);
  };

  const moveActive = (step: number) => {
    const count = rawResults().length;
    if (!count) return;
    setActiveIndex((index) => (index + step + count) % count);
  };

  const submitActive = () => {
    const active = results()[activeIndex()];
    if (active) openResult(active.href);
  };

  const clear = () => {
    setQuery('');
    setDebouncedQuery('');
    setActiveIndex(0);
    inputRef()?.focus();
  };

  const onInput = (event: InputEvent) =>
    setQuery((event.currentTarget as HTMLInputElement).value);

  useSearchHotkeys({
    isOpen,
    onToggle: toggle,
    onMove: moveActive,
    onSubmit: submitActive,
  });

  return {
    query,
    sort,
    sortOptions,
    sortLabel,
    results,
    isLoading,
    isEmpty,
    isIdle,
    emptyLabel,
    hasQueryText: () => query().length > 0,
    setInputRef,
    setSort,
    setActiveIndex,
    onInput,
    clear,
    openResult,
  };
};
