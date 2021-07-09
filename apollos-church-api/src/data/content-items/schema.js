import { ContentItem } from '@apollosproject/data-connector-rock';
import gql from 'graphql-tag';

export default gql`
  ${ContentItem.schema}

  extend type DevotionalContentItem {
    tags: [String] @cacheControl(maxAge: 6400)
    author: String @cacheControl(maxAge: 6400)
  }

  extend type UniversalContentItem {
    tags: [String] @cacheControl(maxAge: 6400)
    author: String @cacheControl(maxAge: 6400)
  }

  extend type ContentSeriesContentItem {
    tags: [String] @cacheControl(maxAge: 6400)
    author: String @cacheControl(maxAge: 6400)
  }

  extend type MediaContentItem {
    tags: [String] @cacheControl(maxAge: 6400)
    author: String @cacheControl(maxAge: 6400)
  }

  extend type WeekendContentItem {
    tags: [String] @cacheControl(maxAge: 6400)
    author: String @cacheControl(maxAge: 6400)
  }

  type LiveContentItem implements ContentItem & Node {
    id: ID!
    title(hyphenated: Boolean): String
    publishDate: String
    coverImage: ImageMedia
    images: [ImageMedia]
    videos: [VideoMedia]
    audios: [AudioMedia]
    webviewURL: String @cacheControl(maxAge: 2400)
    mediaURL: String @cacheControl(maxAge: 2400)
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
