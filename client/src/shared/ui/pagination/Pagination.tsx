import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { Icon } from '../icon';
import { paginationStyles } from './Pagination.styles';

const styles = paginationStyles();

export interface PaginationProps {
  page: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function Pagination(props: PaginationProps) {
  return (
    <Show when={props.hasPrev || props.hasNext}>
      <div class={styles.root()}>
        <button
          class={styles.button()}
          type="button"
          disabled={!props.hasPrev}
          onClick={props.onPrev}
        >
          <Icon name="common:chevron-left" size={16} />
          {i18n.t('pagination.prev')}
        </button>
        <span class={styles.page()}>{props.page}</span>
        <button
          class={styles.button()}
          type="button"
          disabled={!props.hasNext}
          onClick={props.onNext}
        >
          {i18n.t('pagination.next')}
          <Icon name="common:chevron-right" size={16} />
        </button>
      </div>
    </Show>
  );
}
