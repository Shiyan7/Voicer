export interface ChatSlotParams {
  meetingId: string;
  obstacle?: HTMLElement;
  onSeek: (ms: number) => void;
}
