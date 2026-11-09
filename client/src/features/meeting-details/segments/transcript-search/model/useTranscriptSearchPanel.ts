import { createSignal } from 'solid-js';

import { i18n } from '@/shared/i18n';
import { useKeydown } from '@/shared/lib/dom';

import { meetingTranscriptUpdateMutation } from '../../../api/meetingTranscriptUpdateMutation';
import { TranscriptMatch } from '../../../types/TranscriptMatch';
import { replaceMatches } from '../lib/replaceMatches';
import { TranscriptSearchPanelDeps } from '../types/TranscriptSearchPanelDeps';

export const useTranscriptSearchPanel = (deps: TranscriptSearchPanelDeps) => {
  const [replacement, setReplacement] = createSignal('');
  const [updateState, updateTranscript] = meetingTranscriptUpdateMutation();

  const setQueryInputRef = (element: HTMLInputElement) =>
    requestAnimationFrame(() => element.focus());

  useKeydown((event) => {
    if (event.key === 'Escape') deps.search.close();
  });

  const matchCount = () => deps.search.matches().length;

  const hasMatches = () => matchCount() > 0;

  const hasQuery = () => deps.search.query().trim().length > 0;

  const canReplace = () => hasMatches() && !updateState.fetching;

  const resultsLabel = () =>
    i18n.t('meetings.find.results', {
      current: String((deps.search.currentMatch()?.index ?? -1) + 1),
      total: String(matchCount()),
    });

  const save = (matches: TranscriptMatch[]) => {
    if (!matches.length || updateState.fetching) return;

    const texts = new Map(
      deps.transcript.map((segment) => [segment.id, segment.text]),
    );
    void updateTranscript({
      meetingId: deps.meetingId,
      segments: replaceMatches(texts, matches, replacement()),
    });
  };

  const replaceCurrent = () => {
    const current = deps.search.currentMatch();
    if (current) save([current]);
  };

  const replaceAll = () => save(deps.search.matches());

  const onQueryInput = (event: { currentTarget: HTMLInputElement }) =>
    deps.search.setQuery(event.currentTarget.value);

  const onReplacementInput = (event: { currentTarget: HTMLInputElement }) =>
    setReplacement(event.currentTarget.value);

  const onQueryKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    if (event.shiftKey) deps.search.prevMatch();
    else deps.search.nextMatch();
  };

  const onReplacementKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    replaceCurrent();
  };

  return {
    replacement,
    hasMatches,
    hasQuery,
    canReplace,
    resultsLabel,
    replaceCurrent,
    replaceAll,
    setQueryInputRef,
    onQueryInput,
    onReplacementInput,
    onQueryKeyDown,
    onReplacementKeyDown,
  };
};
