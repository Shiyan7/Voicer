import { i18n } from '@/shared/i18n';

import { formatCalls } from '../../../lib/formatCalls';
import { formatDuration } from '../../../lib/formatDuration';
import { MAX_SOURCES } from '../config/MAX_SOURCES';
import { SourceRow } from '../types/SourceRow';
import { SourcesProps } from '../types/SourcesProps';

export const useSources = (props: SourcesProps) => {
  const rows = (): SourceRow[] => {
    const top = props.sources.slice(0, MAX_SOURCES);
    const max = Math.max(1, ...top.map((source) => source.durationSec));

    return top.map((source) => ({
      label: source.source ?? i18n.t('stats.sources.other'),
      calls: formatCalls(source.count),
      duration: formatDuration(source.durationSec),
      share: `${Math.max(2, (source.durationSec / max) * 100)}%`,
    }));
  };

  const isEmpty = () => !props.sources.length;

  return { rows, isEmpty };
};
