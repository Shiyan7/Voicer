import { JSX, ParentProps, Show } from 'solid-js';

import { itemListStyles } from './ItemList.styles';
import { ItemListSkeleton } from './ItemListSkeleton';

interface ItemListProps extends ParentProps {
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  emptyAction?: JSX.Element;
  footer?: JSX.Element;
}

const styles = itemListStyles();

export function ItemList(props: ItemListProps) {
  return (
    <Show when={!props.isLoading} fallback={<ItemListSkeleton />}>
      <Show
        when={!props.isEmpty}
        fallback={
          <div class={styles.empty()}>
            <span class={styles.emptyTitle()}>{props.emptyLabel}</span>
            {props.emptyAction}
          </div>
        }
      >
        <div class={styles.list()}>
          <div class={styles.rows()}>{props.children}</div>
          {props.footer}
        </div>
      </Show>
    </Show>
  );
}
