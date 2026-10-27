import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { Dropdown } from '@/shared/ui/dropdown';
import { Icon } from '@/shared/ui/icon';

import { useSummarize } from '../model/useSummarize';
import { SummarizeParams } from '../types/SummarizeParams';
import { summarizeActionStyles } from './SummarizeAction.styles';

const styles = summarizeActionStyles();

export function SummarizeAction(props: SummarizeParams) {
  const vm = useSummarize(props);

  return (
    <div class={styles.root({ pending: props.isSummarizing })}>
      <button
        class={styles.summarize()}
        type="button"
        disabled={props.isSummarizing}
        onClick={vm.runSummarize}
      >
        <Icon
          class={styles.sparkles({ pending: props.isSummarizing })}
          size={18}
          name="common:sparkles"
        />
        <Show
          when={props.isSummarizing}
          fallback={i18n.t('meetings.summarize')}
        >
          {i18n.t('meetings.summarizing')}
        </Show>
      </button>
      <span class={styles.divider()} />
      <Dropdown
        options={vm.styleOptions()}
        selected={vm.selectedStyle()}
        disabled={props.isSummarizing}
        onSelect={vm.summarizeWith}
        triggerClass={styles.trigger()}
        trigger={(opened) => (
          <Icon
            class={styles.chevron({ opened })}
            size={14}
            name="common:chevron-right"
          />
        )}
      />
    </div>
  );
}
