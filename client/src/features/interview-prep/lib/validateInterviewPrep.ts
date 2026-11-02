import type { FormErrors } from '@modular-forms/solid';
import * as v from 'valibot';

import {
  createInterviewPrepSchema,
  InterviewPrepForm,
} from '../config/createInterviewPrepSchema';

export const validateInterviewPrep = (values: Partial<InterviewPrepForm>) => {
  const result = v.safeParse(createInterviewPrepSchema(), values);
  const errors: Record<string, string> = {};
  for (const issue of result.issues ?? []) {
    const path = v.getDotPath(issue);
    if (path) errors[path] ??= issue.message;
  }
  return errors as FormErrors<InterviewPrepForm>;
};
