import { ActionItemDeps } from '../types/ActionItemDeps';

export function useActionItem(props: ActionItemDeps) {
  const item = () => props.item;

  const toggle = () => {};

  return { item, toggle };
}
