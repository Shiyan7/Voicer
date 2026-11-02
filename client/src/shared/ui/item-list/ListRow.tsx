import { A } from '@solidjs/router';
import { JSX, Show } from 'solid-js';

import { Icon, type IconName } from '../icon';
import { listRowStyles } from './ListRow.styles';

interface ListRowProps {
  href: string;
  icon: IconName;
  title: string;
  meta?: string | null;
  dateLabel: string;
  dateTitle?: string;
  actions?: JSX.Element;
}

const styles = listRowStyles();

export function ListRow(props: ListRowProps) {
  return (
    <div class={styles.card()}>
      <A class={styles.open()} href={props.href} aria-label={props.title} />
      <Icon class={styles.icon()} size={20} name={props.icon} />
      <span class={styles.body()}>
        <span class={styles.title()}>{props.title}</span>
        <Show when={props.meta}>
          <span class={styles.meta()}>{props.meta}</span>
        </Show>
      </span>
      <span
        class={styles.date({ hasActions: !!props.actions })}
        title={props.dateTitle}
      >
        {props.dateLabel}
      </span>
      <Show when={props.actions}>
        <div class={styles.actions()}>{props.actions}</div>
      </Show>
    </div>
  );
}
