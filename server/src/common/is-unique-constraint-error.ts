const UNIQUE_VIOLATION_CODE = '23505';

export const isUniqueConstraintError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  return (error as { code?: string }).code === UNIQUE_VIOLATION_CODE;
};
