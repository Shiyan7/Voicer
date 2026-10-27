import { i18n } from '@/shared/i18n';

import { getSummaryStyleOption } from '../lib/getSummaryStyleOption';
import { SummaryStyleBadgeProps } from '../types/SummaryStyleBadgeProps';
import { summaryStyleBadgeStyles } from './SummaryStyleBadge.styles';

export function SummaryStyleBadge(props: SummaryStyleBadgeProps) {
  const option = () => getSummaryStyleOption(props.style);

  return (
    <span class={summaryStyleBadgeStyles()}>
      {i18n.t('meetings.summary_style_badge', {
        style: `${option()?.emoji} ${option()?.label}`,
      })}
    </span>
  );
}
