import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { onVisible } from '@/shared/lib/dom';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { SKELETON_ROWS } from '../config/searchResultsConfig';
import { useSearchResults } from '../model/useSearchResults';
import { SearchResultsDeps } from '../types/SearchResultsDeps';
import { SearchResultItem } from './SearchResultItem';
import { searchResultsStyles } from './SearchResults.styles';

const styles = searchResultsStyles();

export function SearchResults(deps: SearchResultsDeps) {
  const vm = useSearchResults(deps);

  return (
    <div class={styles.root()}>
      <Switch>
        <Match when={vm.isIdle()}>
          <div class={styles.state()}>
            <span class={styles.stateIcon()}>
              <Icon size={28} name="common:search" />
            </span>
            {i18n.t('search.hint')}
          </div>
        </Match>
        <Match when={vm.isEmpty()}>
          <div class={styles.state()}>
            {i18n.t('search.empty', { query: deps.query.trim() })}
          </div>
        </Match>
        <Match when={true}>
          <div class={styles.header()}>
            <span class={styles.label()}>
              {i18n.t('search.results')}
              <Show when={!vm.isLoading()}> ({vm.total()})</Show>
            </span>
            <Dropdown
              options={vm.sortOptions()}
              selected={vm.sort()}
              onSelect={vm.setSort}
              triggerClass={styles.sortTrigger()}
              trigger={() => (
                <>
                  <Icon size={18} name="common:filter" />
                  {vm.sortLabel()}
                </>
              )}
            />
          </div>
          <div class={styles.list()}>
            <Switch>
              <Match when={vm.isLoading()}>
                <For each={SKELETON_ROWS}>
                  {() => (
                    <div class={styles.skeleton()}>
                      <div class={styles.skeletonIcon()} />
                      <div class={styles.skeletonLines()}>
                        <div class={styles.skeletonTitle()} />
                        <div class={styles.skeletonText()} />
                      </div>
                    </div>
                  )}
                </For>
              </Match>
              <Match when={true}>
                <For each={vm.results()}>
                  {(result, index) => (
                    <SearchResultItem
                      result={result}
                      isActive={index() === vm.activeIndex()}
                      onSelect={deps.onSelect}
                      onHover={() => vm.setActiveIndex(index())}
                    />
                  )}
                </For>
                <div
                  class={styles.sentinel()}
                  ref={onVisible(() => vm.loadMore())}
                />
              </Match>
            </Switch>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
