import { For } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Icon } from '@/shared/ui/icon';

import { PrepResumeTilesProps } from '../types/PrepResumeTilesProps';
import { prepResumeTilesStyles } from './PrepResumeTiles.styles';

const styles = prepResumeTilesStyles();

export function PrepResumeTiles(props: PrepResumeTilesProps) {
  return (
    <div class={styles.root()}>
      <For each={props.options}>
        {(option) => (
          <div
            class={styles.tile({ selected: option.id === props.selectedId })}
          >
            <button
              class={styles.select()}
              type="button"
              title={option.label}
              onClick={() => props.onSelect(option.id)}
            >
              <span class={styles.badge()}>pdf</span>
              <span class={styles.name()}>{option.label}</span>
            </button>
            <button
              class={styles.remove()}
              type="button"
              aria-label={i18n.t('live.prep.resume_delete.title')}
              onClick={() => props.onDelete(option.id)}
            >
              <Icon name="common:cross" size={14} />
            </button>
          </div>
        )}
      </For>
    </div>
  );
}
