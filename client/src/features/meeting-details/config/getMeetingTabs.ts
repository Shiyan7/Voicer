import { i18n } from '@/shared/i18n';
import { Tab } from '@/shared/ui/tabs';

import { MeetingTab } from '../types/MeetingTab';
import { MEETING_TAB_LABELS } from './MEETING_TAB_LABELS';

export const getMeetingTabs = (): Tab<MeetingTab>[] =>
  (Object.keys(MEETING_TAB_LABELS) as MeetingTab[]).map((value) => ({
    label: i18n.t(MEETING_TAB_LABELS[value]),
    value,
  }));
