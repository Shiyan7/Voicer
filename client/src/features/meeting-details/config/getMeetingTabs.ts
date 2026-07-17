import { i18n } from '@/shared/i18n';
import { Tab } from '@/shared/ui/tabs';

import { MeetingTab } from '../types/MeetingTab';

export const getMeetingTabs: Tab<MeetingTab>[] = [
  { label: i18n.t('meetings.notes'), value: 'notes' },
  { label: i18n.t('meetings.recording_transcript'), value: 'recording' },
];
