import { onCleanup, onMount } from 'solid-js';
import { createMutable } from 'solid-js/store';

export abstract class StatefulViewModel<TDeps extends object = {}> {
  protected deps: TDeps = {} as TDeps;

  protected constructor() {
    const self = createMutable(this);

    onMount(() => self.onMount?.());
    onCleanup(() => self.onDispose?.());

    return self;
  }

  protected onMount?(): void;
  protected onDispose?(): void;
}
