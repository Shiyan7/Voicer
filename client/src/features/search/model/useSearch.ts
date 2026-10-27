import { useNavigate } from '@solidjs/router';
import { createEffect, createSignal, on, onCleanup } from 'solid-js';

import { useKeydown } from '@/shared/lib/dom';
import {
  activeModals,
  closeModal,
  MODALS,
  showModal,
} from '@/shared/lib/modal';

import { DEBOUNCE_MS } from '../config/searchConfig';
import { splitQueryWords } from '../lib/splitQueryWords';

const isToggleShortcut = (event: KeyboardEvent) =>
  (event.metaKey || event.ctrlKey) && event.code === 'KeyK';

export const useSearch = () => {
  const navigate = useNavigate();

  const [query, setQuery] = createSignal('');
  const [debouncedQuery, setDebouncedQuery] = createSignal('');

  const words = () => splitQueryWords(debouncedQuery());

  const isOpen = () => activeModals().includes(MODALS.SEARCH);

  const close = () => closeModal(MODALS.SEARCH);

  const toggle = () => (isOpen() ? close() : showModal(MODALS.SEARCH));

  const openResult = (href: string) => {
    close();
    navigate(href);
  };

  const clear = () => {
    setQuery('');
    setDebouncedQuery('');
  };

  createEffect(
    on(query, (value) => {
      const timer = setTimeout(() => setDebouncedQuery(value), DEBOUNCE_MS);
      onCleanup(() => clearTimeout(timer));
    }),
  );

  useKeydown((event) => {
    if (!isToggleShortcut(event)) return;
    event.preventDefault();
    toggle();
  });

  return {
    query,
    debouncedQuery,
    words,
    setQuery,
    clear,
    openResult,
  };
};
