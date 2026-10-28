import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import {
  DEFAULT_FAB_POSITION,
  DRAG_THRESHOLD,
} from '../config/meetingChatConfig';
import { clampToBounds, toFabPoint, toFabPosition } from '../lib/fabPosition';
import { loadFabPosition, saveFabPosition } from '../lib/fabPositionStorage';
import { getFabBounds } from '../lib/getFabBounds';
import { DraggableFabParams } from '../types/DraggableFabParams';
import { FabBounds } from '../types/FabBounds';
import { FabPosition } from '../types/FabPosition';
import { Point } from '../types/Point';

interface DragSession {
  pointer: Point;
  origin: Point;
  moved: boolean;
}

export const useDraggableFab = (params: DraggableFabParams) => {
  const [position, setPosition] =
    createSignal<FabPosition>(DEFAULT_FAB_POSITION);
  const [bounds, setBounds] = createSignal<FabBounds | null>(null);
  const [dragPoint, setDragPoint] = createSignal<Point | null>(null);
  let session: DragSession | null = null;

  const measure = () => {
    const boundary = params.boundary();
    if (boundary) setBounds(getFabBounds(boundary, params.obstacle()));
  };

  onMount(() => {
    void loadFabPosition().then(setPosition);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    onCleanup(() => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    });
  });

  createEffect(() => {
    const observed = [params.boundary(), params.obstacle()].filter(
      (element): element is HTMLElement => Boolean(element),
    );
    if (!observed.length) return;

    const observer = new ResizeObserver(measure);
    observed.forEach((element) => observer.observe(element));
    onCleanup(() => observer.disconnect());
  });

  const point = (): Point | null => {
    const currentBounds = bounds();
    if (!currentBounds) return null;
    return dragPoint() ?? toFabPoint(position(), currentBounds);
  };

  const onPointerDown = (event: PointerEvent) => {
    const origin = point();
    if (event.button !== 0 || !origin) return;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    session = {
      pointer: { x: event.clientX, y: event.clientY },
      origin,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent) => {
    const currentBounds = bounds();
    if (!session || !currentBounds) return;

    const dx = event.clientX - session.pointer.x;
    const dy = event.clientY - session.pointer.y;
    if (!session.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    session.moved = true;
    setDragPoint(
      clampToBounds(
        { x: session.origin.x + dx, y: session.origin.y + dy },
        currentBounds,
      ),
    );
  };

  const settle = (dropped: Point, currentBounds: FabBounds) => {
    const next = toFabPosition(dropped, currentBounds);
    setPosition(next);
    setDragPoint(null);
    void saveFabPosition(next);
  };

  const onPointerUp = () => {
    const finished = session;
    session = null;
    if (!finished) return;

    const dropped = dragPoint();
    const currentBounds = bounds();
    if (!finished.moved || !dropped || !currentBounds) {
      params.onTap();
      return;
    }
    settle(dropped, currentBounds);
  };

  const onKeyboardClick = (event: MouseEvent) => {
    if (event.detail === 0) params.onTap();
  };

  return {
    point,
    bounds,
    isDragging: () => dragPoint() !== null,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onClick: onKeyboardClick,
    },
  };
};
