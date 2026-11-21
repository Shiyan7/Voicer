import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import { tmpdir } from 'os';
import { createInterface } from 'readline';
import { ClaudeAgentRequest } from './claude-agent-request';
import { ClaudeJsonResult, ClaudeStreamLine } from './claude.types';

const DEFAULT_CLAUDE_BIN = 'claude';
const DEFAULT_CLAUDE_MODEL = 'haiku';
const DEFAULT_CLAUDE_CHAT_MODEL = 'sonnet';
const AGENT_MAX_TURNS = '30';
const STREAM_JSON_ARGS = [
  '--output-format',
  'stream-json',
  '--verbose',
  '--include-partial-messages',
];
const TEXT_EFFORT = 'low';
const AGENT_EFFORT = 'medium';
const JSON_SYSTEM_PROMPT = 'Return only data matching the given JSON schema.';
const CLAUDE_TIMEOUT_MS = 180_000;

interface ClaudeRun {
  child: ChildProcessWithoutNullStreams;
  finished: Promise<void>;
}

@Injectable()
export class ClaudeService {
  private readonly bin: string;
  private readonly model: string;
  private readonly chatModel: string;

  constructor(configService: ConfigService) {
    this.bin = configService.get<string>('CLAUDE_BIN') ?? DEFAULT_CLAUDE_BIN;
    this.model =
      configService.get<string>('CLAUDE_MODEL') ?? DEFAULT_CLAUDE_MODEL;
    this.chatModel =
      configService.get<string>('CLAUDE_CHAT_MODEL') ??
      DEFAULT_CLAUDE_CHAT_MODEL;
  }

  async streamText(
    systemInstruction: string,
    prompt: string,
    onText: (text: string) => Promise<void>,
    signal?: AbortSignal,
  ): Promise<string> {
    const { child, finished } = this.run(
      [
        ...this.buildArgs(systemInstruction, this.model, TEXT_EFFORT),
        ...STREAM_JSON_ARGS,
      ],
      CLAUDE_TIMEOUT_MS,
      signal,
    );
    child.stdin.end(prompt);

    const [text] = await Promise.all([
      this.readStream(child.stdout, onText),
      finished,
    ]);
    return text;
  }

  async runAgent(
    request: ClaudeAgentRequest,
    signal?: AbortSignal,
  ): Promise<string> {
    const result = await this.runJson(
      [
        ...this.buildArgs(
          request.systemInstruction,
          this.chatModel,
          AGENT_EFFORT,
        ),
        '--mcp-config',
        JSON.stringify(request.mcpConfig),
        '--allowedTools',
        ...request.allowedTools,
        '--max-turns',
        AGENT_MAX_TURNS,
      ],
      request.prompt,
      request.timeoutMs,
      signal,
    );
    if (result.is_error || !result.result) {
      throw new Error(`Claude agent failed: ${result.result}`);
    }
    return result.result;
  }

  async generateJson<T>(prompt: string, schema: object): Promise<T> {
    const result = await this.runJson(
      [
        ...this.buildArgs(JSON_SYSTEM_PROMPT, this.model, TEXT_EFFORT),
        '--json-schema',
        JSON.stringify(schema),
      ],
      prompt,
      CLAUDE_TIMEOUT_MS,
    );
    if (result.is_error || !result.structured_output) {
      throw new Error(`Claude failed: ${result.result}`);
    }
    return result.structured_output as T;
  }

  private async runJson(
    args: string[],
    prompt: string,
    timeoutMs: number,
    signal?: AbortSignal,
  ): Promise<ClaudeJsonResult> {
    const { child, finished } = this.run(
      [...args, '--output-format', 'json'],
      timeoutMs,
      signal,
    );
    child.stdin.end(prompt);

    const [chunks] = await Promise.all([child.stdout.toArray(), finished]);
    return JSON.parse(
      Buffer.concat(chunks as Buffer[]).toString('utf8'),
    ) as ClaudeJsonResult;
  }

  private run(
    args: string[],
    timeoutMs: number,
    signal?: AbortSignal,
  ): ClaudeRun {
    const timeout = AbortSignal.timeout(timeoutMs);
    const child = spawn(this.bin, args, {
      cwd: tmpdir(),
      signal: signal ? AbortSignal.any([signal, timeout]) : timeout,
    });
    child.stdin.on('error', () => undefined);

    let stderr = '';
    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString('utf8');
    });

    const finished = new Promise<void>((resolve, reject) => {
      child.once('error', reject);
      child.once('close', (code) => {
        if (code === 0) resolve();
        else reject(new Error(`Claude exited with ${code}: ${stderr.trim()}`));
      });
    });
    return { child, finished };
  }

  private buildArgs(
    systemInstruction: string,
    model: string,
    effort: string,
  ): string[] {
    return [
      '-p',
      '--model',
      model,
      '--system-prompt',
      systemInstruction,
      '--tools',
      '',
      '--no-session-persistence',
      '--setting-sources',
      '',
      '--strict-mcp-config',
      '--effort',
      effort,
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
