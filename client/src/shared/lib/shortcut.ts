function toCode(key: string): string {
  if (/^[a-z]$/i.test(key)) return `Key${key.toUpperCase()}`;
  if (/^[0-9]$/.test(key)) return `Digit${key}`;
  return key;
}

function createShortcutFactory() {
  const keyMap = new Map<string, () => void>();

  window.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const handler = keyMap.get(event.code);
    if (handler) handler();
  });

  return {
    on(key: string, callback: () => void) {
      keyMap.set(toCode(key), callback);
    },
    remove(key: string) {
      keyMap.delete(toCode(key));
    },
  };
}

export const shortcut = createShortcutFactory();
