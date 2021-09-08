import { ContentItem } from '@apollosproject/data-connector-postgres';
import gql from 'graphql-tag';

export default gql`
  ${ContentItem.schema}

  extend type DevotionalContentItem {
    author: String @cacheControl(maxAge: 6400)
  }

  extend type UniversalContentItem {
    author: String @cacheControl(maxAge: 6400)
  }

  extend type ContentSeriesContentItem {
    author: String @cacheControl(maxAge: 6400)
  }

  extend type MediaContentItem {
    author: String @cacheControl(maxAge: 6400)
  }

  extend type WeekendContentItem {
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
