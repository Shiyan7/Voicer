import { i18n, Locale } from '@/shared/i18n';
import { authRoot } from '@/shared/roots/authRoot';

export const useGeneral = () => {
  const locale = () => i18n.locale();

  const changeLang = (value: string) => {
    i18n.changeLang(value as Locale);
  };

  const logout = () => {
    authRoot.clear();
  };

  return { locale, changeLang, logout };
}
