import { createHmac, timingSafeEqual } from 'crypto';

const SIGNATURE_WINDOW_SEC = 24 * 60 * 60;

const sign = (secret: string, path: string, expires: string): string =>
  createHmac('sha256', secret).update(`${path}:${expires}`).digest('base64url');

export function signFileUrl(secret: string, fileUrl: string): string {
  const url = new URL(fileUrl);
  const nowSec = Math.floor(Date.now() / 1000);
  const windowEnd =
    (Math.floor(nowSec / SIGNATURE_WINDOW_SEC) + 2) * SIGNATURE_WINDOW_SEC;
  const expires = String(windowEnd);
  url.searchParams.set('expires', expires);
  url.searchParams.set('sig', sign(secret, url.pathname, expires));
  return url.toString();
}

export function isFileSignatureValid(
  secret: string,
  path: string,
  expires: string,
  signature: string,
): boolean {
  if (Number(expires) * 1000 <= Date.now()) return false;
  const expected = Buffer.from(sign(secret, path, expires));
  const actual = Buffer.from(signature);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
