import { createMemo, createSignal, mapArray } from 'solid-js';

import { GallerySlide, openGallery } from '@/shared/lib/gallery';

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

  const imageTurns = () => deps.turns.filter((turn) => turn.imageUrl);

  const openImage = (id: string) => {
    const turns = imageTurns();
    const slides: GallerySlide[] = turns.map((turn) => ({
      src: turn.imageUrl ?? '',
      caption: turn.question,
    }));
    openGallery(
      slides,
      turns.findIndex((turn) => turn.id === id),
    );
  };

  return {
    turnViews,
    isEmpty,
    toggleDetails,
    openImage,
  };
}
