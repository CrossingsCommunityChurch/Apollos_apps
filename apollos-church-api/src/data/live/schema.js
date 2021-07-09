import gql from 'graphql-tag';

export default gql`
  type LiveStream {
    id: ID!
    isLive: Boolean @cacheControl(maxAge: 45)
    eventStartTime: String
    eventEndTime: String
    media: VideoMedia
    webViewUrl: String @cacheControl(maxAge: 120)
    contentItem: ContentItem @cacheControl(maxAge: 600)
    action: ACTION_FEATURE_ACTION
    relatedNode: Node @cacheControl(maxAge: 600)
  }
  extend type Query {
    liveStream: LiveStream
      @deprecated(reason: "Use liveStreams, there may be multiple.")
    liveStreams: [LiveStream] @cacheControl(maxAge: 60)
  }
  extend type WeekendContentItem {
    liveStream: LiveStream
  }
  interface LiveNode {
    liveStream: LiveStream
  }
  extend type WeekendContentItem implements LiveNode
`;
