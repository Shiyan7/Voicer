import { useCopyToClipboard } from '@/shared/hooks/useCopyToClipboard';
import { i18n } from '@/shared/i18n';

import { highlightCode } from '../lib/highlightCode';
import { CodeBlockProps } from '../types/CodeBlockProps';

export function useCodeBlock(props: CodeBlockProps) {
  const clipboard = useCopyToClipboard();

  const tokens = () => highlightCode(props.code);

  const copyLabel = () =>
    clipboard.isCopied() ? i18n.t('common.copied') : i18n.t('common.copy');

  const isCopied = clipboard.isCopied;

  const copy = () => clipboard.copy(props.code);

  return { tokens, copyLabel, isCopied, copy };
}
