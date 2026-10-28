export interface MeetingChatProps {
  meetingId: string;
  obstacle?: HTMLElement;
  onSeek: (ms: number) => void;
}
