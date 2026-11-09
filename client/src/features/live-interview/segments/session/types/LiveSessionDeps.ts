import { JSX } from 'solid-js';

import { LiveTurn } from '../../../types/LiveTurn';

export interface LiveSessionDeps {
  header: JSX.Element;
  player?: JSX.Element;
  turns: LiveTurn[];
  emptyLabel: string;
}
