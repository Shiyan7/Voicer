import { Logger } from '@nestjs/common';

const logger = new Logger('FetchRetry');

const MAX_ATTEMPTS = 3;
const BASE_DELAY_MS = 1000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

export async function fetchWithRetry(
  url: string,
  init: RequestInit,
  options?: { retryOnRateLimit?: boolean },
): Promise<Response> {
  let lastError: Error;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) {
      const delay = BASE_DELAY_MS * 2 ** (attempt - 1);
      logger.warn(
        `Retrying ${url} (attempt ${attempt + 1}/${MAX_ATTEMPTS}) in ${delay}ms: ${lastError.message}`,
      );
      await sleep(delay);
    }

    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (e) {
      lastError = e instanceof Error ? e : new Error(String(e));
      continue;
    }

    if (response.ok) {
      return response;
    }

    const body = await response.text().catch(() => '');
    const error = new Error(
      `HTTP ${response.status} from ${url}: ${body.slice(0, 300)}`,
    );

    const retryable =
      isRetryableStatus(response.status) &&
      (response.status !== 429 || options?.retryOnRateLimit !== false);

    if (!retryable) {
      throw error;
    }

    lastError = error;
  }

  throw lastError;
}
