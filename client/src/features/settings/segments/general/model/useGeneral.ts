import { i18n, Locale } from '@/shared/i18n';
import { authRoot } from '@/shared/roots/authRoot';
import { themeRoot } from '@/shared/roots/themeRoot';

export const useGeneral = () => {
  const locale = () => i18n.locale();

  const changeLang = (value: string) => {
    i18n.changeLang(value as Locale);
  };

  const theme = () => themeRoot.theme;

  const themes = () => themeRoot.themes;

  const changeTheme = (value: string) => {
    themeRoot.changeTheme(value);
  };

  const logout = () => {
    authRoot.clear();
  };

  return { locale, changeLang, theme, themes, changeTheme, logout };
};
