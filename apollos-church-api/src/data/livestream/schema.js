import gql from 'graphql-tag';

import { liveSchema as schema } from '@apollosproject/data-schema';

export default gql`
  ${schema}
  extend type LiveStream {
    id: ID!
    name: String
    action: ACTION_FEATURE_ACTION
    eventEndTime: String
  }
`;
