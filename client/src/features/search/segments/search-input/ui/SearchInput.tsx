import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { SearchInputProps } from '../types/SearchInputProps';
import { searchInputStyles } from './SearchInput.styles';

const styles = searchInputStyles();

export function SearchInput(props: SearchInputProps) {
  return (
    <div class={styles.root()}>
      <Icon class={styles.icon()} size={22} name="common:search" />
      <input
        class={styles.input()}
        ref={props.setRef}
        type="text"
        value={props.query}
        placeholder={i18n.t('search.placeholder')}
        aria-label={i18n.t('search.placeholder')}
        onInput={props.onInput}
      />
      <Show when={props.hasQueryText}>
        <button class={styles.clear()} type="button" onClick={props.onClear}>
          {i18n.t('search.clear')}
        </button>
      </Show>
    </div>
  );
}
