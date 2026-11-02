import type { InterviewMode } from '@schema';

import type { IconName } from '@/shared/ui/icon';

export interface PrepModeOption {
  value: InterviewMode;
  icon: IconName;
  title: string;
  description: string;
}
