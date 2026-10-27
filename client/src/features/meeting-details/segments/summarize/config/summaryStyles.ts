import { SummaryStyle } from '@schema';

import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getSummaryStyles = (): DropdownOption<SummaryStyle>[] => [
  {
    value: SummaryStyle.Auto,
    emoji: '✨',
    label: i18n.t('meetings.summary_styles.auto'),
  },
  {
    value: SummaryStyle.Concise,
    emoji: '📝',
    label: i18n.t('meetings.summary_styles.concise'),
  },
  {
    value: SummaryStyle.Detailed,
    emoji: '📋',
    label: i18n.t('meetings.summary_styles.detailed'),
  },
  {
    value: SummaryStyle.Bullets,
    emoji: '🔹',
    label: i18n.t('meetings.summary_styles.bullets'),
  },
  {
    value: SummaryStyle.Casual,
    emoji: '😊',
    label: i18n.t('meetings.summary_styles.casual'),
  },
  {
    value: SummaryStyle.Work,
    emoji: '🗂️',
    label: i18n.t('meetings.summary_styles.work'),
  },
  {
    value: SummaryStyle.Interview,
    emoji: '🎯',
    label: i18n.t('meetings.summary_styles.interview'),
  },
  {
    value: SummaryStyle.Advice,
    emoji: '🧭',
    label: i18n.t('meetings.summary_styles.advice'),
  },
];
