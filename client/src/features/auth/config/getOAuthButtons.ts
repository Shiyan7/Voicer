import { IconName } from '@/shared/ui/icon';

interface OAuthButton {
  icon: IconName;
  label: string;
}

export const getOAuthButtons = (): OAuthButton[] => [
  { icon: 'social:google', label: 'Google' },
  { icon: 'social:apple', label: 'Apple' },
  { icon: 'social:telegram', label: 'Telegram' },
];
