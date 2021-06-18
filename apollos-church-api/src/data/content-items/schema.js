import { ContentItem } from '@apollosproject/data-connector-rock';
import gql from 'graphql-tag';

export default gql`
  ${ContentItem.schema}

  extend type DevotionalContentItem {
    tags: [String]
    author: String
  }

  extend type UniversalContentItem {
    tags: [String]
    author: String
  }

  extend type ContentSeriesContentItem {
    tags: [String]
    author: String
  }

  extend type MediaContentItem {
    tags: [String]
    author: String
  }

  extend type WeekendContentItem {
    tags: [String]
    author: String
  }

  type LiveContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    webviewURL: String
    mediaURL: String
    htmlContent: String
    summary: String
    childContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    siblingContentItemsConnection(
      first: Int
      after: String
      orderBy: ContentItemsConnectionOrderInput
    ): ContentItemsConnection
    parentChannel: ContentChannel
    theme: Theme
  }
`;
