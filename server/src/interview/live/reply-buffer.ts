import { MAX_REPLY_LENGTH, REPLY_GAP_MS } from './live-audio.config';
import { joinText } from './join-text';

export class ReplyBuffer {
  private text = '';
  private updatedAt = 0;

  append(text: string): string {
    const isExpired = Date.now() - this.updatedAt > REPLY_GAP_MS;
    return this.store(joinText(isExpired ? '' : this.text, text));
  }

  restore(text: string): void {
    this.store(joinText(text, this.text));
  }

  clear(): void {
    this.text = '';
  }

  private store(text: string): string {
    this.text = text.slice(-MAX_REPLY_LENGTH);
    this.updatedAt = Date.now();
    return this.text;
  }
}
