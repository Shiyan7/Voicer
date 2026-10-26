import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

export const ALL_SOURCES = '';

export const getSourceOptions = (
  sources: string[],
): DropdownOption<string>[] => [
  { value: ALL_SOURCES, label: i18n.t('meetings.filter.all') },
  ...sources.map((source) => ({ value: source, label: source })),
];
