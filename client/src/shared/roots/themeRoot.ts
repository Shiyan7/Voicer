import { makePersisted } from '@solid-primitives/storage';
import { createEffect, createRoot, createSignal } from 'solid-js';

export type Theme = 'system' | 'light' | 'dark';

const themes: Theme[] = ['system', 'light', 'dark'];

const isTheme = (value: string): value is Theme =>
  themes.includes(value as Theme);

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export const themeRoot = createRoot(() => {
  const [theme, setTheme] = makePersisted(createSignal<Theme>('system'), {
    name: 'settings.theme',
    storage: localStorage,
  });

  const [systemDark, setSystemDark] = createSignal(darkQuery.matches);
  darkQuery.addEventListener('change', (event) => setSystemDark(event.matches));

  const resolvedTheme = () => {
    if (theme() === 'system') return systemDark() ? 'dark' : 'light';
    return theme();
  };

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme());
  });

  return {
    themes,
    get theme() {
      return theme();
    },
    changeTheme(value: string) {
      if (isTheme(value)) setTheme(value);
    },
  };
});
