import { i18n } from '@/shared/i18n';
import { sumBy } from '@/shared/lib/sumBy';
import { formatDuration } from '@/shared/lib/time';

import { pluralize } from '../../../lib/pluralize';
import { MAX_SOURCES } from '../config/MAX_SOURCES';
import { SourceRow } from '../types/SourceRow';
import { SourcesDeps } from '../types/SourcesDeps';

export const useSources = (deps: SourcesDeps) => {
  const groups = () => {
    const top = deps.sources.slice(0, MAX_SOURCES);
    const rest = deps.sources.slice(MAX_SOURCES);
    if (!rest.length) return top;

    return [
      ...top,
      {
        source: i18n.t('stats.sources.rest', { count: String(rest.length) }),
        count: sumBy(rest, (source) => source.count),
        durationSec: sumBy(rest, (source) => source.durationSec),
      },
    ];
  };

  const rows = (): SourceRow[] => {
    const max = Math.max(1, ...groups().map((source) => source.durationSec));

    return groups().map((source) => ({
      label: source.source ?? i18n.t('stats.sources.other'),
      calls: pluralize('stats.calls', source.count),
      duration: formatDuration(source.durationSec),
      share: `${Math.max(2, (source.durationSec / max) * 100)}%`,
    }));
  };

  const isEmpty = () => !deps.sources.length;

  return { rows, isEmpty };
};
