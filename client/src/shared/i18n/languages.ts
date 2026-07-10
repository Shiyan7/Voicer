import { Locale } from './types';

interface LanguageItem {
  value: Locale;
  label: string;
}

export const languages: LanguageItem[] = [
  {
    value: 'en',
    label: 'EN',
  },
  {
    value: 'ru',
    label: 'RU',
  },
];
