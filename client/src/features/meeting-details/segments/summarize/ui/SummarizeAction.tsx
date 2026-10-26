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
    <div class={styles.root()}>
      <button
        type="button"
        class={styles.summarize()}
        disabled={props.isSummarizing}
        onClick={vm.runSummarize}
      >
        <Icon size={18} name="common:sparkles" />
        {i18n.t('meetings.summarize')}
      </button>
      <span class={styles.divider()} />
      <Dropdown
        options={vm.styleOptions()}
        selected={vm.selectedStyle()}
        onSelect={vm.selectStyle}
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
