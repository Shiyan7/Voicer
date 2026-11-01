import { createSignal, onCleanup } from 'solid-js';

const COPIED_RESET_MS = 1500;

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = createSignal(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const copy = async (text: string) => {
    const isWritten = await navigator.clipboard
      .writeText(text)
      .then(() => true)
      .catch(() => false);
    if (!isWritten) return;
    setIsCopied(true);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);
  };

  onCleanup(() => clearTimeout(resetTimer));

  return { isCopied, copy };
}
