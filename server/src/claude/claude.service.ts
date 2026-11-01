import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { spawn } from 'child_process';
import { tmpdir } from 'os';
import { createInterface } from 'readline';
import { LlmTurn } from '../llm/llm-turn';
import { ClaudeJsonResult, ClaudeStreamLine } from './claude.types';

const DEFAULT_CLAUDE_MODEL = 'haiku';
const JSON_SYSTEM_PROMPT = 'Верни только данные по заданной JSON-схеме.';

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
    const child = this.run(
      [
        ...this.buildArgs(systemInstruction),
        '--output-format',
        'stream-json',
        '--verbose',
        '--include-partial-messages',
      ],
      signal,
    );
    const failure = new Promise<never>((_, reject) => {
      child.once('error', reject);
    });
    child.stdin.end(turns.map((turn) => turn.text).join('\n\n'));

    const read = this.readStream(child.stdout, onText);
    return Promise.race([read, failure]);
  }

  async generateJson<T>(prompt: string, schema: object): Promise<T> {
    const child = this.run([
      ...this.buildArgs(JSON_SYSTEM_PROMPT),
      '--output-format',
      'json',
      '--json-schema',
      JSON.stringify(schema),
    ]);
    const failure = new Promise<never>((_, reject) => {
      child.once('error', reject);
    });
    child.stdin.end(prompt);

    const output = Promise.resolve(child.stdout.toArray());
    const chunks = await Promise.race([output, failure]);
    const result = JSON.parse(
      Buffer.concat(chunks as Buffer[]).toString('utf8'),
    ) as ClaudeJsonResult;
    if (result.is_error || !result.structured_output) {
      throw new Error(`Claude failed: ${result.result}`);
    }
    return result.structured_output as T;
  }

  private run(args: string[], signal?: AbortSignal) {
    return spawn('claude', args, {
      cwd: tmpdir(),
      stdio: ['pipe', 'pipe', 'ignore'],
      signal,
    });
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
