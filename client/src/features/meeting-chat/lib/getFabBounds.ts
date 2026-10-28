import { EDGE_GAP, FAB_SIZE } from '../config/meetingChatConfig';
import { FabBounds } from '../types/FabBounds';

const getFloor = (obstacle?: HTMLElement) =>
  (obstacle?.getBoundingClientRect().top ?? window.innerHeight) - EDGE_GAP;

export const getFabBounds = (
  boundary: HTMLElement,
  obstacle?: HTMLElement,
): FabBounds => {
  const rect = boundary.getBoundingClientRect();
  const floor = getFloor(obstacle);

  return {
    left: rect.left + EDGE_GAP,
    right: rect.right - EDGE_GAP - FAB_SIZE,
    top: EDGE_GAP,
    bottom: floor - FAB_SIZE,
    floor,
  };
};
