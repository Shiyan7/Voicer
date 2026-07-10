import { createServerCookie } from '@solid-primitives/cookies';
import * as i18nLib from '@solid-primitives/i18n';
import { locale as getOsLocale } from '@tauri-apps/plugin-os';
import {
  createEffect,
  createResource,
  createRoot,
  createSignal,
} from 'solid-js';

import { isTauri } from '@/shared/isTauri';

import type { Dictionary, Locale, RawDictionary } from './types';

const [cookieLocale, setCookieLocale] = createServerCookie('locale');

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

    const initial = cookieLocale() ?? osLocale?.split('-')[0] ?? 'en';

    setLocale(initial as Locale);
    setCookieLocale(initial);
    setReady(true);
  };

  const changeLang = (next: Locale) => {
    setCookieLocale(next);
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
