import * as i18n from '@solid-primitives/i18n';

import type * as en from './locales/en.json';

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

export type Locale = 'en' | 'ru';
export type RawDictionary = typeof en;
export type Dictionary = i18n.Flatten<RawDictionary>;
export type DictKey = StringKeys<Dictionary>;
