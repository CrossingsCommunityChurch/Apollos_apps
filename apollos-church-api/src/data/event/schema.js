import gql from 'graphql-tag';

import { eventSchema as schema } from '@apollosproject/data-schema';

export default gql`
  ${schema}
  extend type Query {
    allEvents: [Event] @cacheControl(maxAge: 3600)
  }
`;
