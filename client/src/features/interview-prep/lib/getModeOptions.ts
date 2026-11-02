import { InterviewMode } from '@schema';

import { i18n } from '@/shared/i18n';

import { PrepModeOption } from '../types/PrepModeOption';

export const getModeOptions = (): PrepModeOption[] => [
  {
    value: InterviewMode.Mock,
    icon: 'common:chat',
    title: i18n.t('live.prep.modes.mock.title'),
    description: i18n.t('live.prep.modes.mock.description'),
  },
  {
    value: InterviewMode.Real,
    icon: 'common:microphone',
    title: i18n.t('live.prep.modes.real.title'),
    description: i18n.t('live.prep.modes.real.description'),
  },
];
