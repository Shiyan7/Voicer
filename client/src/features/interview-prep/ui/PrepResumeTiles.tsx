import { For } from 'solid-js';

import { PrepResumeOption } from '../types/PrepResumeOption';
import { prepResumeTilesStyles } from './PrepResumeTiles.styles';

interface PrepResumeTilesProps {
  options: PrepResumeOption[];
  selectedId: string | undefined;
  onSelect: (id: string) => void;
}

export function PrepResumeTiles(props: PrepResumeTilesProps) {
  const styles = (id?: string) =>
    prepResumeTilesStyles({ selected: id === props.selectedId });

  return (
    <div class={styles().root()}>
      <For each={props.options}>
        {(option) => (
          <button
            class={styles(option.id).tile()}
            type="button"
            title={option.label}
            onClick={() => props.onSelect(option.id)}
          >
            <span class={styles().badge()}>pdf</span>
            <span class={styles().name()}>{option.label}</span>
          </button>
        )}
      </For>
    </div>
  );
}
