import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { createInterface } from 'readline';
import { LlmTurn } from '../llm/llm-turn';
import { ClaudeStreamLine } from './claude.types';

const DEFAULT_CLAUDE_MODEL = 'haiku';

@Injectable()
export class ClaudeService {
  private readonly model: string;

  constructor(configService: ConfigService) {
    this.model =
      configService.get<string>('CLAUDE_MODEL') ?? DEFAULT_CLAUDE_MODEL;
  }

  async streamText(
    systemInstruction: string,
    turns: LlmTurn[],
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string> {
    const child = spawn('claude', this.buildArgs(systemInstruction), {
      cwd: tmpdir(),
      stdio: ['pipe', 'pipe', 'ignore'],
      signal,
    });
    const failure = new Promise<never>((_, reject) => {
      child.once('error', reject);
    });
    child.stdin.end(turns.map((turn) => turn.text).join('\n\n'));

    const read = this.readStream(child.stdout, onText);
    return Promise.race([read, failure]);
  }

  private buildArgs(systemInstruction: string): string[] {
    return [
      '-p',
      '--model',
      this.model,
      '--system-prompt',
      systemInstruction,
      '--tools',
      '',
      '--no-session-persistence',
      '--setting-sources',
      '',
      '--strict-mcp-config',
      '--effort',
      'low',
      '--output-format',
      'stream-json',
      '--verbose',
      '--include-partial-messages',
    ];
  }

  private async readStream(
    stdout: NodeJS.ReadableStream,
    onText: (text: string) => Promise<void>,
  ): Promise<string> {
    let text = '';

    for await (const raw of createInterface({ input: stdout })) {
      const line = JSON.parse(raw) as ClaudeStreamLine;
      if (line.type === 'result' && line.is_error) {
        throw new Error(`Claude failed: ${line.result}`);
      }
      const delta = this.parseDelta(line);
      if (!delta) continue;
      text += delta;
      await onText(text);
    }

    return text;
  }

  private parseDelta(line: ClaudeStreamLine): string {
    if (line.type !== 'stream_event') return '';
    if (line.event?.type !== 'content_block_delta') return '';
    return line.event.delta?.text ?? '';
  }
}
