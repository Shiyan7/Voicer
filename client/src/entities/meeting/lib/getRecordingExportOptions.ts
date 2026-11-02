import { i18n } from '@/shared/i18n';
import { DropdownOption } from '@/shared/ui/dropdown';

import { RecordingExportAction } from '../types/RecordingExportAction';

export const getShowInFinderOption =
  (): DropdownOption<RecordingExportAction> => ({
    value: 'show-in-finder',
    label: i18n.t('meetings.show_in_finder'),
    icon: 'common:folder',
  });

export const getExportTextOption =
  (): DropdownOption<RecordingExportAction> => ({
    value: 'export-text',
    label: i18n.t('meetings.export_text'),
    icon: 'common:document-text',
  });
