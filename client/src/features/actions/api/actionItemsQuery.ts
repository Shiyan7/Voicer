import type { ActionItemOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { ACTION_ITEMS_QUERY } from './gql/ACTION_ITEMS_QUERY';

interface ActionItemsQuery {
  actionItems: ActionItemOutput[];
}

export const actionItemsQuery = (args?: Omit<CreateQueryArgs, 'query'>) =>
  createQuery<ActionItemsQuery>({
    query: ACTION_ITEMS_QUERY,
    requestPolicy: 'network-only',
    ...args,
  });
