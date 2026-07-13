import { createRenderEffect, useContext } from 'solid-js';

import { DIContext } from './DIContext';
import type { StatefulViewModel } from './StatefulViewModel';

type DepsOf<T> = T extends StatefulViewModel<infer TDeps> ? TDeps : {};

type DepsArgs<T> = keyof DepsOf<T> extends never ? [] : [deps: () => DepsOf<T>];

export function useViewModel<T>(
  ViewModel: new (...args: any[]) => T,
  ...[deps]: DepsArgs<T>
): T {
  const container = useContext(DIContext);

  let vm: T;

  try {
    vm = container.resolve(ViewModel);
  } catch {
    vm = new ViewModel();
  }

  if (deps) {
    const { deps: target } = vm as { deps: DepsOf<T> };
    createRenderEffect(() => Object.assign(target, deps()));
  }

  return vm;
}
