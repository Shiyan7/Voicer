import { MEETING_TAB_LABELS } from '../config/MEETING_TAB_LABELS';
import { MeetingTab } from '../types/MeetingTab';

const isMeetingTab = (value?: string): value is MeetingTab =>
  !!value && value in MEETING_TAB_LABELS;

export const toMeetingTab = (value?: string): MeetingTab =>
  isMeetingTab(value) ? value : 'recording';
