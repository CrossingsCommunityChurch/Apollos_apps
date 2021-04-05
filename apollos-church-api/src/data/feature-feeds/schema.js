import gql from 'graphql-tag';

export default gql`
  extend type Query {
    homeHeaderFeedFeatures: FeatureFeed @cacheControl(maxAge: 0)
  }
`;
