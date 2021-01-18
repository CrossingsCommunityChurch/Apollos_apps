import { ContentItem } from '@apollosproject/data-connector-rock';
import gql from 'graphql-tag';

export default gql`
  ${ContentItem.schema}

  extend type DevotionalContentItem {
    tags: [String]
    author: Person
  }

  extend type UniversalContentItem {
    tags: [String]
    author: Person
  }

  extend type ContentSeriesContentItem {
    tags: [String]
    author: Person
  }

  extend type MediaContentItem {
    tags: [String]
    author: Person
  }

  extend type WeekendContentItem {
    tags: [String]
    author: Person
  }
`;
