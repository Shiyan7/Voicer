import { IconName } from '@/shared/ui/icon';

import { EmptyStateIllustration } from './EmptyStateIllustration';
import { EmptyStateTone } from './EmptyStateTone';

export interface EmptyStateProps {
  tone: EmptyStateTone;
  illustration: EmptyStateIllustration;
  icon: IconName;
  title: string;
  description: string;
  hint?: string;
}
