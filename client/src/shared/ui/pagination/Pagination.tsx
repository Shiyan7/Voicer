import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { Icon } from '../icon';
import { paginationStyles } from './Pagination.styles';

const styles = paginationStyles();

interface PaginationProps {
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
        <div class={styles.group()}>
          <button
            class={styles.button()}
            type="button"
            aria-label={i18n.t('pagination.prev')}
            disabled={!props.hasPrev}
            onClick={props.onPrev}
          >
            <Icon name="common:chevron-left" size={16} />
          </button>
          <span class={styles.page()}>
            {i18n.t('pagination.page', { page: String(props.page) })}
          </span>
          <button
            class={styles.button()}
            type="button"
            aria-label={i18n.t('pagination.next')}
            disabled={!props.hasNext}
            onClick={props.onNext}
          >
            <Icon name="common:chevron-right" size={16} />
          </button>
        </div>
      </div>
    </Show>
  );
}
