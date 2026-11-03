import { onCleanup, onMount } from 'solid-js';

import { FOCUS_DELAY_MS } from '../config/FOCUS_DELAY_MS';
import { SearchInputDeps } from '../types/SearchInputDeps';

export const useSearchInput = (deps: SearchInputDeps) => {
  let input: HTMLInputElement | undefined;

  const setInputRef = (element: HTMLInputElement) => {
    input = element;
  };

  const hasQuery = () => deps.query.length > 0;

  const onInput = (event: InputEvent & { currentTarget: HTMLInputElement }) =>
    deps.onQueryChange(event.currentTarget.value);

  const clear = () => {
    deps.onClear();
    input?.focus();
  };

  onMount(() => {
    const timer = setTimeout(() => input?.select(), FOCUS_DELAY_MS);
    onCleanup(() => clearTimeout(timer));
  });

  return { setInputRef, hasQuery, onInput, clear };
};
