import { Accessor, createSignal, onCleanup } from 'solid-js';

import { i18n } from '@/shared/i18n';

type TooltipState = 'copy' | 'copied';

export const getTooltipTexts = () => ({
  copy: i18n.t('labels.copy'),
  copied: i18n.t('labels.copied'),
});

export const useCopyButton = (getValue: Accessor<string>) => {
  const [tooltipState, setTooltipState] = createSignal<TooltipState>('copy');

  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const clearTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  const isCopied = () => tooltipState() === 'copied';

  const onCopyButtonEnter = () => {
    clearTimer();
    setTooltipState('copy');
  };

  const onCopyButtonLeave = () => {
    if (isCopied()) {
      clearTimer();
      timeoutId = setTimeout(() => {
        setTooltipState('copy');
        timeoutId = null;
      }, 1000);
    }
  };

  const tooltipText = () => getTooltipTexts()[tooltipState()];

  const onCopyButtonClick = async (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      await window.navigator.clipboard.writeText(getValue());
      clearTimer();
      setTooltipState('copied');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  onCleanup(() => {
    clearTimer();
  });

  return {
    onCopyButtonEnter,
    onCopyButtonLeave,
    onCopyButtonClick,
    tooltipText,
    isCopied,
  };
}
