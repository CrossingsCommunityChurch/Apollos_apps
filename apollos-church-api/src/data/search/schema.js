import gql from 'graphql-tag';
import { searchSchema } from '@apollosproject/data-schema';

export default gql`
  ${searchSchema}

  extend type SearchResult {
    tags: [String]
    author: String
  }
`;
