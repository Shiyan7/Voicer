import type { IconName } from '@/shared/ui/icon';

export interface DropdownOption<T> {
  value: T;
  label: string;
  icon?: IconName;
  emoji?: string;
}
