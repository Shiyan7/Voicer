import { onCleanup, onMount } from 'solid-js';

import { FOCUS_DELAY_MS } from '../config/FOCUS_DELAY_MS';
import { SearchInputProps } from '../types/SearchInputProps';

export const useSearchInput = (props: SearchInputProps) => {
  let input: HTMLInputElement | undefined;

  const setInputRef = (element: HTMLInputElement) => {
    input = element;
  };

  const hasQuery = () => props.query.length > 0;

  const onInput = (event: InputEvent & { currentTarget: HTMLInputElement }) =>
    props.onQueryChange(event.currentTarget.value);

  const clear = () => {
    props.onClear();
    input?.focus();
  };

  onMount(() => {
    const timer = setTimeout(() => input?.select(), FOCUS_DELAY_MS);
    onCleanup(() => clearTimeout(timer));
  });

  return { setInputRef, hasQuery, onInput, clear };
};
