import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useBriefingVacancy } from '../model/useBriefingVacancy';
import { BriefingVacancyProps } from '../types/BriefingVacancyProps';
import { briefingVacancyStyles } from './BriefingVacancy.styles';

const styles = briefingVacancyStyles();

export function BriefingVacancy(props: BriefingVacancyProps) {
  const vm = useBriefingVacancy();

  return (
    <div class={styles.root()}>
      <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
      <p
        class={styles.text({ expanded: vm.isExpanded(), faded: vm.isFaded() })}
        ref={vm.measure}
      >
        {props.text}
      </p>
      <Show when={vm.isLong()}>
        <button class={styles.toggle()} type="button" onClick={vm.toggle}>
          {vm.toggleLabel()}
        </button>
      </Show>
    </div>
  );
}
