export interface MeetingChatDeps {
  meetingId: string;
  obstacle?: HTMLElement;
  onSeek: (ms: number) => void;
}
