import { FeatureFeed } from '@apollosproject/data-connector-rock';

const { resolver: coreResolver, dataSource } = FeatureFeed;

const resolver = {
  ...coreResolver,
  Query: {
    ...coreResolver.Query,
    LiveFeedFeatures: (root, args, { dataSources }) =>
      dataSources.FeatureFeed.getFeed({
        type: 'apollosConfig',
        args: { section: 'Live_Streams', ...args },
      }),
  },
};
export { dataSource, resolver };
