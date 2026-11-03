import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { useSearchInput } from '../model/useSearchInput';
import { SearchInputDeps } from '../types/SearchInputDeps';
import { searchInputStyles } from './SearchInput.styles';

const styles = searchInputStyles();

export function SearchInput(deps: SearchInputDeps) {
  const vm = useSearchInput(deps);

  return (
    <div class={styles.root()}>
      <Icon class={styles.icon()} size={22} name="common:search" />
      <input
        class={styles.input()}
        ref={vm.setInputRef}
        type="text"
        value={deps.query}
        placeholder={i18n.t('search.placeholder')}
        aria-label={i18n.t('search.placeholder')}
        onInput={vm.onInput}
      />
      <Show when={vm.hasQuery()}>
        <button class={styles.clear()} type="button" onClick={vm.clear}>
          {i18n.t('search.clear')}
        </button>
      </Show>
    </div>
  );
}
