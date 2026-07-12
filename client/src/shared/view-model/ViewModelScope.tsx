import { onCleanup, ParentProps } from 'solid-js';

import { container } from '@/shared/di';

import { DIContext } from './DIContext';

export function ViewModelScope(props: ParentProps) {
  const scope = container.createChildContainer();

  onCleanup(() => scope.dispose());

  return <DIContext.Provider value={scope}>{props.children}</DIContext.Provider>;
}
