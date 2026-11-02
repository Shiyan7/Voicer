const REQUIRED_ENV = [
  'DATABASE_URL',
  'JWT_ACCESS_SECRET',
  'SERVER_URL',
  'PORT',
  'DEEPGRAM_API_KEY',
  'GEMINI_API_KEY',
];

export function validateEnv(
  env: Record<string, unknown>,
): Record<string, unknown> {
  const missing = REQUIRED_ENV.filter((name) => !env[name]);
  if (missing.length) {
    throw new Error(`Missing env variables: ${missing.join(', ')}`);
  }
  return env;
}
