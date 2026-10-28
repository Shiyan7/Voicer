import { FabBounds } from '../types/FabBounds';
import { FabPosition } from '../types/FabPosition';
import { Point } from '../types/Point';
import { clamp } from './clamp';

export const toFabPoint = (
  position: FabPosition,
  bounds: FabBounds,
): Point => ({
  x: position.side === 'left' ? bounds.left : bounds.right,
  y: bounds.top + position.ratio * Math.max(0, bounds.bottom - bounds.top),
});

export const toFabPosition = (point: Point, bounds: FabBounds): FabPosition => {
  const middle = (bounds.left + bounds.right) / 2;
  const height = bounds.bottom - bounds.top;

  return {
    side: point.x < middle ? 'left' : 'right',
    ratio: height > 0 ? clamp((point.y - bounds.top) / height, 0, 1) : 0,
  };
};

export const clampToBounds = (point: Point, bounds: FabBounds): Point => ({
  x: clamp(point.x, bounds.left, bounds.right),
  y: clamp(point.y, bounds.top, bounds.bottom),
});
