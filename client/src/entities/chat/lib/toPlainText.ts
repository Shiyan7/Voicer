import { BOLD_MARKER, CITATION } from '../config/chatConfig';

export const toPlainText = (content: string) =>
  content.replace(CITATION, '').replace(BOLD_MARKER, '').trim();
