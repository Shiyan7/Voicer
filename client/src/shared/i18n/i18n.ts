import * as i18nLib from '@solid-primitives/i18n';
import { makePersisted } from '@solid-primitives/storage';
import { isTauri } from '@tauri-apps/api/core';
import { locale as getOsLocale } from '@tauri-apps/plugin-os';
import {
  createEffect,
  createResource,
  createRoot,
  createSignal,
} from 'solid-js';

import type { Dictionary, Locale, RawDictionary } from './types';

const [persistedLocale, setPersistedLocale] = makePersisted(
  createSignal<string>(),
  {
    name: 'i18n.locale',
    storage: localStorage,
  },
);

export const i18n = createRoot(() => {
  const [locale, setLocale] = createSignal<Locale>('en');
  const [ready, setReady] = createSignal(false);

  const fetchDictionary = async (locale: Locale): Promise<Dictionary> => {
    const dict: RawDictionary = await import(`./locales/${locale}.json`);
    return i18nLib.flatten(dict);
  };

  const [dict] = createResource(locale, fetchDictionary);

  const t = i18nLib.translator(dict, i18nLib.resolveTemplate);

  const init = async () => {
    let osLocale: string | null = 'en';

    if (isTauri()) {
      osLocale = await getOsLocale();
    }

    const initial = persistedLocale() ?? osLocale?.split('-')[0] ?? 'en';

    setLocale(initial as Locale);
    setPersistedLocale(initial);
    setReady(true);
  };

  const changeLang = (next: Locale) => {
    setPersistedLocale(next);
    setLocale(next);
  };

  createEffect(() => {
    document.documentElement.lang = locale();
  });

  return {
    locale,
    ready,
    t,
    init,
    changeLang,
  };
});
