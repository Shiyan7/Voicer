import type { ApiTokenOutput } from '@schema';

import { i18n } from '@/shared/i18n';
import { formatRelativeTime, formatShortDateTime } from '@/shared/lib/time';

import { ApiTokenView } from '../types/ApiTokenView';

const toHint = (apiToken: ApiTokenOutput) => {
  const created = i18n.t('settings.mcp.created', {
    date: formatShortDateTime(apiToken.createdAt),
  });

  if (!apiToken.lastUsedAt) return created;

  const used = i18n.t('settings.mcp.last_used', {
    date: formatRelativeTime(apiToken.lastUsedAt),
  });

  return `${created} · ${used}`;
};

export const toApiTokenView = (apiToken: ApiTokenOutput): ApiTokenView => ({
  id: apiToken.id,
  name: apiToken.name,
  hint: toHint(apiToken),
});
