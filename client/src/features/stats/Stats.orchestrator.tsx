import { Show } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { PageFade } from '@/shared/ui/page-fade';

import { useStats } from './model/useStats';
import { DayPanel, DayPanelHint } from './segments/day-panel';
import { Heatmap } from './segments/heatmap';
import { Kpi } from './segments/kpi';
import { Sources } from './segments/sources';
import { statsStyles } from './Stats.styles';

const styles = statsStyles();

export function StatsOrchestrator() {
  const vm = useStats();

  return (
    <PageFade>
      <div class={styles.root()}>
        <h1 class={styles.title()}>{i18n.t('stats.title')}</h1>
        <Kpi summary={vm.summary()} />
        <Heatmap
          year={vm.year()}
          years={vm.summary()?.years ?? [vm.year()]}
          days={vm.yearStats()?.days ?? []}
          selectedDate={vm.selectedDate()}
          isLoading={vm.isYearLoading()}
          onYearChange={vm.selectYear}
          onSelect={vm.toggleDate}
        />
        <Show when={vm.selectedDate()} fallback={<DayPanelHint />}>
          {(date) => <DayPanel date={date()} />}
        </Show>
        <Sources sources={vm.yearStats()?.sources ?? []} />
      </div>
    </PageFade>
  );
}
