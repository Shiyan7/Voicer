import { createEffect, createSignal, onCleanup, onMount } from 'solid-js';

import { DRAG_THRESHOLD } from '../config/meetingChatConfig';
import { clampToBounds } from '../lib/clampToBounds';
import { getFabBounds } from '../lib/getFabBounds';
import { DraggableFabParams } from '../types/DraggableFabParams';
import { FabBounds } from '../types/FabBounds';
import { Point } from '../types/Point';

interface DragSession {
  pointer: Point;
  origin: Point;
  moved: boolean;
}

export const useDraggableFab = (params: DraggableFabParams) => {
  const [position, setPosition] = createSignal<Point | null>(null);
  const [bounds, setBounds] = createSignal<FabBounds | null>(null);
  const [isDragging, setIsDragging] = createSignal(false);
  let session: DragSession | null = null;
  let wasDragged = false;

  const measure = () => {
    const boundary = params.boundary();
    if (boundary) setBounds(getFabBounds(boundary, params.obstacle()));
  };

  onMount(() => {
    window.addEventListener('resize', measure);
    onCleanup(() => window.removeEventListener('resize', measure));
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
    const corner = { x: currentBounds.right, y: currentBounds.bottom };
    return clampToBounds(position() ?? corner, currentBounds);
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
    if (!session) return;

    const dx = event.clientX - session.pointer.x;
    const dy = event.clientY - session.pointer.y;
    if (!session.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

    session.moved = true;
    setIsDragging(true);
    setPosition({ x: session.origin.x + dx, y: session.origin.y + dy });
  };

  const onPointerUp = () => {
    wasDragged = Boolean(session?.moved);
    session = null;
    setIsDragging(false);
  };

  const onPointerCancel = () => {
    session = null;
    setIsDragging(false);
  };

  const onClick = () => {
    if (wasDragged) {
      wasDragged = false;
      return;
    }
    params.onTap();
  };

  return {
    point,
    bounds,
    isDragging,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClick,
    },
  };
};
