import { For, Match, Show, Switch } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { onVisible } from '@/shared/lib/dom';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { SearchResultsProps } from '../types/SearchResultsProps';
import { SearchResultItem } from './SearchResultItem';
import { searchResultsStyles } from './SearchResults.styles';

const styles = searchResultsStyles();

const SKELETON_ROWS = [0, 1, 2, 3];

export function SearchResults(props: SearchResultsProps) {
  return (
    <div class={styles.root()}>
      <Switch>
        <Match when={props.isIdle}>
          <div class={styles.state()}>
            <span class={styles.stateIcon()}>
              <Icon size={28} name="common:search" />
            </span>
            {i18n.t('search.hint')}
          </div>
        </Match>
        <Match when={props.isEmpty}>
          <div class={styles.state()}>{props.emptyLabel}</div>
        </Match>
        <Match when={true}>
          <div class={styles.header()}>
            <span class={styles.label()}>
              {i18n.t('search.results')}
              <Show when={!props.isLoading}> ({props.total})</Show>
            </span>
            <Dropdown
              options={props.sortOptions}
              selected={props.sort}
              onSelect={props.onSortChange}
              triggerClass={styles.sortTrigger()}
              trigger={() => (
                <>
                  <Icon size={18} name="common:filter" />
                  {props.sortLabel}
                </>
              )}
            />
          </div>
          <div class={styles.list()}>
            <Switch>
              <Match when={props.isLoading}>
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
                <For each={props.results}>
                  {(result, index) => (
                    <SearchResultItem
                      result={result}
                      isActive={index() === props.activeIndex}
                      onSelect={props.onSelect}
                      onHover={() => props.onHover(index())}
                    />
                  )}
                </For>
                <div ref={onVisible(() => props.onLoadMore())} class={styles.sentinel()} />
              </Match>
            </Switch>
          </div>
        </Match>
      </Switch>
    </div>
  );
}
