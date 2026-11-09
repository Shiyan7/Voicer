import { createMemo, createSignal, mapArray } from 'solid-js';

import { toLiveTurnView } from '../../../lib/toLiveTurnView';
import { LiveSessionDeps } from '../types/LiveSessionDeps';

export function useLiveSession(deps: LiveSessionDeps) {
  const [expanded, setExpanded] = createSignal(new Set<string>());

  const turnViews = mapArray(
    () => deps.turns,
    (turn) => createMemo(() => toLiveTurnView(turn, expanded().has(turn.id))),
  );

  const isEmpty = () => deps.turns.length === 0;

  const toggleDetails = (id: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return { turnViews, isEmpty, toggleDetails };
}
