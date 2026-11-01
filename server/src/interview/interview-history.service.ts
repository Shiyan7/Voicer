import { Injectable } from '@nestjs/common';

const MAX_HISTORY_LINES = 20;

@Injectable()
export class InterviewHistoryService {
  private readonly histories = new Map<string, string[]>();

  get(sessionId: string): string[] {
    return this.histories.get(sessionId) ?? [];
  }

  append(sessionId: string, line: string): void {
    const next = [...this.get(sessionId), line].slice(-MAX_HISTORY_LINES);
    this.histories.set(sessionId, next);
  }

  clear(sessionId: string): void {
    this.histories.delete(sessionId);
  }
}
