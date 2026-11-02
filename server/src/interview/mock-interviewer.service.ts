import { Injectable, Logger } from '@nestjs/common';
import { ClaudeService } from '../claude/claude.service';
import { describeError } from '../common/describe-error';
import { GeminiService } from '../gemini/gemini.service';
import { InterviewSessionsService } from './interview-sessions.service';
import { pcmToWav } from './live/pcm-to-wav';
import {
  buildMockInterviewerInstruction,
  buildMockInterviewerPrompt,
  MockInterviewerTurn,
} from './prompts/mock-interviewer.prompt';

const MAX_HISTORY = 20;
const INTERVIEWER_VOICE = 'Charon';
const SPEECH_STYLE = 'Say casually, like a colleague on a call: ';

const ignorePartial = (): Promise<void> => Promise.resolve();

export interface InterviewerLine {
  text: string;
  language: string;
  audio: string | null;
}

@Injectable()
export class MockInterviewerService {
  private readonly logger = new Logger(MockInterviewerService.name);

  constructor(
    private readonly sessions: InterviewSessionsService,
    private readonly claude: ClaudeService,
    private readonly gemini: GeminiService,
  ) {}

  async nextLine(
    userId: string,
    sessionId: string,
    pendingTurn: MockInterviewerTurn | null,
    signal: AbortSignal,
  ): Promise<InterviewerLine> {
    const session = await this.sessions.findOwned(userId, sessionId);
    const saved = await this.sessions.recentTurns(sessionId, MAX_HISTORY);
    const history = pendingTurn ? [...saved, pendingTurn] : saved;
    const context = {
      language: session.language,
      cheatSheet: session.cheatSheet,
      vacancyText: session.vacancyText,
      history,
    };
    const text = await this.claude.streamText(
      buildMockInterviewerInstruction(context),
      buildMockInterviewerPrompt(context),
      ignorePartial,
      signal,
    );
    if (!text.trim()) throw new Error('Empty interviewer line');
    const line = text.trim();
    return {
      text: line,
      language: session.language,
      audio: await this.voice(line, signal),
    };
  }

  private async voice(
    text: string,
    signal: AbortSignal,
  ): Promise<string | null> {
    try {
      const pcm = await this.gemini.synthesizeSpeech(
        `${SPEECH_STYLE}${text}`,
        INTERVIEWER_VOICE,
        signal,
      );
      return pcmToWav(pcm).toString('base64');
    } catch (error) {
      if (!signal.aborted) {
        this.logger.warn(`Speech failed: ${describeError(error)}`);
      }
      return null;
    }
  }

  saveTurn(
    sessionId: string,
    question: string,
    answer: string,
    answerDurationMs: number,
  ): Promise<void> {
    return this.sessions.addTurn(sessionId, question, answer, answerDurationMs);
  }
}
