import { ParentProps } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { listFiltersStyles } from './ListFilters.styles';

interface ListFiltersBarProps extends ParentProps {
  count: string;
}

const styles = listFiltersStyles();

export function ListFiltersBar(props: ListFiltersBarProps) {
  return (
    <div class={styles.root()}>
      <h2 class={styles.title()}>
        {i18n.t('filters.total')}{' '}
        <span class={styles.count()}>{props.count}</span>
      </h2>
      <div class={styles.actions()}>{props.children}</div>
    </div>
  );
}
