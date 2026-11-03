import { For } from 'solid-js';

import { Tabs } from '@/shared/ui/tabs';

import { useBriefingSections } from '../model/useBriefingSections';
import { BriefingSectionsDeps } from '../types/BriefingSectionsDeps';
import { briefingSectionsStyles } from './BriefingSections.styles';

const styles = briefingSectionsStyles();

export function BriefingSections(deps: BriefingSectionsDeps) {
  const vm = useBriefingSections(deps);

  return (
    <section class={styles.root()}>
      <Tabs
        tabs={vm.tabs()}
        activeTab={vm.activeSection()}
        onSelect={vm.setActiveSection}
      />
      <ol class={styles.items()}>
        <For each={vm.items()}>
          {(item) => <li class={styles.item()}>{item}</li>}
        </For>
      </ol>
    </section>
  );
}
