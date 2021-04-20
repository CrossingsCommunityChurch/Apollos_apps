import { FeatureFeed as coreFeatureFeed } from '@apollosproject/data-connector-rock';
import { resolverMerge } from '@apollosproject/server-core';

const resolver = {
  Query: {
    homeHeaderFeedFeatures: async (
      root,
      args,
      { dataSources: { FeatureFeed } }
    ) =>
      FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'HOME_HEADER_FEATURES', ...args },
      }),
  },
};

export default resolverMerge(resolver, coreFeatureFeed);
