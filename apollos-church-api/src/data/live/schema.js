import { liveSchema } from '@apollosproject/data-schema';
import gql from 'graphql-tag';

export default gql`
  ${liveSchema}
  extend type LiveStream {
    url: Url
  }
`;
