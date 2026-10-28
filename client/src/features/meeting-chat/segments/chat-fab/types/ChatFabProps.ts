import { JSX } from 'solid-js';

import { Point } from '../../../types/Point';

type Handler<E extends Event> = JSX.EventHandler<HTMLButtonElement, E>;

export interface ChatFabHandlers {
  onPointerDown: Handler<PointerEvent>;
  onPointerMove: Handler<PointerEvent>;
  onPointerUp: Handler<PointerEvent>;
  onPointerCancel: Handler<PointerEvent>;
  onClick: Handler<MouseEvent>;
}

export interface ChatFabProps extends ChatFabHandlers {
  point: Point;
  isOpen: boolean;
  isDragging: boolean;
  showBadge: boolean;
}
