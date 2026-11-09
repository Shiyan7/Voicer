import { createEffect, createMemo, createSignal, on } from 'solid-js';

import { buildSearchPattern } from '../lib/buildSearchPattern';
import { findTranscriptMatches } from '../lib/findTranscriptMatches';
import { groupMatchesBySegment } from '../lib/groupMatchesBySegment';
import { splitByMatches } from '../lib/splitByMatches';
import { TranscriptSearchDeps } from '../types/TranscriptSearchDeps';

export const useTranscriptSearch = (deps: TranscriptSearchDeps) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [query, setQuery] = createSignal('');
  const [matchCase, setMatchCase] = createSignal(false);
  const [wholeWord, setWholeWord] = createSignal(false);
  const [cursor, setCursor] = createSignal(0);

  const pattern = createMemo(() =>
    buildSearchPattern({
      query: query(),
      matchCase: matchCase(),
      wholeWord: wholeWord(),
    }),
  );

  const matches = createMemo(() =>
    findTranscriptMatches(deps.transcript(), pattern()),
  );

  const matchesBySegment = createMemo(() => groupMatchesBySegment(matches()));

  createEffect(on(pattern, () => setCursor(0), { defer: true }));

  const currentMatch = () => {
    const list = matches();
    return list[Math.min(cursor(), list.length - 1)] ?? null;
  };

  const step = (direction: 1 | -1) => {
    const current = currentMatch();
    if (!current) return;
    const total = matches().length;
    setCursor((current.index + direction + total) % total);
  };

  const nextMatch = () => step(1);

  const prevMatch = () => step(-1);

  const toggleMatchCase = () => setMatchCase((value) => !value);

  const toggleWholeWord = () => setWholeWord((value) => !value);

  const open = () => setIsOpen(true);

  const close = () => {
    setIsOpen(false);
    setQuery('');
  };

  const partsFor = (segmentId: string, text: string) =>
    splitByMatches(text, matchesBySegment().get(segmentId) ?? []);

  const isMatchCurrent = (index: number | null) =>
    index !== null && index === currentMatch()?.index;

  return {
    isOpen,
    query,
    matchCase,
    wholeWord,
    matches,
    currentMatch,
    setQuery,
    toggleMatchCase,
    toggleWholeWord,
    nextMatch,
    prevMatch,
    open,
    close,
    partsFor,
    isMatchCurrent,
  };
};
