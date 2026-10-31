import { makePersisted } from '@solid-primitives/storage';
import { createEffect, createRoot, createSignal } from 'solid-js';

type Theme = 'system' | 'light' | 'dark';

const themes: Theme[] = ['system', 'light', 'dark'];

const isTheme = (value: string): value is Theme =>
  themes.includes(value as Theme);

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

export const themeRoot = createRoot(() => {
  const [theme, setTheme] = makePersisted(createSignal<Theme>('system'), {
    name: 'settings.theme',
    storage: localStorage,
    serialize: (value: Theme) => JSON.stringify(value),
    deserialize: (raw) => JSON.parse(raw) as Theme,
  });

  const [systemDark, setSystemDark] = createSignal(darkQuery.matches);
  darkQuery.addEventListener('change', (event) => setSystemDark(event.matches));

  const resolvedTheme = (): 'light' | 'dark' => {
    const current = theme();
    if (current === 'system') return systemDark() ? 'dark' : 'light';
    return current;
  };

  createEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme());
  });

  return {
    themes,
    get theme() {
      return theme();
    },
    get resolvedTheme() {
      return resolvedTheme();
    },
    changeTheme(value: string) {
      if (isTheme(value)) setTheme(value);
    },
  };
});
