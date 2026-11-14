import { copyWithSelection } from './copyWithSelection';

export async function writeClipboard(text: string): Promise<boolean> {
  if (copyWithSelection(text)) return true;

  return navigator.clipboard
    .writeText(text)
    .then(() => true)
    .catch(() => false);
}
