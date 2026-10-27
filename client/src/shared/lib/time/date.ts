import 'dayjs/locale/ru';

import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';

import { i18n } from '@/shared/i18n';

dayjs.extend(isoWeek);
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export type DateInput = dayjs.ConfigType;

export const date = (value?: DateInput) => dayjs(value).locale(i18n.locale());

export const formatShortDateTime = (value: DateInput) =>
  date(value).format('L, LT');

export const formatTime = (value: DateInput) => date(value).format('LT');

export const formatRelativeTime = (value: DateInput) => date(value).fromNow();

export const formatDayDate = (value: DateInput, withYear = false) =>
  date(value).format(withYear ? 'D MMMM YYYY' : 'D MMMM');

export const toDateKey = (value?: DateInput) =>
  date(value).format('YYYY-MM-DD');
