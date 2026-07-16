import { gql } from '@urql/solid';

export const USER_ME_QUERY = gql`
  query UserMe {
    userMe {
      id
      email
      name
      avatar
      createdAt
      updatedAt
    }
  }
`;
