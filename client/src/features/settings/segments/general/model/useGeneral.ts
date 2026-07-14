import { i18n, Locale } from '@/shared/i18n';

export function useGeneral() {
  const locale = () => i18n.locale();

  const changeLang = (value: string) => {
    i18n.changeLang(value as Locale);
  };

  const logout = () => {};

  return { locale, changeLang, logout };
}
