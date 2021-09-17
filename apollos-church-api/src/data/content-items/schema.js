import { ContentItem } from '@apollosproject/data-connector-postgres';
import gql from 'graphql-tag';

export default gql`
  ${ContentItem.schema}

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
