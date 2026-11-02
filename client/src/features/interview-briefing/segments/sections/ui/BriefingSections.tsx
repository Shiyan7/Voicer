import { For } from 'solid-js';

import { Tabs } from '@/shared/ui/tabs';

import { getBriefingTabs } from '../lib/getBriefingTabs';
import { useBriefingSections } from '../model/useBriefingSections';
import { BriefingSectionsProps } from '../types/BriefingSectionsProps';
import { briefingSectionsStyles } from './BriefingSections.styles';

const styles = briefingSectionsStyles();

export function BriefingSections(props: BriefingSectionsProps) {
  const vm = useBriefingSections(props);

  return (
    <section class={styles.root()}>
      <Tabs
        tabs={getBriefingTabs()}
        activeTab={vm.activeSection()}
        onSelect={vm.setActiveSection}
      />
      <ol class={styles.items()}>
        <For each={vm.activeItems()}>
          {(item) => <li class={styles.item()}>{item}</li>}
        </For>
      </ol>
    </section>
  );
}
