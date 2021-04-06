import gql from 'graphql-tag';

export default gql`
  type LiveStream {
    isLive: Boolean @cacheControl(maxAge: 10)
    eventStartTime: String
    media: VideoMedia
    webViewUrl: String
    contentItem: ContentItem
      @cacheControl(maxAge: 10)
      @deprecated(
        reason: "LiveStreams are not limited to ContentItems. Please use 'relatedNode' instead."
      )
    relatedNode: Node
    actions: [LiveStreamAction]
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

  extend enum InteractionAction {
    LIVESTREAM_JOINED
    LIVESTREAM_CLOSED
    VIEWED_ACTION
  }
`;
