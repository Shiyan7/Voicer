import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';

import { useBriefingVacancy } from '../model/useBriefingVacancy';
import { BriefingVacancyDeps } from '../types/BriefingVacancyDeps';
import { briefingVacancyStyles } from './BriefingVacancy.styles';

const styles = briefingVacancyStyles();

export function BriefingVacancy(deps: BriefingVacancyDeps) {
  const vm = useBriefingVacancy();

  return (
    <div class={styles.root()}>
      <span class={styles.label()}>{i18n.t('live.prep.vacancy')}</span>
      <p
        class={styles.text({
          expanded: vm.isExpanded(),
          faded: vm.isFaded(),
        })}
        ref={vm.measure}
      >
        {deps.text}
      </p>
      <Show when={vm.isLong()}>
        <button class={styles.toggle()} type="button" onClick={vm.toggle}>
          {vm.toggleLabel()}
        </button>
      </Show>
    </div>
  );
}
