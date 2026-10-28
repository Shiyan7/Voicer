import { FabBounds } from '../types/FabBounds';
import { Point } from '../types/Point';
import { clamp } from './clamp';

export const clampToBounds = (point: Point, bounds: FabBounds): Point => ({
  x: clamp(point.x, bounds.left, bounds.right),
  y: clamp(point.y, bounds.top, bounds.bottom),
});
