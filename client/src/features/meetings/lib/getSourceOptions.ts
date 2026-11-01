import { ALL_FILTER_VALUE } from '@/shared/hooks/config/ALL_FILTER_VALUE';
import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const getSourceOptions = (
  sources: string[],
): DropdownOption<string>[] => [
  { value: ALL_FILTER_VALUE, label: i18n.t('meetings.filter.all') },
  ...sources.map((source) => ({ value: source, label: source })),
];
