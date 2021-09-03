import gql from 'graphql-tag';
import { Feature } from '@apollosproject/data-connector-postgres';

export default gql`
  ${Feature.schema}
  type LiveStreamAction {
    relatedNode: Node
    action: ACTION_FEATURE_ACTION
    title: String
    duration: Int
    image: String
    start: Int
  }
  type LiveStreamListFeature implements Feature & Node {
    id: ID!
    order: Int
    title: String
    subtitle: String
    liveStreams: [LiveStream]
  }
  extend type Query {
    LiveFeedFeatures: FeatureFeed @cacheControl(maxAge: 120)
  }
`;
