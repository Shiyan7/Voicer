import {
  EDGE_GAP,
  FAB_SIZE,
  PANEL_GAP,
  PANEL_MAX_HEIGHT,
  PANEL_MAX_WIDTH,
} from '../config/meetingChatConfig';
import { FabBounds } from '../types/FabBounds';
import { PanelPlacement } from '../types/PanelPlacement';
import { Point } from '../types/Point';
import { clamp } from './clamp';

export const getPanelPlacement = (
  fab: Point,
  bounds: FabBounds,
): PanelPlacement => {
  const areaRight = bounds.right + FAB_SIZE;
  const width = Math.min(PANEL_MAX_WIDTH, areaRight - bounds.left);
  const isLeft = fab.x < (bounds.left + bounds.right) / 2;
  const left = isLeft ? fab.x : fab.x + FAB_SIZE - width;

  const spaceAbove = fab.y - PANEL_GAP - EDGE_GAP;
  const spaceBelow = bounds.floor - fab.y - FAB_SIZE - PANEL_GAP;
  const opensUp = spaceAbove >= spaceBelow;
  const height = Math.min(PANEL_MAX_HEIGHT, opensUp ? spaceAbove : spaceBelow);
  const top = opensUp
    ? fab.y - PANEL_GAP - height
    : fab.y + FAB_SIZE + PANEL_GAP;

  return {
    left: clamp(left, bounds.left, areaRight - width),
    top,
    width,
    height,
    origin: `${opensUp ? 'bottom' : 'top'} ${isLeft ? 'left' : 'right'}`,
  };
};
