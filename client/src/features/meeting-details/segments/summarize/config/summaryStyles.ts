import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { SummaryStyle } from '../types/SummaryStyle';

export const getSummaryStyles = (): DropdownOption<SummaryStyle>[] => [
  {
    value: 'auto',
    emoji: '✨',
    label: i18n.t('meetings.summary_styles.auto'),
  },
  {
    value: 'concise',
    emoji: '📝',
    label: i18n.t('meetings.summary_styles.concise'),
  },
  {
    value: 'detailed',
    emoji: '📋',
    label: i18n.t('meetings.summary_styles.detailed'),
  },
  {
    value: 'bullets',
    emoji: '🔹',
    label: i18n.t('meetings.summary_styles.bullets'),
  },
  {
    value: 'formal',
    emoji: '💼',
    label: i18n.t('meetings.summary_styles.formal'),
  },
  {
    value: 'casual',
    emoji: '😊',
    label: i18n.t('meetings.summary_styles.casual'),
  },
  {
    value: 'action_items',
    emoji: '✅',
    label: i18n.t('meetings.summary_styles.action_items'),
  },
];
