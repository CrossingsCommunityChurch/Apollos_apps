import gql from 'graphql-tag';

export default gql`
  type LiveStream {
    id: ID!
    isLive: Boolean @cacheControl(maxAge: 10)
    eventStartTime: String
    eventEndTime: String
    media: VideoMedia
    webViewUrl: String
    contentItem: ContentItem @cacheControl(maxAge: 10)

    relatedNode: Node
  }
  extend type Query {
    liveStream: LiveStream
      @deprecated(reason: "Use liveStreams, there may be multiple.")
    liveStreams: [LiveStream] @cacheControl(maxAge: 10)
  }
  extend type WeekendContentItem {
    liveStream: LiveStream
  }
  interface LiveNode {
    liveStream: LiveStream
  }
  extend type WeekendContentItem implements LiveNode
`;
