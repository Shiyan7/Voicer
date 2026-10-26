export interface PlayerTimelineProps {
  currentLabel: string;
  durationLabel: string;
  progressPercent: string;
  setTrackRef: (element: HTMLDivElement) => void;
  onPointerDown: (event: PointerEvent) => void;
  onPointerMove: (event: PointerEvent) => void;
  onPointerUp: () => void;
}
