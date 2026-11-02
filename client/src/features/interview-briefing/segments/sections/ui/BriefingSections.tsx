import { For } from 'solid-js';

import { Tabs } from '@/shared/ui/tabs';

import { BriefingSectionsProps } from '../types/BriefingSectionsProps';
import { briefingSectionsStyles } from './BriefingSections.styles';

const styles = briefingSectionsStyles();

export function BriefingSections(props: BriefingSectionsProps) {
  return (
    <section class={styles.root()}>
      <Tabs
        tabs={props.tabs}
        activeTab={props.activeSection}
        onSelect={props.onSelectSection}
      />
      <ol class={styles.items()}>
        <For each={props.items}>
          {(item) => <li class={styles.item()}>{item}</li>}
        </For>
      </ol>
    </section>
  );
}
