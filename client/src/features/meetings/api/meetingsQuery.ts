import type { MeetingOutput } from '@schema';
import { createQuery, CreateQueryArgs } from '@urql/solid';

import { MEETINGS_QUERY } from './gql/MEETINGS_QUERY';

interface MeetingsQuery {
  meetings: MeetingOutput[];
}

export const meetingsQuery = (args?: Omit<CreateQueryArgs, 'query'>) =>
  createQuery<MeetingsQuery>({
    query: MEETINGS_QUERY,
    requestPolicy: 'network-only',
    ...args,
  });
