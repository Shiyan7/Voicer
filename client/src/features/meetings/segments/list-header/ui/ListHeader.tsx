import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { ListHeaderProps } from '../types/ListHeaderProps';
import { listHeaderStyles } from './ListHeader.styles';

const styles = listHeaderStyles();

export function ListHeader(props: ListHeaderProps) {
  return (
    <div class={styles.root()}>
      <h2 class={styles.title()}>{props.title}</h2>
      <div class={styles.actions()}>
        <button
          class={styles.iconBtn({ active: props.favoritesOnly })}
          type="button"
          title={i18n.t('meetings.only_favorites')}
          aria-label={i18n.t('meetings.only_favorites')}
          aria-pressed={props.favoritesOnly}
          onClick={props.onToggleFavorites}
        >
          <Icon size={20} name={props.favoritesIcon} />
        </button>
        <Show when={props.showSourceFilter}>
          <Dropdown
            options={props.sourceOptions}
            selected={props.source}
            onSelect={props.onSourceChange}
            triggerClass={styles.iconBtn({ active: props.hasSourceFilter })}
            trigger={() => (
              <span title={i18n.t('meetings.filter.title')}>
                <Icon size={20} name="common:filter" />
                <Show when={props.hasSourceFilter}>
                  <span class={styles.dot()} />
                </Show>
              </span>
            )}
          />
        </Show>
        <Dropdown
          options={props.sortOptions}
          selected={props.sort}
          onSelect={props.onSortChange}
          triggerClass={styles.iconBtn({ active: props.isCustomSort })}
          trigger={() => (
            <span title={i18n.t('meetings.sort.title')}>
              <Icon size={20} name="common:sort" />
              <Show when={props.isCustomSort}>
                <span class={styles.dot()} />
              </Show>
            </span>
          )}
        />
      </div>
    </div>
  );
}
