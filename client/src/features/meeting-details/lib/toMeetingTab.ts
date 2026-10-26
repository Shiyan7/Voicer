import { MeetingTab } from '../types/MeetingTab';

const MEETING_TABS: MeetingTab[] = ['recording', 'notes'];

export const toMeetingTab = (value?: string): MeetingTab =>
  MEETING_TABS.find((tab) => tab === value) ?? 'recording';
